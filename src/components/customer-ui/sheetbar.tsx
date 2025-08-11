"use client";

import { ChevronDown, Menu } from "lucide-react";
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader,  
  SheetTitle 
} from "../ui/sheet";
import { Button } from "../ui/button";
//import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import React from "react";

export default function SheetBar() {
    //const t = useTranslations("Navbar");
    const [isOpen, setIsOpen] = useState(false); 
    const [glassesOpen, setGlassesOpen] = useState(false);
    const [eyeHealthOpen, setEyeHealthOpen] = useState(false);
    
    const handleLinkClick = (url: string) => {
        setIsOpen(false);  
        window.location.href = url;  
    };

    return (
        <nav className="block lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" onClick={() => setIsOpen(true)} className="mx-1">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent className="fixed top-0 left-0 z-50 h-full min-w-60 bg-blue-100 p-4 space-y-3">
                    <SheetHeader>
                        <SheetTitle></SheetTitle>
                    </SheetHeader>
                    <div className="p-4 space-y-3">
                        
                        {/* Glasses Dropdown */}
                        <div>
                            <button 
                                onClick={() => setGlassesOpen(!glassesOpen)} 
                                className="w-full text-left text-base flex justify-between items-center"
                            >
                                <span>{"glasses"}</span>
                                <ChevronDown className={`transition-transform ${glassesOpen ? "rotate-180" : ""}`} />
                            </button>
                            {glassesOpen && (
                                <div className="pl-5 mt-2 space-y-2">
                                    <Link className="block text-sm text-black hover:text-gray-600 hover:underline" onClick={() => handleLinkClick("/user/glasses/Glasses")} href="#">
                                        {"glasses"}
                                    </Link>
                                    <Link className="block text-sm text-black hover:text-gray-600 hover:underline" onClick={() => handleLinkClick("/user/glasses/Progressive")} href="#">
                                        {"progressive"}
                                    </Link>
                                    <Link className="block text-sm text-black hover:text-gray-600 hover:underline" onClick={() => handleLinkClick("/user/glasses/Lenses")} href="#">
                                        {"lenses"}
                                    </Link>
                                    <Link className="block text-sm text-black hover:text-gray-600 hover:underline" onClick={() => handleLinkClick("/user/glasses/SurfaceTreatment")} href="#">
                                        {"SurfaceTreatment"}
                                    </Link>
                                    <Link className="block text-sm text-black hover:text-gray-600 hover:underline" onClick={() => handleLinkClick("/user/glasses/TypesOfGlass")} href="#">
                                        {"different"}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Eye Health Dropdown */}
                        <div>
                            <button 
                                onClick={() => setEyeHealthOpen(!eyeHealthOpen)} 
                                className="w-full text-left text-base flex justify-between items-center"
                            >
                                <span>{"EyeHealth"}</span>
                                <ChevronDown className={`transition-transform ${eyeHealthOpen ? "rotate-180" : ""}`} />
                            </button>
                            {eyeHealthOpen && (
                                <div className="pl-5 mt-2 space-y-2">
                                    <Link className="block text-sm text-black hover:text-gray-600 hover:underline" onClick={() => handleLinkClick("/user/EyeHealth/EyeCareTips")} href="#">
                                        {"EyeCare"}
                                    </Link>
                                    <Link className="block text-sm text-black hover:text-gray-600 hover:underline" onClick={() => handleLinkClick("/user/EyeHealth/EyeExamination")} href="#">
                                        {"EyeExamination"}
                                    </Link>
                                    <Link className="block text-sm text-black hover:text-gray-600 hover:underline" onClick={() => handleLinkClick("/user/EyeHealth/EyeDoctor")} href="#">
                                        {"Docters appointment"}
                                    </Link>
                                    <Link className="block text-sm text-black hover:text-gray-600 hover:underline" onClick={() => handleLinkClick("/user/EyeHealth/Booking")} href="#">
                                        {"Book a FREE eye examination"}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* about & contact Link */}
                        <Link className="block text-base text-black hover:text-gray-600" onClick={() => handleLinkClick("/user/about")} href="#">
                            {"about"}
                        </Link>
                        <Link className="block text-base text-black hover:text-gray-600" onClick={() => handleLinkClick("/user/contact")} href="#">
                            {"contact"}
                        </Link>
                    </div>

                    {/* Bottom Button */}
                    <Button className="text-black bg-yellow-500 px-4 py-2 rounded-full text-sm">
                        <Link onClick={() => handleLinkClick("/admin/appointment")} href="">Boka synundersökning</Link> 
                    </Button>
                </SheetContent>
            </Sheet>
        </nav>
    );
}
