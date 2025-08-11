"use client";

import {
  HomeIcon,
  LayoutDashboard,
  LucideProps,
  PhoneIcon,
  Users,
  Settings,
  ClockIcon,
  Notebook,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { cn } from "../../lib/utils";

// instead of giving direct menu items
// create an interface with menu properties
interface iadminprops {
  id: number;
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

// popoulate the interface array with values (menu items)
export const dashboardLinks: iadminprops[] = [
  {
    id: 0,
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    id: 1,
    name: "Evenemang",
    href: "/events",
    icon: HomeIcon,
  },

  {
    id: 2,
    name: "Ny Bokning",
    href: "/bookappointment",
    icon: PhoneIcon,
  },

  {
    id: 3,
    name: "Kunder",
    href: "/customers",
    icon: Users,
  },

  {
    id: 4,
    name: "Inställningar",
    href: "/adminSettings",
    icon: Settings,
  },

  {
    id: 5,
    name: "Skapa tidslucka",
    href: "/timeslots",
    icon: ClockIcon,
  },

  {
    id: 6,
    name: "Glasögonrecept",
    href: "/prescription",
    icon: Notebook,
  },
];



export function DashboardLinks() {
  // this is for designing the link while
  // it is active!
  const pathName = usePathname();
  return (
    <>
      {dashboardLinks.map((link) => (
        <Link
          className={cn(
            pathName === link.href
              ? "text-black bg-primary/10"
              : "text-teal-700 hover:text-amber-600",
            "flex items-center gap-3 rounded-lg px-3 text-lg py-2 transition-all hover:text-yellow-600"
          )}
          key={link.id}
          href={link.href}
        >
          <link.icon className="size-5" />
          {link.name}
        </Link>
      ))}
    </>
  );
}
