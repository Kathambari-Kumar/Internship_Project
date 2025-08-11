
// components/admin-ui/EventUpdateDeleteDialog.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { DateSelectArg } from "@fullcalendar/core/index.js";
import { CheckConflictWithAppointment, CheckEventsOverlap, DeleteEvent, UpdateEvent } from "@/app/(main)/actions/handleEvents";
import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { eventSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, ToastOptions, toast } from "react-toastify";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import CalendarForEventUpdate from "./calendarForEventUpdate";

interface EventDialogProps {
  open: boolean;
  /* 
        onOpenChange  : type of the function:
        It takes one argument named 'open' of type boolean (i.e., true or false)
        It returns nothing (void) 
    */
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  event: {
    id : number;
    title: string;
    description? : string;
    date: string;
    startTime: string;
    endTime: string;
  } | null;
}


const EventUpdateDeleteDialog: React.FC<EventDialogProps> = ({ open, onOpenChange, onSuccess, event }) => {

    const {register, handleSubmit, control, setValue, reset, formState:{errors}} = 
    useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      isPrivate :false,
    },
    });
  
    
    useEffect(() => {
        if (event) { reset ({
            title: event.title,
            description: event.description,
            startTime: event.startTime,
            endTime: event.endTime,
            isPrivate: false, 
        });
            setSelectedSlot({startStr : event.startTime, endStr:event.endTime});
        }
    }, [event, reset]);

    const [step, setStep] = React.useState(1);
    const [selectedSlot, setSelectedSlot] = useState<{ startStr: string; endStr: string } | null>(null);

    useEffect(() => {
      if (selectedSlot?.endStr) {
        setValue("endTime", selectedSlot.endStr);
      }
    }, [selectedSlot?.endStr, setValue]);

    useEffect(() => {
      if (selectedSlot?.startStr) {
        setValue("startTime", selectedSlot.startStr);
      }
    }, [selectedSlot?.startStr, setValue]);

    // Reset step to 1 every time the dialog opens
    useEffect(() => {
      if (open) {
        setStep(1);
      }
    }, [open]); 
    const toastOptions: ToastOptions = {
      autoClose: 2000,
      onClose: () => {
        onOpenChange(false); // close dialog after toast
        onSuccess();
        /* setTimeout(() => {
         window.location.href = "/dashboard";
        }, 100); */
      },
    };

    /* this is triggered while date is selected in FullCalendar.
        And checked any conflicts or overlap exist.
        IF not, set those values in state variable
    */
    const handleDateSelect = async (selectInfo: DateSelectArg) => {
        console.log("Time Selected");
        console.log("Start Time Selected", selectInfo.startStr);
        console.log("End Time Selected", selectInfo.endStr);
       const conflictResult = await CheckConflictWithAppointment(selectInfo.startStr, selectInfo.endStr);
       const overlapResult = await CheckEventsOverlap(selectInfo.startStr, selectInfo.endStr);
        if (conflictResult === "Error" || overlapResult === "Error") {
           toast.warning("Timeslot conflict/overlap with an existing appointment or event. Select some other Date");
          }
        else {
            setSelectedSlot({startStr : selectInfo.startStr,endStr : selectInfo.endStr});
        }
    };

    const  handleUpdateEvent = async (data:z.infer<typeof eventSchema>, id :number) => {
      try {
            await UpdateEvent(data, id);
            toast.success("Uppdatering av händelsen lyckades!", toastOptions);
          } catch (error) {
            toast.error("Uppdatering av händelsen MissLyckades!.", toastOptions);
            console.error("Error updating event:", error);
          }
    };

    const handleDeleteEvent = async (id: number) => {
        const confirmDelete = window.confirm("Är du säker på att du vill radera denna händelse?");
        if (!id) {
            toast.error("Ingen giltig event ID hittades.");
            return;
        }
        
        if (confirmDelete) {
          try {
            await DeleteEvent(id); 
            toast.success("Händelsen har raderats!", toastOptions);
          } catch (error) {
            toast.error("Misslyckades med att radera händelsen.", toastOptions);
            console.error("Error deleting event:", error);
          }
        }
      };
  
    const onSubmit = async (data: z.infer<typeof eventSchema>) => {
    if (step === 2) {
      if (!event?.id) {
          toast.error("Ingen giltig event ID hittades.");
          return;
        }
        await handleUpdateEvent(data, event.id);
    }
    };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-auto w-full">
        <DialogHeader>
          <DialogTitle>Update/Delete Event</DialogTitle>
        </DialogHeader>

        {event && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
            {step === 1 && (<>
            <div className="flex gap-6 justify-between mb-4">
                <div className="w-1/2">
                    <label htmlFor="title" 
                    className="text-1xl font-medium text-black">
                        Titel
                    </label>
                    <Input autoFocus id="title" {...register("title")} className="rounded-md mt-2" />
                    {errors.title && (<p className="text-red  text-sm mt-1">{errors.title.message}</p>)}                   
                </div>
                
                <div className="w-1/2">
                <label htmlFor="isPrivate" 
                className="text-1xl mt-2 font-medium text-black">
                    Event Privacy
                </label>
                <Controller name="isPrivate" control={control} render={({field}) => (
                    <Select value={field.value ? "true" : "false"}
                        onValueChange={(value) => field.onChange(value === "true")}>
                    <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select Privacy" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">Private</SelectItem>
                        <SelectItem value="false">Public</SelectItem>
                    </SelectContent>
                    </Select>
                )            
                }></Controller>

                {errors.isPrivate && (<p className="text-red  text-sm mt-1">{errors.isPrivate.message}</p>)}
                
                </div>  
            </div> 

          <div className="mb-4">
              <label htmlFor="desription" 
              className="text-1xl mt-2 font-medium text-black">
                  Beskrivning
              </label>
              <Textarea id="description" {...register("description")} className="mt-2" />    
              {errors.description && (<p className="text-red text-sm mt-1">{errors.description.message}</p>)}                  
          </div></>)}
        {step === 2 && (
            <>
        <div className="flex gap-6 justify-between mb-4">
            <div className="w-1/2">
              <label 
              className="block text-1xl font-medium text-black">
                  Valt StartTid
              </label>
              <Input id="startTime" 
                  value={selectedSlot?.startStr}  
                  className="rounded-md mt-2" readOnly/>                  
            </div>

            <div className="w-1/2">
              <label 
              className="block text-1xl font-medium text-black">
                  Valt SlutTid
              </label>
              <Input id="endTime" 
                  value={selectedSlot?.endStr}
                  className="rounded-md mt-2" readOnly/>                  
            </div> 
        </div>

        <div>
        <CalendarForEventUpdate
            startTime={event.startTime}
            endTime={event.endTime}
            onDateSelect={handleDateSelect}>

        </CalendarForEventUpdate>
        </div></>)}
      
        <div className="mt-4 flex gap-3 justify-between">
        {step > 1 && (
            <Button type="button" onClick={() => setStep(step - 1)} className="bg-green-800 text-white px-4 py-2">
            Tillbaka
            </Button>
        )}

        {step < 2 && (
            <>
            <Button type="button" onClick={() => setStep(step + 1)} className="bg-green-800 text-white px-4 py-2">
            Nästa
            </Button>
            <Button
            onClick={() => onOpenChange(false)}
            className="bg-green-800 text-white px-4 py-2">
            Stäng
        </Button></>
        )}
        {step === 2 && (
            <>
                <Button type="submit" className="bg-green-800 text-white px-4 py-2" >
                    Update</Button> 
                <Button type="button" className="bg-green-800 text-white px-4 py-2" 
                    onClick={() => handleDeleteEvent(event.id)}>Ta bort</Button> 
                <Button
                    onClick={() => onOpenChange(false)}
                    className="bg-green-800 text-white px-4 py-2">
                    Stäng
                </Button></>)}
            </div>
        </div>
        </form>
        )}
        <ToastContainer toastStyle={toastStyle}
         autoClose={2000} closeButton></ToastContainer>
      </DialogContent>
    </Dialog>
    
  );
};

export default EventUpdateDeleteDialog;

const toastStyle : React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '25%',
    fontSize :'18px',
    backgroundColor: 'white',
    color: '#000',
    padding: '16px 24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    borderRadius: '8px',
  };