import  React from "react";
import { auth, AuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { DashboardLinks } from "@/components/admin-ui/dashboarlinks";
import { Sheet, SheetContent, SheetTitle } from  "@/components/ui/sheet";
import { Menu, UserIcon } from "lucide-react";
import { SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children : React.ReactNode;
}>)  {
    const session: AuthSession = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session) {
        return redirect("/");
      }

    return (
        <div className="min-h-screen w-full grid md:grid-cols-[220px_1fr] 
                        lg:grid-cols-[280px_1fr]">
            <div className="hidden md:block border-r bg-gray-200">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 bg-black items-center border-b px-4 
                        lg:h-[60px] lg:p-6 justify-center">
                        <Link href="/">
                            <Image
                            className="dark:invert"
                            src="/OvesLogo.png"
                            alt="OvesOptik"
                            width={115}
                            height={18}
                            />
                        </Link>
                    </div>
                      
                    <div className="flex-1">
                        <nav className="grid items-start px-2 lg:px-4 text-black">
                        <DashboardLinks />
                        </nav>
                    </div>
                </div>
            </div>
             
            <div className="flex flex-col">
                <header className="flex h-14 bg-gray-200 items-center gap-4 border-b px-4 
                        lg:h-[60px] lg:p-6">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button className="md:hidden shrink-0" 
                                size="icon" variant="outline">
                                    <Menu className="size-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetTitle className="md:hidden shrink-0">Visa meny</SheetTitle>
                            <SheetContent className="flex flex-col">
                                <nav className="grid gap-2">
                                    <DashboardLinks></DashboardLinks>
                                </nav>

                            </SheetContent>
                        </Sheet>
                        <div className="ml-auto flex h-10 items-center gap-x-4">    
                            <form className="w-full"
                            action={async() => {
                                "use server"
                                await authClient.signOut();
                                redirect("/sign-in") // redirect to login page
                            }}><button className="font-bold px-4 py-2 rounded-md bg-black 
                            text-white 
                            hover:bg-teal-700 
                            transition-colors border-none" type="submit">Logga ut</button></form>
                            <Button variant="secondary"
                                    size="icon"
                                    className="rounded-full">
                                         <UserIcon className="w-6 h-6" />
                                    </Button>
                        </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}