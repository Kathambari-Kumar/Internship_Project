"use client";

import AdminBookingCalendar from "@/components/admin-ui/appointment/admin-booking-calendar";
import {
  HandleAdminBooking,
  HandleAdminBookingReschedule,
  HandleAdminBookingCancel,
} from "@/app/(main)/actions/handleAdminBooking";
import { AppointmentWithRelations } from "@/app/(main)/actions/appointments";
import { Slot } from "@/components/customer-ui/selectTimeSlot";
import { PrismaEvent } from "@/app/(main)/actions/appointments";

type Props = {
  allAppointments: AppointmentWithRelations[];
  allEvents: PrismaEvent[];
  availableTimeSlots: Slot[];
};

export default function AdminBookingCalendarWrapper({
  allAppointments,
  allEvents,
  availableTimeSlots,
}: Props) {
  return (
    <AdminBookingCalendar
      allAppointments={allAppointments}
      allEvents={allEvents}
      availableTimeSlots={availableTimeSlots}
      onSubmitBooking={(data) => HandleAdminBooking(data)}
      onSubmitReschedule={(appointment, newSlot) =>
        HandleAdminBookingReschedule(appointment, newSlot)
      }
      onSubmitCancel={(appointment) => HandleAdminBookingCancel(appointment)}
    />
  );
}
