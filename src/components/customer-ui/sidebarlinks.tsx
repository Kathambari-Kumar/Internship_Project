"use client";

import {
  HomeIcon,
  LucideProps,
  PhoneIcon,
  ClockIcon,
  GlassesIcon,
  EyeIcon,
  BedIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { cn } from "../../lib/utils";
import { useState } from "react";

// instead of giving direct menu items
// create an interface with menu properties
interface icustomerprops {
  id: number;
  name: string;
  href?: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  children?: icustomerprops[]; // optional for nested links
}

// popoulate the interface array with values (menu items)
export const dashboardLinks: icustomerprops[] = [
  {
    id: 0,
    name: "Home",
    href: "/home",
    icon: HomeIcon,
  },

  {
    id: 1,
    name: "Bokning",
    href: "/booking",
    icon: ClockIcon,
  },

  {
    id: 2,
    name: "Glasögon",
    href: "/glasses",
    icon: GlassesIcon,
  },

  {
    id: 3,
    name: "Progressiv",
    href: "/progressiv",
    icon: PhoneIcon,
  },

  {
    id: 4,
    name: "Linsor",
    href: "/lenses",
    icon: EyeIcon,
  },

  {
    id: 5,
    name: "Ytbehandling",
    href: "/surfaceTreatement",
    icon: BedIcon,
  },

  {
    id: 6,
    name: "Ögonvård", // Parent item
    icon: ClockIcon,
    children: [
      {
        id: 61,
        name: "Ögonundersökning",
        href: "/eyeExamination",
        icon: ClockIcon,
      },
      {
        id: 62,
        name: "Ögonvårdstips",
        href: "/eyeCareTips",
        icon: ClockIcon,
      },
  
      {
        id: 63,
        name: "Träffa en ögonläkare",
        href: "/visitDoctor",
        icon: ClockIcon,
      },
    ],
  },
];

type DashboardLinksProps = {
  onSelect?: () => void;
};

export function CustomerDashboardLinks({onSelect} : DashboardLinksProps) {
    const pathname = usePathname();
    const [openId, setOpenId] = useState<number | null>(null);
  
    return (
        <>
      
        {dashboardLinks.map((link) => ( //loop for menu
          <div key={link.id}>
            {/* if a parent link has child */} 
            {link.children ? (
              <>
              {/*Dropdown Toggle Button*/}
                <button
                  onClick={() => setOpenId(openId === link.id ? null : link.id)}
                  className={cn(
                    "flex w-full items-center gap-2 text-lg rounded px-3 py-2 transition",
                    openId === link.id
                      ? "bg-primary/10 text-black"
                      : "text-black hover:text-teal-700"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{link.name}</span>
                  {openId === link.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                 {/* loop through the child */}
                {openId === link.id && (
                  <div className="ml-5 mt-1 space-y-1">
                    
                    {link.children.map((child) => (
                    
                      <Link
                        key={child.id}
                        href={child.href || "#"}
                        className={cn(
                          pathname === child.href
                            ? "text-black bg-primary/10"
                            : "text-black hover:text-teal-700",
                          "flex items-center gap-2 rounded px-3 py-1 text-base"
                        )}
                        onClick={onSelect}
                      >
                        <child.icon className="h-3 w-3" />
                        {child.name}
                        
                      </Link>
                      
                    ))}
                    
                  </div>
                )}
              </>
            ) : (

             // if a parent link has child 
              <Link
                href={link.href || "#"}
                className={cn(
                  pathname === link.href
                    ? "text-black bg-primary/10"
                    : "text-black hover:text-teal-700",
                  "flex items-center gap-2 rounded px-3 py-2 text-lg"
                )}
                onClick={onSelect}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            )}
            <div className="h-px w-full bg-gray-400 my-1" />
          </div>
        ))}
    </>
    );
  }