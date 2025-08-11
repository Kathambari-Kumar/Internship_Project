import { ToastContainer } from "react-toastify";
import TimeSlotForm from "../../../components/admin-ui/timeslot-form";
import React from "react";

export default function TimeSlotPage()  {
    return( 
        <div className="flex items-center justify-center min-h-screen w-full">
            <TimeSlotForm></TimeSlotForm>
            <ToastContainer></ToastContainer>
        </div>
    );
}
