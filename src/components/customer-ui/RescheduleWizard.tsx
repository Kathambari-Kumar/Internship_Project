"use client";
import { AppointmentWithRelations } from "@/app/(main)/actions/appointments";
import { Slot } from "@/components/customer-ui/selectTimeSlot";
import {
  compareAsc,
  format,
  differenceInHours,
} from "date-fns";
import { sv } from "date-fns/locale";
import { Button } from "../ui/button";
import { useState } from "react";
import SelectTimeSlot from "@/components/customer-ui/selectTimeSlot";
import { BookingStatus } from "@/generated/prisma";

type Props = {
  appointment: AppointmentWithRelations;
  availableTimeSlots: Slot[];
  onSave: (
    appointment: AppointmentWithRelations,
    newTimeSlots: Slot
  ) => Promise<void>;
  onCancel: (appointment: AppointmentWithRelations) => Promise<void>;
};

export default function RescheduleAppointment({
  appointment,
  availableTimeSlots,
  onSave,
  onCancel,
}: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false); // to disable the form after submission
  // booking info: appoitment type and age-group, time
  let originalDate = "";
  let originalStartTime = "";
  let originalWeekDay = "";
  const sorted = [...appointment.timeSlots].sort((a, b) =>
    compareAsc(a.startTime, b.startTime)
  );
  let isTooLateToChange = false; // default value
  if (sorted.length > 0) {
    originalDate = format(sorted[0].startTime, "yyyy-MM-dd");
    originalStartTime = format(sorted[0].startTime, "HH:mm");
    originalWeekDay = format(new Date(sorted[0].startTime), "EEEE", {
      locale: sv,
    });

    // Check if the original appointment time slot is at least 24 hours in advance
    const firstSlotStart = sorted[0].startTime;
    const hoursUntil = differenceInHours(firstSlotStart, new Date());
    isTooLateToChange = hoursUntil < 24;
  } else {
    isTooLateToChange = false;
  }

  const [action, setAction] = useState<"reschedule" | "cancel" | null>(null);

  const handleRescheduleOnSubmit = async (slot: Slot, formatted: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    console.log(formatted);
    if (!slot) {
      setErrorMessage("Du måste välja en ny bookingstid.");
      return;
    }

    try {
      await onSave(appointment, slot);
      setSuccessMessage(
        "✅ Ombokningen har lyckats! Sidan uppdateras om 5 sekunder..."
      );
      setHasSubmitted(true);
      setTimeout(() => {
        window.location.reload();
      }, 5000); // 5 seconds delay
    } catch (err) {
      console.error("Error during ombooking:", err);
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

  // handle  "cancel appointment" on submit
  const handleCancelOnSubmit = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await onCancel(appointment);
      setSuccessMessage(
        "✅ Canceling har lyckats! Sidan uppdateras om 5 sekunder..."
      );
      setHasSubmitted(true);
      setTimeout(() => {
        window.location.href = "/dashboard";;
      }, 5000); // 5 seconds delay
    } catch (err) {
      console.error("Error during canceling:", err);
      const rawMsg =
        err instanceof Error
          ? err.message
          : "Något gick fel. Försök igen eller updatera sidan.";
      setErrorMessage(rawMsg);
    }
  };

  return (
    <div>
      <div>
        <p className="uppercase">
          {appointment.customer.firstname} {appointment.customer.lastname}
        </p>
        {appointment.status === BookingStatus.CONFIRMED && (
          <div>
            {" "}
            <p>
              {originalDate} kl.{originalStartTime} {""}
              {originalWeekDay}
            </p>
            {isTooLateToChange ? (
              <p className="text-red-600 font-semibold">
                ❌ Det är mindre än 24 timmar kvar. Du kan inte omboka eller
                avboka denna tid via länken.
              </p>
            ) : (
              <p>
                Du får alltid förändra tid eller cancel bokningen på den här
                länken.
              </p>
            )}
          </div>
        )}
        {appointment.status === BookingStatus.CANCELLED && (
          <p>
            Din tid är nu avbokad. Du är alltid välkommen att boka på nytt på
            den här länken om du skulle behöva.
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2 mt-6">
        <div className="flex gap-4">
          <Button
            variant={action === "reschedule" ? "default" : "outline"}
            onClick={() => setAction("reschedule")}
            disabled={hasSubmitted || isTooLateToChange}
          >
            📅 Omboka
          </Button>
          {appointment.status === BookingStatus.CONFIRMED && (
            <Button
              variant={action === "cancel" ? "destructive" : "outline"}
              onClick={() => setAction("cancel")}
              disabled={hasSubmitted || isTooLateToChange}
            >
              ❌ Avboka bokning
            </Button>
          )}
        </div>

        <div>
          {action === "reschedule" && (
            <div className="w-full max-w-[600px] px-4 sm:px-2">
              <SelectTimeSlot
                availableTimeSlots={availableTimeSlots}
                onComplete={handleRescheduleOnSubmit}
                buttonLabel="Slutför bokning"
              ></SelectTimeSlot>
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

          {action === "cancel" && (
            <div className="mt-4 space-y-4">
              <p className="text-red-600">
                Are you sure you want to cancel this appointment?
              </p>
              <Button
                variant="destructive"
                onClick={handleCancelOnSubmit}
                disabled={hasSubmitted}
              >
                Confirm Cancellation
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
