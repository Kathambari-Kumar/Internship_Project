"use client";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import {
  AppointmentWithRelations,
  PrismaEvent,
} from "@/app/(main)/actions/appointments";
import {
  isSameDay,
  subMilliseconds,
  startOfMonth,
  startOfDay,
  format,
} from "date-fns";
import { sv } from "date-fns/locale";
import RescheduleModal from "./reschedual-modal";
import { useRouter } from "next/navigation";

import SearchCustomer from "./search-customer";
import { AppointmentData } from "@/components/customer-ui/bookingWizard";

import { CustomerFormData } from "@/lib/customer-schema";
import { Slot } from "@/components/customer-ui/selectTimeSlot";
import { Appointment } from "@/generated/prisma";
import { authClient } from "@/lib/auth-client";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core/index.js";
import CustomerCreateModal from "../customer/customer-create-modal";

interface CalendarEventType {
    id: string,
    title: string,
    start: Date,
    end: Date,
    color: string
} 

type AdminBookingCalendarProps = {
  allAppointments: AppointmentWithRelations[];
  allEvents: PrismaEvent[];
  availableTimeSlots: Slot[];
  onSubmitBooking: (data: AppointmentData) => Promise<Appointment>;
  onSubmitReschedule: (
    appointment: AppointmentWithRelations,
    newTimeSlots: Slot
  ) => Promise<void>;
  onSubmitCancel: (appointment: AppointmentWithRelations) => Promise<void>;
};

export default function AdminBookingCalendar({
  allAppointments,
  allEvents,
  availableTimeSlots,
  onSubmitBooking,
  onSubmitReschedule,
  onSubmitCancel,
}: AdminBookingCalendarProps) {
  const router = useRouter();
  const mappedAppointments = mapAppointmentsToCalendar(allAppointments);
  const mappedEvents = mapEventsToCalendar(allEvents);
  const allEventsAndAppointments = [...mappedAppointments, ...mappedEvents];

  const [isAdult, setIsAdult] = useState(true); // true = Vuxen, false = Barn
  const [isGlasses, setIsGlasses] = useState(true); // true = Glasögon, false = Linser

  const [modalOpen, setModalOpen] = useState(false); // Modal for booking
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false); // Modal for rescheduling
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithRelations | null>(null);

  const [selectedRange, setSelectedRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerFormData | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false); // to disable the form after submission

  // Handle time slot selection
  const handleSelect = (info: DateSelectArg) => {
    const start = info.start;
    const end = info.end; 
    if (start && end) {
      // Subtract 1 ms from end because FullCalendar end is exclusive
      const adjustedEnd = subMilliseconds(end, 1);

      // Check if the selected time range is within the same day
      if (!isSameDay(start, adjustedEnd)) {
        alert("Please select a time range within the same day.");
        info.view.calendar.unselect();
        return;
      }

      setSelectedRange({ start, end });
    }
    setModalOpen(true);
    const slot = {
      startTime: start,
      endTime: end,
    };
    console.log("Selected slot:", slot);
  };

  // handle form "create appointment" on submit
  const handleBookingOnSubmit = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!selectedCustomer || !selectedRange) {
      setErrorMessage("Du måste välja kund och tid.");
      return;
    }

    const fullData: AppointmentData = {
      isAdult,
      isGlasses,
      slot: {
        startTime: selectedRange.start,
        endTime: selectedRange.end,
      },
      customer: selectedCustomer,
    };

    try {
      const appointment = await onSubmitBooking(fullData);
      setSuccessMessage(
        "✅ Bokningen har lyckats! Email för att hantera bokningen har skickas."
      );
      setHasSubmitted(true);
      // If customer email and phone is provided, sign in using magic link
      const callbackURL = `/booking/${appointment.id}?phone=${fullData.customer.phone ?? ''}`;   
      await authClient.signIn.magicLink({
          email: fullData.customer.email ?? '',
          callbackURL, // redirect after successful login
        });
      
    } catch (err) {
      console.error("Error during booking:", err);
      const rawMsg =
        err instanceof Error ? err.message : "Något gick fel. Försök igen.";

      const isTimeSlotError = rawMsg.includes("time slot");

      if (isTimeSlotError) {
        setErrorMessage(
          "Tiden är inte längre tillgänglig. Sidan uppdateras om 5 sekunder..."
        );
        setTimeout(() => {
          window.location.reload();
        }, 5000); // 5 seconds delay
      } else {
        setErrorMessage("Något gick fel. Försök igen eller uppdatera sidan.");
      }
    }
  };

  const handleEventClick = (info: EventClickArg) => {
    const eventId = info.event.id;
    //show alert if it's an event
    if (eventId.startsWith("event-")) {
      alert("Existing appointment: " + info.event.title);
      return;
    }
    //find matching appointment
    const appointment = allAppointments.find(
      (appt) => appt.id === parseInt(eventId)
    );
    if (!appointment) {
      alert("Appointment not found.");
      return;
    }
    setRescheduleModalOpen(true);
    setSelectedAppointment(appointment);
  };

  return (
    <div className="h-full">
      <FullCalendar
        height="auto"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        slotDuration="00:30:00"
        selectable={true}
        selectAllow={(selectInfo) => {
          const start = selectInfo.start;
          const end = selectInfo.end;
          const isNotPast = start >= startOfDay(new Date()); // Prevent past dates
          const isWeekday = start.getDay() >= 1 && start.getDay() <= 3; // Monday to Wednesday

          const startMinutes = start.getHours() * 60 + start.getMinutes();
          const endMinutes = end.getHours() * 60 + end.getMinutes();

          const businessStart = 10 * 60; // 10:00 = 600 minutes
          const businessEnd = 16 * 60 + 30; // 16:30 = 990 minutes

          return (
            isNotPast &&
            isWeekday &&
            startMinutes >= businessStart &&
            endMinutes <= businessEnd
          );
        }}
        selectMirror={true}
        editable={false}
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        events={allEventsAndAppointments}
        select={handleSelect}
        eventClick={handleEventClick}
        businessHours={{
          startTime: "10:00", // according to time slots
          endTime: "16:30",
          daysOfWeek: [1, 2, 3], // Monday–Wednesday
        }}
        initialDate={new Date().toISOString()}
        validRange={{
          start: startOfMonth(new Date()).toISOString(), // limit to from beginning of this month
        }}
      />

      {modalOpen && selectedRange && (
        <Dialog
          open={modalOpen}
          onOpenChange={(isOpen) => {
            setModalOpen(isOpen);

            if (!isOpen && hasSubmitted) {
              // redirect to dashboard (success )
              router.push("/dashboard");
            }
            if (!isOpen) {
              setHasSubmitted(false);
              setErrorMessage(null);
              setSuccessMessage(null);
              setSelectedCustomer(null);
              setSelectedRange(null);
              setIsAdult(true);
              setIsGlasses(true);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bekräfta bokning</DialogTitle>
            </DialogHeader>

            <div>
              <p>
                🗓️{" "}
                {format(selectedRange.start, "yyyy-MM-dd EEEE", { locale: sv })}{" "}
                kl. {format(selectedRange.start, "HH.mm")}–
                {format(selectedRange.end, "HH.mm")}
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Ålder:</span>
                <Toggle
                  pressed={isAdult}
                  onPressedChange={setIsAdult}
                  disabled={hasSubmitted}
                >
                  {isAdult ? "Vuxen" : "Barn"}
                </Toggle>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Typ:</span>
                <Toggle
                  pressed={isGlasses}
                  onPressedChange={setIsGlasses}
                  disabled={hasSubmitted}
                >
                  {isGlasses ? "Glasögon" : "Linser"}
                </Toggle>
              </div>
            </div>

            <div>
              <SearchCustomer
                onSelectCustomer={setSelectedCustomer}
                disabled={hasSubmitted}
              />             
            </div>
            <div><span className="me-3 font-bold">Nya Kund?</span><CustomerCreateModal></CustomerCreateModal></div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleBookingOnSubmit}
                disabled={hasSubmitted}
              >
                Confirm
              </Button>
              {errorMessage && (
                <p className="text-red-600 bg-red-100 px-4 py-2 rounded mb-2">
                  {errorMessage}
                </p>
              )}
              {successMessage && (
                <p className="text-green-700 bg-green-100 px-4 py-2 rounded mb-2">
                  {successMessage}
                </p>
              )}
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {selectedAppointment && (
        <RescheduleModal
          isOpen={rescheduleModalOpen}
          onClose={() => {
            setRescheduleModalOpen(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
          availableTimeSlots={availableTimeSlots}
          onSave={onSubmitReschedule}
          onCancel={onSubmitCancel}
          errorMessage={errorMessage}
          successMessage={successMessage}
          hasSubmitted={hasSubmitted}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
          setHasSubmitted={setHasSubmitted}
        />
      )}
    </div>
  );
}

function mapAppointmentsToCalendar(
  appointments: AppointmentWithRelations[]
): CalendarEventType[] {
  return appointments
    .map((appt) => {
      if (appt.timeSlots.length === 0) return null;

      const sortedSlots = [...appt.timeSlots].sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime()
      );

      return {
        id: `appointment-${appt.id}`,
        title: `${appt.customer.firstname.toUpperCase()} ${appt.customer.lastname.toUpperCase()}`,
        start: sortedSlots[0].startTime,
        end: sortedSlots[sortedSlots.length - 1].endTime,
        color: "#3b82f6",
      };
    })
    .filter((event): event is CalendarEventType => event !== null); // remove nulls
}

function mapEventsToCalendar(events: PrismaEvent[]): CalendarEventType[] {
  return events.map((event) => ({
    id: `event-${event.id}`,
    title: event.title.toUpperCase(),
    start: event.startTime,
    end: event.endTime,
    color: "#f97316", // orange
  }));
}
