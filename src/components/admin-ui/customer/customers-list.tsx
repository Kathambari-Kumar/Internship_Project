"use client";

import { CustomerFormData } from "@/lib/customer-schema";
import CustomerEditModal from "./customer-edit-modal";
import { Button } from "@/components/ui/button";
import { Lora } from "next/font/google";
import { GetAppointmentByCustomerId } from "@/app/(main)/actions/appointments";
import { toast } from "sonner";
const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });

type Props = {
  customers: CustomerFormData[];
};

export default function CustomersList({ customers }: Props) {
  if (customers.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">No customers found.</div>
    );
  }

  const getAppointmentDetails = async (customerId : string) => {
    const results = await GetAppointmentByCustomerId(customerId);
    if (results.length === 0) {
      toast("No current appointments for this customer.");
    } else {
      const customer = results[0].customer;
      const customerName = `Kund: ${customer.firstname} ${customer.lastname}`;
      const timeSlots = results
        .flatMap((appt) => appt.timeSlots) // get all timeSlots across appointments
        .map((slot) =>
          `${slot.startTime.toLocaleString()} to ${slot.endTime.toLocaleString()}`
        )
        .join('\n');
    
      toast(`${customerName}\nTimeSlots:\n${timeSlots}`);
    }
  };

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
      <h2 className={`${lora.className} text-3xl font-bold text-center text-teal-700`}>
          Kundlista
        </h2>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {customers.map((customer) => (
            <li key={customer.id} className="py-3 px-4 flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100"></div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {customer.firstname} {customer.lastname}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  🆔 {customer.personalnumber} 📧{customer.email} 📞
                  {customer.phone}
                </p>
              </div>
              <div className="flex gap-2">
              <CustomerEditModal defaultCustomer={customer}></CustomerEditModal>
              {/* <Link href={`/customers/${customer.id}`}> */}
                <Button onClick = {() => getAppointmentDetails(customer.id!)} variant={"outline"}>Visa Detaljer</Button>
              {/* </Link> */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
