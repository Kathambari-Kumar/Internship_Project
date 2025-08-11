
import React from "react";
import EventCreateForm from "@/components/admin-ui/eventCreateForm";

export default function EventPage()  {
    return( 
        <div className="flex items-center justify-center min-h-screen w-full">
           {/*  <EventForm></EventForm> */}
           <EventCreateForm></EventCreateForm>   
        </div>
    );
}
