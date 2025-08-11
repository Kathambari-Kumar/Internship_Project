"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";
import EventUpdateDeleteDialog from "./eventUpdateDeleteDialog";
import { boolean} from "zod";
import { DateTime } from "luxon";
import { Lora } from "next/font/google";
import { Appointment,Event } from "@/generated/prisma";

const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });


interface CalendarEvent {
    id: string;
    title: string;
    description? : string;
    start: string;
    end: string;
    backgroundColor: string;
    textColor: string;
    extendedProps?: {
      type: string;
      [key: string]: unknown;
    };
  }
  
interface EventSchemaInput {
  id : number,
  title: string,
  description? : string,
  date: string, 
  startTime: string,              
  endTime: string,
}

const AgendaPanel = () => {
  const [currentEvents, setCurrentEvents] = useState<CalendarEvent[]>([]);
  const [formattedAppointments, setCurrentAppointments] = useState<CalendarEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventSchemaInput | null>(null);
  
  // set isAdmin = true in admin table 
  // duplication check is done in server side
  useEffect(() => {
    const promoteToAdmin = async () => {
      await fetch("/api/createAdmin", { method: "POST" });
    };
    promoteToAdmin();
  }, []);

  // fetch all the events
  const fetchEvents = async () => {
      try {
        const response = await fetch("/api/getAllEvents");
        const eventData  = await response.json();

        const formattedEvents: CalendarEvent[] = eventData.map((event : Event ) => ({
          id: event.id,
          title: event.title,
          description : event.description,
          start:  event.startTime,
          end: event.endTime,
          color: "#6e6e6e",
          textColor: "#ffffff",
          extendedProps: {
            description: event.description || "",
            type: "event",
          },
        }));

        setCurrentEvents(formattedEvents);
        console.log("Formatted Events", formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch appointments (with customer name + timeslot)
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/getAllAppointments");
        const appointmentData  = await response.json();
        console.log("all appointemnets", appointmentData);
        const formattedAppointments: CalendarEvent[] = await Promise.all(
          appointmentData.map(async (appointment: Appointment) => {
            
            const customerRes = await fetch(`/api/getCustomerName?id=${appointment.customerId}`);
            const customerData = await customerRes.json();

            const timeslotRes = await fetch(`/api/getTimeslotByAppointmentId?id=${appointment.id}`);
            const timeslotData = await timeslotRes.json();

            if (!timeslotData.length) return null;

            const start = new Date(timeslotData[0].startTime);
            const end = new Date(timeslotData[timeslotData.length - 1].endTime);

            return {
              id: appointment.id,
              title: `${customerData.firstname} ${customerData.lastname}`,
              start: start.toISOString(),
              end: end.toISOString(),
              color: "#6e6e6e",
              textColor: "#ffffff",
              extendedProps: {
                type: "appointment",
                customerName: `${customerData.firstname} ${customerData.lastname}`,
              },
            };
          })
        );

        setCurrentAppointments(formattedAppointments.filter(boolean));
        console.log("formatted appointments", formattedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Combine both event and appointment into mergedEvents Array
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const mergedEvents: CalendarEvent[] = [
      ...currentEvents.map((event) => ({
        id: `event-${event.id}`,
        title: event.title,
        start: new Date(event.start).toISOString(),
        end: new Date(event.end).toISOString(),
        backgroundColor: event.backgroundColor|| "#0f766e",
        textColor: event.textColor || "#ffffff",
        extendedProps: {
          type: 'event',
          ...event
        }
      })),
      ...formattedAppointments.map((appointment) => ({
        id: `appointment-${appointment.id}`,
        title: appointment.title,
        start: appointment.start,
        end: appointment.end,
        backgroundColor: appointment.backgroundColor || "#eab308",
        textColor: appointment.textColor || "#fff",
        extendedProps: {
          type: 'appointment',
          ...appointment
        }
      }))
    ];

    setEvents(mergedEvents);
  }, [currentEvents, formattedAppointments]);

  const handleClick = (event: CalendarEvent) => {
  const start = DateTime.fromISO(event.start, { zone: "utc" }).setZone("Europe/Stockholm");
  const end = DateTime.fromISO(event.end, { zone: "utc" }).setZone("Europe/Stockholm");
   
    setSelectedEvent({
      id : Number(event.id),
      title: event.title,
      description : event.description,
      date: start.toLocaleString(DateTime.DATE_FULL), 
      startTime: start.toISO()!,              
      endTime: end.toISO()!,
    });
  
    setIsDialogOpen(true);
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
  return (
    <>
    <Card className="w-full max-w-6xl mx-auto p-6 shadow-lg rounded-lg">
      <CardHeader className="items-center py-4 w-full bg-gray-500">
        <CardTitle className={`${lora.className} text-2xl text-center text-white`}>Dagordningspanel</CardTitle>
      </CardHeader>
      <CardContent>
        <hr className="mb-3" />

        {/* Hover Panels */}
        <div id="eventDetailsPanel" style={panelStyle}></div>
        <div id="appointmentDetailsPanel" style={{ ...panelStyle, top: "50px" }}></div>

        <div className="flex gap-6 w-full">
            {/* Sidebar with titles */}
          <div className="w-1/4 bg-gray-100 p-4 rounded shadow">
            <h2 className="font-semibold mb-3 text-center">Kommande Händelser</h2>
            <hr className="my-4 mb-3 border-t border-teal-700" />
            <p className="mb-3">klicka på eventnamnet för att uppdatera eller ta bort.</p>
            <ul className="px-3 list-disc list-inside text-sm space-y-4">
              {currentEvents.map((event) => (
                <li key={event.id} 
                className="cursor-pointer hover:underline text-1xl text-blue-700"
                onClick={() => handleClick(event)}>
                {event.title}</li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <FullCalendar
              height={"60vh"}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              timeZone="local"
              headerToolbar={{
                left: "prev,dayGridMonth,next",
                center: "title",
                right: "today,timeGridWeek",
              }}
              events={events}

              eventContent={(eventInfo) => {
                console.log(eventInfo);
                // customize the content that appears in the calendar
                  return (
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        //borderRadius: "50%",
                        display: "inline-block",
                        position: "absolute",
                        top: "5px",
                        left: "5px",
                      }}
                    />
                  );
                }}

              editable={false}
              selectable={false}
              selectMirror={true}
              dayMaxEvents={true}
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
              
              eventDidMount={(info) => {
                const eventPanel = document.getElementById("eventDetailsPanel");
                const appointmentPanel = document.getElementById("appointmentDetailsPanel");
                const isAppointment = info.event.extendedProps?.type === "appointment";
                // info.el is a reference to the actual DOM 
                // element representing the event on the calendar 
                info.el.addEventListener("mouseenter", () => {

                    /* info.event: This refers to the event object in FullCalendar. 
                            The event object represents a specific 
                            event on the calendar, and it contains details like start, end, 
                            title, and custom data that you may have added (e.g., extendedProps).
                        extendedProps:
                            This is a special property in FullCalendar where you can store 
                            custom data for an event. This allows you to add additional 
                            information beyond the standard event properties. 
                    */
                   
                  const startUTC = info.event.start;
                  const endUTC = info.event.end;
                  if (!startUTC || !endUTC) {
                    // Don't show anything if no times are available
                    if (eventPanel) eventPanel.style.display = "none";
                    if (appointmentPanel) appointmentPanel.style.display = "none";
                    return;
                  }
                  const start = startUTC
                    ? DateTime.fromJSDate(startUTC, { zone: 'utc' }).setZone('Europe/Stockholm')
                    : null;
                  const end = endUTC
                    ? DateTime.fromJSDate(endUTC, { zone: 'utc' }).setZone('Europe/Stockholm')
                    : null;
                
                  if (isAppointment && appointmentPanel) {
                    appointmentPanel.style.display = "block";
                    appointmentPanel.innerHTML = `
                    <strong>Kund Namn: </strong> ${info.event.title}<br>
                    <strong>Starttid: </strong> ${start?.toFormat("HH:mm")}<br>
                    <strong>Sluttid: </strong> ${end?.toFormat("HH:mm")}<br>
                    `;
                  } else if (!isAppointment && eventPanel) {           
                    eventPanel.style.display = "block";
                    eventPanel.innerHTML = `          
                    <strong>Titel: </strong> ${info.event.title}<br>
                    <strong>Datum: </strong> ${start?.toFormat("yyyy-MM-dd")}<br>
                    <strong>Start Tid: </strong> ${start?.toFormat("HH:mm")}<br>
                    <strong>Slut Tid: </strong> ${end?.toFormat("HH:mm")}<br>
                `; 
                    
                  }
                });

                info.el.addEventListener("mouseleave", () => {
                  if (eventPanel) eventPanel.style.display = "none";
                  if (appointmentPanel) appointmentPanel.style.display = "none"; 
                });
              }}
            />
         </div>
        </div>
      </CardContent>
    </Card>
  <div className="w-full">
    <EventUpdateDeleteDialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      event={selectedEvent}
      onSuccess={fetchEvents}
    />
  </div>
</>
  );
};

// Hover panel style
const panelStyle: React.CSSProperties = {
  position: "absolute",
  right: "20px",
  top: "10px",
  padding: "10px",
  border: "2px solid #ccc",
  backgroundColor: "#eab308",
  color: "#fff",
  display: "none",
};

export default AgendaPanel;
