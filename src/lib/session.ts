import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import type { AuthSession } from "./auth";
import prisma from "./prisma";

export async function createAdminUser(userId: string) {
  return await prisma.admin.upsert({
    where: { userId },
    update: { isAdmin: true },
    create: {
      userId,
      isAdmin: true,
    },
  });
}

export async function ensureAdminAccess() {
  /* this retrieves the authenticated session using 
     the headers, ensuring only logged-in users can proceed. */
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/"); // Not logged in
  }

  const admin = await prisma.admin.findUnique({
    where: { userId: session.user.id },
  });

  if (!admin?.isAdmin) {
    redirect("/"); // Not an admin
  }

  return session;
}

export async function ensureCustomerAccess(): Promise<AuthSession> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/"); // Not logged in
  }
  return session; // Return the session if logged in
}
