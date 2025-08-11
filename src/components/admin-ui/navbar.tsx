import Link from "next/link";
import React from "react";
import { AirVent } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Navbar() {
  // method call to be retrieving a session
  // for user related data
  // passed an object as as argument 
  // to getSession using header property
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="border-b px-4">
      <div className="flex items-center justify-between mx-auto-4xl h-16">
        <Link href="/" className="flex items-center gap-2">
          <AirVent className="h-6 w-6"></AirVent>
          <span className="font-bold">nextsecure.</span>
        </Link>
        <div>
          {session ? (
            <form
              action={async () => {
                "use server";
                await auth.api.signOut({
                  headers: await headers(),
                });
                redirect("/");
              }}
            >
              <Button type="submit">Sign Out</Button>
            </form>
          ) : (
            <Link href="/sign-in" className={buttonVariants()}>
              Sign In
            </Link>
           
          )}
        </div>
      </div>
    </div>
  );
}