"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { eventSchema } from "@/lib/validators";
import { Dialog, DialogTitle, DialogContent, DialogHeader } from "../ui/dialog";
import { z } from "zod";
import {
  CheckConflictWithAppointment,
  CreateEvent,
} from "@/app/(main)/actions/handleEvents";
import { updateTimeSlotsForEvent } from "@/app/(main)/actions/handleTimeslots";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import React, { useEffect, useState } from "react";
import { DateSelectArg } from "@fullcalendar/core/index.js";
import { DateTime } from 'luxon';
import { Lora } from "next/font/google";
import {Event} from "@/generated/prisma";

const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });

// Define the event form.
// Populate the form field with defaul values
const EventCreateForm = () => {
  // initializing react state variable
  // useState - react hook manages state
  const [currentEvents, setCurrentEvents] = useState<[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    startStr: string;
    endStr: string;
  } | null>(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch events when the calendar loads
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
        try {
            const response = await fetch("/api/getAllEvents");
            const eventData = await response.json();
            const formattedEvents = eventData.map((event:Event) => ({
              id: event.id,
              title: event.title, 
              description : event.description,
              start: event.startTime,  
              end: event.endTime,
              eventColor: "#6e6e6e",
              textColor: "#ffffff" 
          })) || [];
            setCurrentEvents(formattedEvents); // Store events in state
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

  /*  This function is invoked while dates/times 
      are selected in the full callendar.
      It calls CheckConflictWithAppointment function
      to check any date conflict with appointment */
    const handleDateSelect = async (selectInfo: DateSelectArg) => {
    console.log("Time Selected");
    setSelectedSlot({
      startStr: selectInfo.startStr,
      endStr: selectInfo.endStr,
    });

    const result = await CheckConflictWithAppointment(
      selectInfo.startStr,
      selectInfo.endStr
    );
    if (result === "Error") {
      toast.warning("Varning! Tidskonflikt: en bokning finns redan.");
    } else {
      setIsDialogOpen(true); // if not, it opens event create form (here Dialogbox)
    }

     // logged this for debugging purpose 
      console.log("Start Time Selected", selectInfo.startStr);
      console.log("End Time Selected", selectInfo.endStr);
      const localStart = DateTime.fromISO(selectInfo.startStr, {
        zone: "Europe/Stockholm",
      });
      const localEnd = DateTime.fromISO(selectInfo.endStr, {
        zone: "Europe/Stockholm",
      });
     
      // Convert to UTC Date objects for DB storage
      const startTime = localStart.toUTC().toJSDate();
      const endTime = localEnd.toUTC().toJSDate();
      console.log("startTime", startTime);
      console.log("endTime", endTime);
      
    };
     
  const toastOptions: ToastOptions = {
    onClose: () => {
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    },
  };

  const getRoundedCurrentTime = (): DateTime => {
    const now = DateTime.local();
    const rounded =
      now.minute < 30
        ? now.set({ minute: 30, second: 0, millisecond: 0 })
        : now.plus({ hours: 1 }).set({ minute: 0, second: 0, millisecond: 0 });
  
    return rounded; // returns DateTime instance
  };
  
  const nowRounded = getRoundedCurrentTime();

  // register : A function that connects form inputs to the library.
  // It tracks the input values and validates them.

  // handleSubmit : A wrapper function that handles form submission and
  // runs the validation before invoking your custom submit logic.

  // formState:{errors} : Contains validation errors for each field.
  // If any field doesn't pass the validation rules,
  // its error message will appear here.

  // eventSchema: This is a validation schema defined using Zod(simple
  // schema validation library)

  // resolver: zodResolver(eventSchema): This tells react-hook-form to
  // validate the form data against the eventSchema before submission.

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      isPrivate: false,
    },
  });
  /* React-hook-form does not watch state variables like selectedSlot by default.
Uses defaultValues only once when the form is initialized. So if new date is 
selected, it will not be automatically updated in the form value(input boxes).
This ensures that when selectedSlot updates, the form inputs are updated as well.
*/

useEffect(() => {
  if (selectedSlot) {
    setValue("startTime", selectedSlot.startStr);
    setValue("endTime", selectedSlot.endStr);
  }
}, [selectedSlot, setValue]);
 
const onSubmit = async (data :z.infer<typeof eventSchema>) => {  
  try {
    console.log("data", data);
    const localStart = DateTime.fromISO(data.startTime, {
      zone: "Europe/Stockholm",
    });
    const localEnd = DateTime.fromISO(data.endTime, {
      zone: "Europe/Stockholm",
    });
  
    // Convert to UTC Date objects for DB storage
    const startTime = localStart.toUTC().toJSDate();
    const endTime = localEnd.toUTC().toJSDate();
    console.log("startTime", startTime);
    console.log("endTime", endTime);
    const event = await CreateEvent(data);  
    const eventId = event.id;
     // these 2 lines to get event id to update this event 
     // in timeslot table
    /* const eventResponse = await fetch("/api/getEventId");
    const parsedResponse = await eventResponse.json(); 
    const eventId = parsedResponse[0].id; */
      // function invoked to upadate timeslot table
    updateTimeSlotsForEvent(eventId, startTime, endTime);    
    toast.success("Händelsen har skapats.", toastOptions);
    console.log('Event created successfully, TimeSlot table updated'); 
} catch (error) {
  toast.error("Misslyckades med att skapa händelsen!!")
  console.error('Error creating event:', error);
}  
};
const onError = () => {
  console.error("Validation Errors:");
};

  return (
    <>
      <div className="w-3/4">
        <hr className="my-4 mt-3 border-t border-teal-700" />
        <p className={`${lora.className} text-center text-yellow-500 text-2xl`}>
          <strong>Skapa Nytt Evenemang</strong>
        </p>
        <hr className="my-4 mt-3 border-t border-teal-700" />

        <label 
            className="block text-1xl mt-2 mb-1 font-medium text-black">
                Välja Datum
            </label>
        <hr className="mb-3"/>
        <FullCalendar 
            height = {"60vh"}
            plugins = {[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar = {{
                left : "prev, dayGridMonth, next", 
                center:"title", 
                right : "today, timeGridWeek",       
                }}
            titleFormat={{ year: 'numeric', month : 'short' }}
            initialView='timeGridWeek'
            slotDuration="00:30:00"
            editable = {true}
            selectable = {true}
            selectMirror = {true}
            dayMaxEvents={true}
            select={handleDateSelect}
            events={currentEvents} 
            eventBackgroundColor="#6e6e6e"
            timeZone="local"     
            selectAllow={(selectInfo) => {
              const start = DateTime.fromJSDate(selectInfo.start).setZone("Europe/Stockholm");
      
              // If selected date is today, ensure start time is after rounded time
              if (start.toISODate() === nowRounded.toISODate()) {
                return start >= nowRounded;
              }
      
              return true; // allow future dates
            }}
            validRange={{
              start: DateTime.local().toISODate(), // restrict past days
              end: DateTime.local().plus({ months: 4 }).toISODate(),
            }}
            >           
        </FullCalendar>
      </div>           
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogContent>
      <DialogHeader>
          <DialogTitle className="text-center text-teal-700">Skapa Nytt Evenemang</DialogTitle>
      </DialogHeader>
      {(() => { console.log("Inside DialogContent"); return null })()}
      <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div>
              <label 
              className="block text-1xl font-medium text-black">
                  Valt StartTid      
              </label>
              <Input
                id="StartTime"
                value={selectedSlot ? selectedSlot.startStr : ""}
                {...register("startTime")}
                className="rounded-md mt-2"
                readOnly
              />
            </div>

            <div>
              <label className="block text-1xl font-medium text-black">
                Valt SlutTid
              </label>
              <Input
                id="endTime"
                value={selectedSlot ? selectedSlot.endStr : ""}
                {...register("endTime")}
                className="rounded-md mt-2"
                readOnly
              />
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-1xl font-medium text-black"
              >
                Titel
              </label>
              <Input
                autoFocus
                id="title"
                {...register("title")}
                className="rounded-md mt-2"
              />
              {errors.title && (
                <p className="text-red  text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="desription"
                className="block text-1xl mt-2 font-medium text-black"
              >
                Beskrivning
              </label>
              <Textarea
                id="description"
                {...register("description")}
                className="mt-2"
              />
              {errors.description && (
                <p className="text-red  text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="isPrivate"
                className="block text-1xl mt-2 font-medium text-black"
              >
                Event Privacy
              </label>
              <Controller
                name="isPrivate"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? "true" : "false"}
                    onValueChange={(value) => field.onChange(value === "true")}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select Privacy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Private</SelectItem>
                      <SelectItem value="false">Public</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              ></Controller>

              {errors.isPrivate && (
                <p className="text-red  text-sm mt-1">
                  {errors.isPrivate.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="bg-green-800 mt-2 w-full text-white px-4 py-2"
              onClick={() => console.log("🧪 Submit button clicked")}
            >
              Skapa
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer
        toastStyle={toastStyle}
        autoClose={2000} // 2 seconds
        closeButton
      ></ToastContainer>
      <style>
        {`
        .Toastify__close-button {
          color: black !important;
        }
      `}
      </style>
    </>
  );
};
export default EventCreateForm;

const toastStyle: React.CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  fontSize: "18px",
  backgroundColor: "white",
  color: "#000",
  padding: "16px 24px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  borderRadius: "8px",
};
