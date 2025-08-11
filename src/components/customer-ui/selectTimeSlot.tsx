"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  isWithinInterval,
  isAfter,
  addDays,
  isSameDay,
} from "date-fns";
import { sv } from "date-fns/locale";

export type Slot = { id?: number; startTime: Date; endTime?: Date };
type Props = {
  availableTimeSlots: Slot[];
  onComplete: (slot: Slot, formatted: string) => Promise<void>;
  buttonLabel?: string;
};

//const weekdays = ["Mån", "Tis", "Ons"];

export default function SelectTimeSlot({
  availableTimeSlots,
  onComplete,
  buttonLabel,
}: Props) {
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const now = new Date();
  const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 }); // is this monday 00:00:00
  const weekStart = addWeeks(currentWeekStart, weekOffset); // is this monday 00:00:00 of nav week
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 }); // is the sunday 23:59:59 of nav week

  // Prevent navigating to weeks that are entirely in the past
  const disablePrev = isAfter(weekStart, currentWeekStart) === false;
  //prevent navigating to weeks that are more than 4 weeks after this week
  const maxAllowedWeekStart = addWeeks(currentWeekStart, 4);
  const disableNext = isSameDay(weekStart, maxAllowedWeekStart); // if the nav week is the last week (4 weeks after this week)

  // Filter slots: this nav week, and after now
  const slotsThisWeek = availableTimeSlots.filter((slot) => {
    const start = slot.startTime;
    return (
      isWithinInterval(start, { start: weekStart, end: weekEnd }) &&
      isAfter(start, now)
    );
  });

  const groupedSlots = groupSlotsByWeekday(slotsThisWeek); // group by weekday

  // show weekdays with dates (Mon–Wed): label:e.g. mån, dateText: e.g. 27 maj, key: e.g. Mån
  const weekDaysWithDates = [0, 1, 2].map((offset) => {
    const date = addDays(weekStart, offset);
    const label = format(date, "EEE", { locale: sv });
    return {
      label,
      dateText: format(date, "d MMM", { locale: sv }),
      key: label.charAt(0).toUpperCase() + label.slice(1),
      date,
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setWeekOffset(weekOffset - 1)}
          disabled={disablePrev}
        >
          ← Föregående vecka
        </Button>
        <div className="text-md text-muted-foreground">
          {format(weekStart, "d MMM", { locale: sv })} –{" "}
          {format(weekEnd, "d MMM", { locale: sv })}
        </div>
        <Button
          variant="outline"
          onClick={() => setWeekOffset(weekOffset + 1)}
          disabled={disableNext}
        >
          Nästa vecka →
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-x-10 gap-y-2">
        {weekDaysWithDates.map(({ dateText, key }) => (
          <div key={key}>
            <h4 className="text-center font-semibold mb-2">{key}</h4>
            <p className="text-center text-md text-muted-foreground">
              {dateText}
            </p>

            {/* <div className="flex flex-col gap-2 items-center"> */}
            <div className="grid grid-cols-2 gap-2 mb-2 mt-2">
              {groupedSlots[key]?.length ? (
                groupedSlots[key].map((slot) => (
                  <Button
                    key={slot.id}
                    variant={slot.id === selectedSlotId ? "default" : "outline"}
                    onClick={() => setSelectedSlotId(slot.id!)}
                    className="w-full text-sm"
                  >
                    {format(slot.startTime, "HH:mm")}
                  </Button>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">–</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center mt-4">
        <p className="mb-2">
          Vald tid:{" "}
          {selectedSlotId
            ? format(
                availableTimeSlots.find((s) => s.id === selectedSlotId)!
                  .startTime,
                "EEEE d MMMM 'kl.' HH:mm",
                { locale: sv }
              )
            : "Ingen tid vald"}
        </p>
        <Button
          onClick={() => {
            const selectedSlot = availableTimeSlots.find(
              (s) => s.id === selectedSlotId
            );
            if (selectedSlot) {
              const formatted = format(
                selectedSlot.startTime,
                "EEEE d MMMM 'kl.' HH:mm",
                { locale: sv }
              );
              onComplete(selectedSlot, formatted);
            }
          }}
          disabled={!selectedSlotId}
        >
          {buttonLabel ?? "Nästa"}
        </Button>
      </div>
    </div>
  );
}

// get swedish weekday name from date
function getSwedishWeekday(date: Date): string {
  const weekday = format(date, "EEE", { locale: sv }); // e.g., "Mån", "Tis" or "mån" etc.
  return weekday.charAt(0).toUpperCase() + weekday.slice(1); // Capitalize the first letter
}

// Group slots by short Swedish weekday (Mon–Wed)
// return type is Record<string, Slot[]> (key-value pairs dictionary type in JS, key: mån.., value: slot[])
function groupSlotsByWeekday(slots: Slot[]): Record<string, Slot[]> {
  const map: Record<string, Slot[]> = {}; //initially empty object
  for (const slot of slots) {
    const weekday = getSwedishWeekday(slot.startTime);
    if (!map[weekday]) map[weekday] = []; // if the key doesn't exist, create an empty array
    map[weekday].push(slot); //  push the slot into the array for that weekday
  }
  return map;
}
