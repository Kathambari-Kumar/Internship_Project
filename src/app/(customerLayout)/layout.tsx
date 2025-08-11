"use client";

import React, { useState } from "react";
import CustomerNavbar from "@/components/customer-ui/navbar";
import Link from "next/link";
import Image from "next/image";
import { CustomerDashboardLinks } from "@/components/customer-ui/sidebarlinks";
import Footer from "@/components/customer-ui/footer";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from  "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen justify-between flex flex-col">
      <div
        className=" w-full grid md:grid-cols-[220px_1fr] 
                        lg:grid-cols-[280px_1fr]"
      >
        <div className="hidden md:block border-r bg-amber-200">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div
              className="flex h-14 bg-teal-700 items-center border-b px-4 
                        lg:h-[70px] lg:p-6 justify-center"
            >
              <Link href="/">
                <Image
                  className="dark:invert float-left"
                  src="/OvesLogo.png"
                  alt="OvesOptik"
                  width={180}
                  height={38}
                  priority
                />
              </Link>
            </div>

            <div className="flex-1">
              <nav className="grid items-start px-2 lg:px-4">
                {/* Side Bar home, glass, etc  */}
                <CustomerDashboardLinks></CustomerDashboardLinks>
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <header
            className="flex h-14 bg-teal-700 items-center gap-4 border-b px-4 
                        lg:h-[70px] lg:p-6"
          >
             <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button className="md:hidden shrink-0" 
                    size="icon" variant="outline">
                        <Menu className="size-5" />
                    </Button>
                </SheetTrigger>
                <SheetTitle className="md:hidden shrink-0 text-white">Visa meny</SheetTitle>
                <SheetContent className="flex flex-col">
                    <nav className="grid gap-2">
                        <CustomerDashboardLinks onSelect={() => setIsOpen(false)}></CustomerDashboardLinks>
                    </nav>

                </SheetContent>
            </Sheet>
            <div className="ml-auto flex h-10 items-center gap-x-4">
              {/* kontakt, om ovesoptic, bokning  */}
              <CustomerNavbar></CustomerNavbar>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
