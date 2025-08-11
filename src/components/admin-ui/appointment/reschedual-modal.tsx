"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import {
  AppointmentWithRelations
} from "@/app/(main)/actions/appointments";
import { compareAsc, format, addMinutes, startOfDay } from "date-fns";
import { Slot } from "@/components/customer-ui/selectTimeSlot";
import { useRouter } from "next/navigation";

type RescheduleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentWithRelations;
  onSave: (
    appointment: AppointmentWithRelations,
    newTimeSlots: Slot
  ) => Promise<void>;
  onCancel: (appointment: AppointmentWithRelations) => Promise<void>;
  availableTimeSlots: Slot[];
  errorMessage: string | null;
  successMessage: string | null;
  hasSubmitted: boolean;
  setErrorMessage: (msg: string | null) => void;
  setSuccessMessage: (msg: string | null) => void;
  setHasSubmitted: (submitted: boolean) => void;
};

export default function RescheduleModal({
  isOpen,
  onClose,
  appointment,
  onSave,
  onCancel,
  availableTimeSlots,
  errorMessage,
  successMessage,
  hasSubmitted,
  setErrorMessage,
  setSuccessMessage,
  setHasSubmitted,
}: RescheduleModalProps) {
  const router = useRouter();
  const [originalDate, setOriginalDate] = useState("");
  const [originalStart, setOriginalStart] = useState("");
  const [originalEnd, setOriginalEnd] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // Check if the appointment is in the past
  const isPastAppointment = appointment.timeSlots.every(
    (slot) => new Date(slot.startTime) < startOfDay(new Date())
  );

  // show original date and time
  useEffect(() => {
    const sorted = [...appointment.timeSlots].sort((a, b) =>
      compareAsc(a.startTime, b.startTime)
    );
    if (sorted.length > 0) {
      setOriginalDate(format(sorted[0].startTime, "yyyy-MM-dd"));
      setOriginalStart(format(sorted[0].startTime, "HH:mm"));
      setOriginalEnd(format(sorted[sorted.length - 1].endTime, "HH:mm"));
    }
  }, [appointment]);

  // availableTimeSlots sorted by date
  useEffect(() => {
    if (!selectedDate) return;
    // 1. filter available time slots by selected date
    const filtered = availableTimeSlots.filter((slot) => {
      const dateStr = format(slot.startTime, "yyyy-MM-dd");
      return dateStr === selectedDate;
    });
    // 2. Sort slots by startTime, convert to "HH:mm" strings
    const sortedTimes = filtered
      .sort((a, b) => compareAsc(new Date(a.startTime), new Date(b.startTime)))
      .map((slot) => format(new Date(slot.startTime), "HH:mm"));

    // 3. Update state
    setAvailableTimes(sortedTimes);
    setStartTime("");
    setEndTime("");
  }, []);

  // populate available times based on selected date
  const startTimeOptions = availableTimes;
  const endTimeOptions = (() => {
    if (!startTime) return [];

    const [startH, startM] = startTime.split(":").map(Number);
    let current = new Date(0, 0, 0, startH, startM);
    const options: string[] = [];

    while (true) {
      const nextStartStr = format(current, "HH:mm");
      const nextIndex = availableTimes.indexOf(nextStartStr);

      // If current is not in availableTimes, stop
      if (nextIndex === -1) break;

      const end = format(addMinutes(current, 30), "HH:mm");
      if (!options.includes(end)) {
        options.push(end);
      }

      current = addMinutes(current, 30);
    }

    return options;
  })();

  const [action, setAction] = useState<"reschedule" | "cancel" | null>(null);

  // handle form "reschedule appointment" on submit
  const handleRescheduleOnSubmit = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!selectedDate || !startTime || !endTime) {
      setErrorMessage("Du måste välja en ny bookingstid.");
      return;
    }

    const newSlot: Slot = {
      startTime: new Date(`${selectedDate}T${startTime}:00`),
      endTime: new Date(`${selectedDate}T${endTime}:00`),
    };

    try {
      await onSave(appointment, newSlot);
      setSuccessMessage("✅ Ombokningen har lyckats!");
      setHasSubmitted(true);
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
      setSuccessMessage("✅ Canceling har lyckats!");
      setHasSubmitted(true);
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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (hasSubmitted && !open)
          // Redirect to dashboar (success )
          router.push("/dashboard");
        if (!open) {
          onClose();
          setHasSubmitted(false);
          setErrorMessage(null);
          setSuccessMessage(null);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Appointment Detail</DialogTitle>
        </DialogHeader>

        {/* appointment Info */}
        <div className="space-y-2">
          <p>
            {appointment.customer.personalnumber}-
            {appointment.customer.firstname} {appointment.customer.lastname}
          </p>
          <p>
            {originalDate}: {originalStart} - {originalEnd}
          </p>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            variant={action === "reschedule" ? "default" : "outline"}
            onClick={() => setAction("reschedule")}
            disabled={hasSubmitted || isPastAppointment}
          >
            📅 Reschedule
          </Button>

          <Button
            variant={action === "cancel" ? "destructive" : "outline"}
            onClick={() => setAction("cancel")}
            disabled={hasSubmitted || isPastAppointment}
          >
            ❌ Cancel Appointment
          </Button>
        </div>

        {action === "reschedule" && (
          <div>
            {" "}
            <div className="mt-4">
              <Label>Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                disabled={hasSubmitted}
              />
            </div>
            <div className="flex gap-4 mt-2">
              <div className="flex-1">
                <Label>Start Time</Label>
                <Select
                  value={startTime}
                  onValueChange={setStartTime}
                  disabled={!selectedDate || hasSubmitted}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Start Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {startTimeOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label>End Time</Label>
                <Select
                  value={endTime}
                  onValueChange={setEndTime}
                  disabled={!startTime || hasSubmitted}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="End Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {endTimeOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={hasSubmitted}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRescheduleOnSubmit}
                disabled={hasSubmitted}
              >
                Save Changes
              </Button>
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
      </DialogContent>
    </Dialog>
  );
}
