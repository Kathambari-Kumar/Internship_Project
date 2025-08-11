import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
//import { useTranslations } from "next-intl";

import SheetBar from "./sheetbar";

export default function CustomerSubNavbar() {
    //const t = useTranslations("Navbar");
  return (
    <div className="relative z-10 bg-white py-3">
      {/* Desktop Navigation */}
      <NavigationMenu className="hidden lg:flex justify-center ">
        <NavigationMenuList className="flex w-full items-center px-5 text-base font-bold font-sans">
          {/* Centered Navigation Links */}
          <div className="flex flex-grow space-x-10">
            {/* Glasses Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-black hover:text-blue-800">
                {"glasses"}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="absolute bg-white shadow-lg p-2">
                <div>
                  <ul className="space-y-1">
                    <li>
                      <NavigationMenuLink
                        className="block px-4 py-2 hover:text-blue-800 hover:underline text-black"
                        href="/user/glasses/Glasses"
                      >
                        {"glasses"}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        className="block px-4 py-2 hover:text-blue-800 hover:underline text-black"
                        href="/user/glasses/Progressive"
                      >
                        {"progressive"}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        className="block px-4 py-2 hover:text-blue-800 hover:underline text-black"
                        href="/user/glasses/Lenses"
                      >
                        {"lenses"}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        className="block px-4 py-2 hover:text-blue-800 hover:underline text-black"
                        href="/user/glasses/SurfaceTreatment"
                      >
                        {"SurfaceTreatment"}
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        className="block px-4 py-2 hover:text-blue-800 hover:underline text-black"
                        href="/user/glasses/TypesOfGlass"
                      >
                        {"different"}
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Eye Health Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-black hover:text-blue-800">
                <Link
                  href="/user/EyeHealth"
                  className="px-4 py-2 hover:text-blue-800"
                >
                  {"EyeHealth"}
                </Link>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="absolute bg-white shadow-lg p-2">
                <ul className="space-y-1">
                  <li>
                    <NavigationMenuLink
                      className="block px-4 py-2 hover:text-blue-800 hover:underline text-black"
                      href="/user/EyeHealth/EyeCareTips"
                    >
                      {"EyeCare"}
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      className="block px-4 py-2 hover:text-blue-800 hover:underline text-black"
                      href="/user/EyeHealth/EyeExamination"
                    >
                      {"EyeExamination"}
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      className="block px-4 py-2 hover:text-blue-800 hover:underline text-black"
                      href="/user/EyeHealth/EyeDoctor"
                    >
                      {"Docters appointment"}
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      className="block px-4 py-2 hover:text-blue-800 hover:underline text-black"
                      href="/user/EyeHealth/Booking"
                    >
                      {"Book a FREE eye examination"}
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                href="/information/about"
                className="px-4 py-2 hover:text-blue-800"
              >
                {"Om ovesOptik"}
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/user/contact"
                className="px-4 py-2 hover:text-blue-800"
              >
                {"contact"}
              </Link>
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>

      <SheetBar />

      <hr className="mt-3 border-gray-300" />
    </div>
  );
}
