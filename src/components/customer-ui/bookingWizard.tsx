"use client";

import { CustomerFormData } from "@/lib/customer-schema";
import { useState } from "react";
import SelectAppointmentType from "@/components/customer-ui/selectAppointmentType";
import { Button } from "@/components/ui/button";
import CustomerForm from "@/components/ui/customer-form";
import SelectTimeSlot from "./selectTimeSlot";
import { Slot } from "./selectTimeSlot";
import { useRouter } from "next/navigation";
import { Appointment } from "@/generated/prisma";
import { authClient } from "@/lib/auth-client";

type Props = {
  availableTimeSlots: Slot[];
  onSubmit: (data: AppointmentData) => Promise<Appointment>;
};

export type AppointmentData = {
  isAdult: boolean;
  isGlasses: boolean;
  slot: Slot | null;
  formatted?: string;
  customer: CustomerFormData;
};

export default function BookingWizard({ availableTimeSlots, onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    isAdult: true,
    isGlasses: true,
    slot: null,
    formatted: "",
    customer: {
      firstname: "",
      lastname: "",
      personalnumber: "",
      phone: "",
    },
  });
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false); // to disable the form after submission
  const handleTypeComplete = (value: {
    isAdult: boolean;
    isGlasses: boolean;
  }) => {
    setAppointmentData((prev) => ({ ...prev, ...value }));
    setStep(2);
  };

  const handleTimeSlotsComplete = async (
    slot: Slot,
    formatted: string
  ): Promise<void> => {
    setAppointmentData((prev) => ({
      ...prev,
      slot,
      formatted,
    }));
    setStep(3);
  };

  const handleCustomerComplete = async (customer: CustomerFormData) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    //alert(customer.phone);
    const fullData = {
      ...appointmentData,
      customer,
    };
    setAppointmentData(fullData);
    
    if (!customer.phone && !customer.email) {
        alert("Please provide either email or phone number.");
        return;
      }

    try {
      const appointment = await onSubmit(fullData);
      setSuccessMessage(
        "✅ Bokningen har lyckats! Kontrollera din e-post för att hantera bokningen. Sidan uppdateras om 5 sekunder."
      );
      setHasSubmitted(true);
      setTimeout(() => {
        router.push("/");
      }, 5000); // 5 seconds delay

      // If customer email is provided, sign in using magic link
      // triggers sendMagicLink function (written in auth.ts)

      /* if (customer.email) {
        const { data, error } = await authClient.signIn.magicLink({
          email: customer.email,
          callbackURL: `/booking/${appointment.id}`, // redirect after successful login
        });
      } */
      
        const callbackURL = `/booking/${appointment.id}?phone=${customer.phone ?? ''}`;     
        await authClient.signIn.magicLink({
          email: customer.email ?? '',
          callbackURL,
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
            window.location.href = "/home";; // have to redirect to home page - LATER
          }, 5000); // 5 seconds delay
        } else {
          setErrorMessage("Något gick fel. Försök igen.");
        }
      }
  };

  console.log("Appointment Data:", appointmentData);
  return (
    <div className="booking-container">
      {step >= 1 && (           
        <div className="step-block">
          <p className="text-2xl text-teal-700 mb-4 font-semibold">
            Steg 1 : Välj bokningstyp
          </p>
          {step === 1 ? (
            <SelectAppointmentType onComplete={handleTypeComplete} />
          ) : (
            <div className="flex items-center text-black justify-between">
              <p>
                ✅ Synundersökerning:{" "}
                {appointmentData.isAdult ? "Vuxen" : "Barn"} –{" "}
                {appointmentData.isGlasses ? "Glasögon" : "Contaktlinser"}
              </p>
              <Button onClick={() => setStep(1)} disabled={hasSubmitted}>
                Ändra
              </Button>
            </div>
          )}
        </div>
      )}

      {step >= 2 && (
        <div className="step-block">
          <p className="text-2xl text-teal-700 mb-4 font-semibold">
          Steg 2: Välj en tid</p>
          {step === 2 ? (
            <div>
              <SelectTimeSlot
                availableTimeSlots={availableTimeSlots}
                onComplete={handleTimeSlotsComplete}
              ></SelectTimeSlot>
            </div>
          ) : (
            <div className="flex items-center text-black justify-between">
              <p>✅ Vält Tid : {appointmentData.formatted}</p>
              <Button onClick={() => setStep(2)} disabled={hasSubmitted}>
                Ändra
              </Button>
            </div>
          )}
        </div>
      )}
      {step >= 3 && (
        <div className="step-block">
           <p className="text-2xl text-teal-700 mb-4 font-semibold">
            Steg 3: Uppgifter om kunden</p>

          <div>
            <CustomerForm
              onSubmit={handleCustomerComplete}
              buttonLable="Slutför bokning"
              submitted={hasSubmitted}
            ></CustomerForm>
          </div>

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
        </div>
      )}
      <style jsx>{`
        .booking-container {
          max-width: 600px;      
          padding: 2rem;
        }

        .step-block {
          margin-bottom: 2rem;
          border-left: 3px solid #1890ff;
          padding-left: 1rem;
        }

        h3 {
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
