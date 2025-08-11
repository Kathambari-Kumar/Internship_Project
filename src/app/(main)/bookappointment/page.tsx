import {
  getAllConfirmedAppointments,
  getAllEvents,
} from "@/app/(main)/actions/appointments";
import AdminBookingCalendarWrapper from "@/components/admin-ui/appointment/appointment-wrapper";

import { GetAdminAvailableTimeSlotsForAppointment } from "../actions/handleTimeslots";
import { ensureAdminAccess } from "@/lib/session";

export default async function BookAppointmentPage() {
  await ensureAdminAccess();
  const allAppointments = await getAllConfirmedAppointments(); // Fetch all confirmed appointments from the beginning of this month
  const allEvents = await getAllEvents(); // Fetch all events starting from the beginning of this month
  const availableTimeSlots = await GetAdminAvailableTimeSlotsForAppointment(); // Fetch available time slots from today
  return (
    <AdminBookingCalendarWrapper
      allAppointments={allAppointments}
      allEvents={allEvents}
      availableTimeSlots={availableTimeSlots}
    ></AdminBookingCalendarWrapper>
  );
}
