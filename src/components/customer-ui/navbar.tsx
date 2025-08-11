"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import React from "react";
import { Lora } from "next/font/google";
const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });

// Main navbar menu for customer's home layout
export default function CustomerNavbar() {
  return (
    <>
          <div className="flex mt-2 space-x-4">
          <Link
                href="/home"
                className={`${lora.className} pe-2 mt-1 text-2xl font-bold text-center text-white hover:text-yellow-500`}
              >
                {"Om OvesOptik"}
              </Link>
              <Link
                href="/contactForm"
                className={`${lora.className} pe-2 mt-1 text-2xl font-bold text-center text-white hover:text-yellow-500`}>
                {"Kontakt"}
              </Link>
            <Button className="text-black bg-amber-300 hover:bg-yellow-500 px-4 py-2 rounded-full text-base hidden lg:flex">
              <Link href="/booking">{"Boka SynUndersökning"}</Link>
              {/* Boka synundersökning  */}
            </Button>
          </div>
      </>
  );
}
