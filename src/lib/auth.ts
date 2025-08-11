import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import nodemailer from "nodemailer";
import { customVerifyPatch } from "@/lib/custom-magic-link-verify";
import twilio from 'twilio';

export type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;

// needed after login to get the session

const twilioClient = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);
export const auth = betterAuth({
  
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },

  plugins: [
    nextCookies(),
    magicLink({
      expiresIn: 60 * 60 * 24 * 365 * 1, // 1 years
      disableSignUp: false, // Allow new users to sign up using the link
      sendMagicLink: async ({ email, token, url }, request) => {
        console.log(request?.formData);
        // If phone is sent from frontend
        let phone: string | undefined;

        try {
          const urlObj = new URL(url);
          const siteBaseURL = process.env.NEXT_PUBLIC_SITE_URL; 
          const callbackURL = urlObj.searchParams.get("callbackURL");
          if (callbackURL) {
            const callbackURLObj = new URL(callbackURL, siteBaseURL); 
            const phoneParam = callbackURLObj.searchParams.get("phone");
            if (phoneParam) {
              phone = phoneParam.replace(/^0/, "+46").replace(/\s+/g, "");
            }
          }
        } catch (e) {
          console.warn("Failed to parse request body", e);
        }
      
      // send the magiclink via sms  
      // Skipping SMS send on or after 24-07-2025
      // since twilio is running trial account
      // so date check
      const checkDate = new Date("2025-07-23");
      const date = new Date().toISOString().split("T")[0]; // "2025-06-16"
      const currentDate = new Date(date);
        if (phone && currentDate < checkDate) {
            try {
              await twilioClient.messages.create({
                body: `Klicka på länken för att hantera din bokning: ${url}`,
                from: process.env.TWILIO_PHONE!,
                to: phone,
              });
            } catch (err) {
              console.log("Error", err);
              throw new Error("SMS sending failed");
            }
        }
      // Send magic link to customer
        console.log("Magic link for", email);
        console.log("Token:", token);
        console.log("URL:", url);
        console.log("Phone : ", phone);
      // Call email service (e.g. Resend, Nodemailer) here
      
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "digitaldragons571@gmail.com",
            pass: process.env.GMAIL_APP_PASSWORD!, 
          },
        });

        if (email) { 
          await transporter.sendMail({
            from: "digitaldragons571@gmail.com",
            to: email,
            subject: "Hantera din bokning",
            html: `
              <p>Klicka på länken nedan för att hantera din bokning:</p>
              <p><a href="${url}">Hantera bokning</a></p>
  
            `,
          });
        }      
      },
    }),
    customVerifyPatch,
  ],
});
