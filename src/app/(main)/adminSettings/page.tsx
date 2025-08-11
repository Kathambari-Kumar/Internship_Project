import ShopSettings from "@/components/admin-ui/shopContactDetailsForm";
import React from "react";
import { ToastContainer } from "react-toastify";

export default function SettingsPage()  {
    return( 
        <div className="flex items-center justify-center min-h-screen w-full">
            <ShopSettings></ShopSettings>
            <ToastContainer></ToastContainer>
        </div>
    );
}
