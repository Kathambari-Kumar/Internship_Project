import { GetCustomerAvailableTimeSlots } from "@/app/(main)/actions/handleTimeslots";
import RescheduleAppointment from "@/components/customer-ui/RescheduleWizard";
import { GetAppointmentById } from "@/app/(main)/actions/appointments";
import {
  HandleCustomerBookingCancel,
  HandleCustomerBookingReschedule,
} from "@/app/(main)/actions/handleCustomerBooking";
import { ensureCustomerAccess } from "@/lib/session";

export default async function ReschedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await ensureCustomerAccess();
  const { id } = await params;
  const appointment = await GetAppointmentById(parseInt(id));
  if (!appointment) {
    return <div>Customer not found</div>;
  }
  const availableTimeSlots = await GetCustomerAvailableTimeSlots();
  return (
    <div className="flex flex-col min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Hantera din bokning</h1>
      <RescheduleAppointment
        availableTimeSlots={availableTimeSlots}
        appointment={appointment}
        onSave={HandleCustomerBookingReschedule}
        onCancel={HandleCustomerBookingCancel}
      ></RescheduleAppointment>
    </div>
  );
}
