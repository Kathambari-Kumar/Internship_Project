"use server";

import prisma from "../../../lib/prisma";
import { Slot } from "@/components/customer-ui/selectTimeSlot";
import {
  endOfWeek,
  addWeeks,
  addMinutes,
  isEqual,
  startOfDay,
} from "date-fns";
import { DateTime } from "luxon";
import { ensureAdminAccess } from "@/lib/session";

// TimeSlot Creation
export async function CreateTimeSlot(
  dateString: string,
  timeString: string,
  interval: number
) {
  // this retrieves the authenticated session using
  //the headers, ensuring only logged-in users can proceed.

  await ensureAdminAccess();
  const localStart = DateTime.fromISO(`${dateString}T${timeString}`, {
    zone: "UTC+2"
    //zone: "Europe/Stockholm",
  });

  // This gives you a Date object in UTC,
  // but it represents Stockholm local time
  // this is what you store
  const localStartTime = localStart.toJSDate();
  const localEnd = localStart.plus({ minutes: Number(interval) });
  const localEndTime = localEnd.toJSDate();

  // new timeslot will be created in the database
  const timeslot = await prisma.timeSlot.create({
    data: {
      startTime: localStartTime,
      endTime: localEndTime,
      isAvailable: true,
    },
  });

  return timeslot;
}

// Update the timeSlot for an event
export async function updateTimeSlotsForEvent(
  eventId: number,
  startTime: Date,
  endTime: Date
) {
  await ensureAdminAccess(); // to check if admin
  while (startTime < endTime) {
    // Update the timeslot to mark it as unavailable for new event
    await prisma.timeSlot.updateMany({
      where: {
        startTime: startTime,
      },
      data: {
        isAvailable: false,
        eventId: eventId, //to update the eventId field
      },
    });
    // Move to the next 30-minute slot
    startTime.setMinutes(startTime.getMinutes() + 30);
  }
}

export async function GetCustomerAvailableTimeSlots(): Promise<Slot[]> {
  //- from: today to: 4 weeks after the end of this week

  const today = new Date();
  const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 }); // ISO week (Monday–Sunday)
  const toDate = addWeeks(endOfThisWeek, 4);
  // customers can see the available timeslots

  // Step 1: get all available slots
  const allAvailable = await prisma.timeSlot.findMany({
    where: {
      startTime: {
        gte: today,
        lte: toDate,
      },
      isAvailable: true,
    },

    select: {
      id: true,
      startTime: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });
  // Step 2: filter only those that have a following slot 30 mins later
  const filtered: Slot[] = [];

  for (let i = 0; i < allAvailable.length; i++) {
    const current = allAvailable[i];
    const next = allAvailable[i + 1];
    if (!next) continue;

    const expectedNextTime = addMinutes(current.startTime, 30);

    if (isEqual(next.startTime, expectedNextTime)) {
      filtered.push(current);
    }
  }

  return filtered;
}

// This function retrieves all available time slots from today
export async function GetAdminAvailableTimeSlotsForAppointment(): Promise<
  Slot[]
> {
  await ensureAdminAccess();
  const today = startOfDay(new Date());

  // Find the latest endTime in TimeSlot table
  const latestSlot = await prisma.timeSlot.findFirst({
    orderBy: { endTime: "desc" },
    select: { endTime: true },
  });
  if (!latestSlot) return [];
  const endDate = endOfWeek(new Date(latestSlot.endTime), { weekStartsOn: 1 });

  const slots = await prisma.timeSlot.findMany({
    where: {
      startTime: {
        gte: today,
        lte: endDate,
      },
      isAvailable: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });
  return slots;
}
