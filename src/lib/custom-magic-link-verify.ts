import { z } from "zod";
import { createAuthEndpoint } from "better-auth/api";
import type { BetterAuthPlugin } from "better-auth";
import { setSessionCookie } from "better-auth/cookies";

import { originCheck } from "better-auth/api";

// custom verification endpoint (flexible authentication library) 
// using better-auth
const myCustomVerifyFunction = createAuthEndpoint(
  "/magic-link/verify", // setups the endpoint
  {
    method: "GET", // endpoint accepts GET request 
    query: z.object({
      token: z.string({ // expects a token
        description: "Verification token",
      }),
      callbackURL: z // where to redirect after verification
        .string({
          description:
            "URL to redirect after magic link verification, if not provided will return session",
        })
        .optional(),
    }),
    use: [ //runs a middleware to check the origin of the request
      originCheck((ctx) => { 
        return ctx.query.callbackURL
          ? decodeURIComponent(ctx.query.callbackURL)
          : "/";
      }),
    ],
    requireHeaders: true,
    metadata: {
      openapi: { // OpenAPI documentation for the route
        description: "Verify magic link",
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                /* 
                    components:
                    schemas:
                      Session:
                        type: object
                        properties:
                          token:
                            type: string
                          expiresAt:
                            type: string
                            format: date-time
                      User:
                        type: object
                        properties:
                          id:
                            type: string
                          email:
                            type: string
                          name:
                            type: string
                          emailVerified:
                            type: boolean
                */
                schema: { // defines the shape of the API response
                  type: "object",
                  properties: {
                    session: { // session property
                      $ref: "#/components/schemas/Session",
                    },
                    user: { // user property
                      $ref: "#/components/schemas/User",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  /* 
    ctx : short for context. is an object automatically passed 
    into your handler by the better-auth framework
  */
  async (ctx) => {
    const token = ctx.query.token; // token from URL 
    const callbackURL = ctx.query.callbackURL // optional redirect URL
      ? decodeURIComponent(ctx.query.callbackURL)
      : "/";
    const toRedirectTo = callbackURL?.startsWith("http")
      ? callbackURL
      : callbackURL
      ? `${ctx.context.options.baseURL}${callbackURL}`
      : ctx.context.options.baseURL; // site's or app's base URL

      // handles  DB ops: users, sessions, verifications
    const tokenValue = await ctx.context.internalAdapter.findVerificationValue(
      token
    );

    if (!tokenValue) {
      throw ctx.redirect(`${toRedirectTo}?error=INVALID_TOKEN`);
    }

    if (tokenValue.expiresAt < new Date()) {
      await ctx.context.internalAdapter.deleteVerificationValue(tokenValue.id);
      throw ctx.redirect(`${toRedirectTo}?error=EXPIRED_TOKEN`);
    }

    //   await ctx.context.internalAdapter.deleteVerificationValue(
    //     tokenValue.id
    //   );

    // Get the customer's email and name from the token value:
    const { email, name } = JSON.parse(tokenValue.value) as {
      email: string;
      name?: string;
    };

    // Try to find existing user by email
    let user = await ctx.context.internalAdapter
      .findUserByEmail(email)
      .then((res) => res?.user);

    // If user doesn't exist and sign-up is allowed → create user:
    if (!user) {
      if (
        !ctx.context.options.plugins?.some(
          (p) => p.id === "magic-link" && p.options?.disableSignUp
        )
      ) {
        const newUser = await ctx.context.internalAdapter.createUser({
          email: email,
          emailVerified: true,
          name: name || "",
        });
        user = newUser;
        if (!user) {
          throw ctx.redirect(`${toRedirectTo}?error=failed_to_create_user`);
        }
      } else {
        throw ctx.redirect(`${toRedirectTo}?error=new_user_signup_disabled`);
      }
    }

    // Mark email as verified
    if (!user.emailVerified) {
      await ctx.context.internalAdapter.updateUser(user.id, {
        emailVerified: true,
      });
    }
    // Create Session & Set Cookie
    const session = await ctx.context.internalAdapter.createSession(
      user.id,
      ctx.request
    );

    if (!session) {
      throw ctx.redirect(`${toRedirectTo}?error=failed_to_create_session`);
    }

    await setSessionCookie(ctx, {
      session,
      user,
    });
    // Return session or redirect
    if (!ctx.query.callbackURL) {
      // Return JSON response
      return ctx.json({ // return session and user info as JSON
        token: session.token,
        user: {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
          name: user.name,
          image: user.image,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    }
    throw ctx.redirect(callbackURL);
  }
);
export const customVerifyPatch: BetterAuthPlugin = {
  id: "custom-verify-patch",
  endpoints: {
    magicLinkVerify: myCustomVerifyFunction,
  },
};

/*
https://DomainName.com/magic-link/verify?token=abc123&callbackURL=/dashboard
better-auth validates token, checks user, sets session cookie
Redirects to /dashboard (or returns session if no redirect)
*/