import BookingWizard from "@/components/customer-ui/bookingWizard";
import { GetCustomerAvailableTimeSlots } from "@/app/(main)/actions/handleTimeslots";
import HandleCustomerBooking from "@/app/(main)/actions/handleCustomerBooking";
import { Lora } from "next/font/google";
const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });

export default async function BookingPage() {
  const availableTimeSlots = await GetCustomerAvailableTimeSlots();
  return (
    <div className="flex flex-col min-h-screen p-4">   
    <hr className="mt-3 mb-3 border-t border-teal-700" />
        <h1 className={`${lora.className} text-center text-2xl font-bold mb-4`}>
          Boka en Synundersökerning
        </h1>
      <hr className="mt-0 mb-4 border-t border-teal-700" />

      <BookingWizard
        availableTimeSlots={availableTimeSlots}
        onSubmit={HandleCustomerBooking}
      /> </div>
    
  );
}
