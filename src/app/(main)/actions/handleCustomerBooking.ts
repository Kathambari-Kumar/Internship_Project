"use server";

import prisma from "@/lib/prisma";
import { AppointmentData } from "@/components/customer-ui/bookingWizard";
import {
  GetCustomerByPersonalNumber,
  UpdateCustomerByPersonalNumber,
  CreateCustomerByCustomer,
} from "./customers";

import { addMinutes, differenceInHours, compareAsc } from "date-fns";
import { Slot } from "@/components/customer-ui/selectTimeSlot";
import { AppointmentWithRelations } from "./appointments";
import { BookingStatus, Appointment } from "@/generated/prisma";

export default async function HandleCustomerBooking(
  appointmentData: AppointmentData
): Promise<Appointment> {
  const { slot, customer, isAdult, isGlasses } = appointmentData;

  // 1, check if two slots are still available
  if (!slot) {
    throw new Error("No time slot selected. Please select a time slot.");
  }
  const slot1 = await prisma.timeSlot.findUnique({
    where: { id: slot.id },
    select: { id: true, endTime: true, isAvailable: true },
  });

  if (!slot1 || !slot1.isAvailable) {
    throw new Error(
      "This time slot is no longer available. Please choose another."
    );
  }
  // Find the next consecutive slot (30 mins later)
  const slot2 = await prisma.timeSlot.findFirst({
    where: {
      startTime: slot1.endTime,
      isAvailable: true,
    },
  });
  if (!slot2) {
    throw new Error(
      "This time slot is no longer available. Please choose another."
    );
  }

  // 2. Check and save customer OUTSIDE transaction
  let savedCustomer;
  try {
    const existingCustomer = await GetCustomerByPersonalNumber(
      customer.personalnumber
    );

    savedCustomer = existingCustomer
      ? await UpdateCustomerByPersonalNumber(customer)
      : await CreateCustomerByCustomer(customer);
  } catch (err) {
    console.error("Customer save error:", err);
    throw new Error("Kunde inte spara kunduppgifter. Försök igen.");
  }

  // 3. Create appointment and update timeslot in transaction
  if (!savedCustomer?.id) {
    throw new Error("Kund-ID saknas. Bokning avbruten.");
  }

  try {
    const appointment = await prisma.$transaction(async (tx) => {
      //  Create new appointment linked to saved customer and time slot
      const appointment = await tx.appointment.create({
        data: {
          customerId: savedCustomer.id,
          isAdult,
          isGlasses,
          timeSlots: { connect: [{ id: slot.id }, { id: slot2.id }] },
        },
      });

      //  Update the selected time slot: mark as unavailable and link appointment
      await tx.timeSlot.updateMany({
        where: { id: { in: [slot1.id, slot2.id] } },
        data: {
          isAvailable: false,
          appointmentId: appointment.id,
        },
      });
      return appointment;
    });

    return appointment;
  } catch (err) {
    console.error("Error in booking transaction:", err);
    throw new Error("Bokning misslyckades. Försök igen.");
  }
}

export async function HandleCustomerBookingReschedule(
  appointment: AppointmentWithRelations,
  newSlot: Slot
) {
  // 1, check if new slots (60 min) are still available and find them
  if (!newSlot) {
    throw new Error("No time slot selected. Please select a time slot.");
  }

  const slots = await prisma.timeSlot.findMany({
    where: {
      startTime: {
        gte: newSlot.startTime,
      },
      endTime: {
        lte: addMinutes(newSlot.startTime!, 60),
      },
    },
  });

  const unavailable = slots.some((slot) => !slot.isAvailable);

  if (unavailable || slots.length === 0) {
    throw new Error(
      "This time slot is no longer available. Please choose another."
    );
  }
  // Check if the original appointment time slot is at least 24 hours in advance
  const isConfirmed = appointment.status === BookingStatus.CONFIRMED;
  const isCancelled = appointment.status === BookingStatus.CANCELLED;
  // 2, check if the appointment exists

  if (!isConfirmed && !isCancelled) {
    throw new Error(
      "Only confirmed or cancelled appointments can be rescheduled."
    );
  }

  if (isConfirmed) {
    const sortedSlots = [...appointment.timeSlots].sort((a, b) =>
      compareAsc(a.startTime, b.startTime)
    );

    const firstSlotStart = sortedSlots[0].startTime;
    const hoursUntil = differenceInHours(firstSlotStart, new Date());
    if (hoursUntil < 24) {
      throw new Error("You can only reschedule more than 24 hours in advance.");
    }
  }

  //3, update the appointment and time slots in a transaction
  try {
    await prisma.$transaction(async (tx) => {
      if (isConfirmed) {
        // Disconnect old slots and mark them as available
        await tx.appointment.update({
          where: { id: appointment.id },
          data: {
            timeSlots: {
              disconnect: appointment.timeSlots.map((s) => ({ id: s.id })),
            },
          },
        });
        //update the old time slots to be available
        await tx.timeSlot.updateMany({
          where: { id: { in: appointment.timeSlots.map((s) => s.id) } },
          data: {
            isAvailable: true,
            appointmentId: null,
          },
        });
      }

      // Connect new slots to the appointment
      await tx.appointment.update({
        where: { id: appointment.id },
        data: {
          timeSlots: {
            connect: slots.map((s) => ({ id: s.id })),
          },
          status: BookingStatus.CONFIRMED,
        },
      });
      // update the new time slots to be unavailable
      await tx.timeSlot.updateMany({
        where: { id: { in: slots.map((s) => s.id) } },
        data: {
          isAvailable: false,
          appointmentId: appointment.id,
        },
      });
    });
  } catch (err) {
    console.error("Error in reschedule booking transaction:", err);
    throw new Error("Ombokning misslyckades. Försök igen.");
  }
}

export async function HandleCustomerBookingCancel(
  appointment: AppointmentWithRelations
) {
  // 1, check if the appointment exists
  const freshAppointment = await prisma.appointment.findUnique({
    where: { id: appointment.id },
    include: { timeSlots: true },
  });
  if (
    !freshAppointment ||
    freshAppointment.status !== BookingStatus.CONFIRMED ||
    !appointment.timeSlots ||
    appointment.timeSlots.length === 0
  ) {
    throw new Error("Appointment not valid for canceling.");
  }

  // Check if the original appointment time slot is at least 24 hours in advance
  const sortedSlots = [...appointment.timeSlots].sort((a, b) =>
    compareAsc(a.startTime, b.startTime)
  );

  const firstSlotStart = sortedSlots[0].startTime;
  const hoursUntil = differenceInHours(firstSlotStart, new Date());
  if (hoursUntil < 24) {
    throw new Error("You can only reschedule more than 24 hours in advance.");
  }

  //2, update the appointment and time slots in a transaction

  try {
    await prisma.$transaction(async (tx) => {
      //  Disconnect time slots
      await tx.appointment.update({
        where: { id: appointment.id },
        data: {
          timeSlots: {
            disconnect: appointment.timeSlots.map((slot) => ({ id: slot.id })),
          },
        },
      });

      //  Free the time slots (mark available)
      await tx.timeSlot.updateMany({
        where: { id: { in: appointment.timeSlots.map((slot) => slot.id) } },
        data: {
          isAvailable: true,
          appointmentId: null,
        },
      });

      //  Mark appointment as cancelled
      await tx.appointment.update({
        where: { id: appointment.id },
        data: {
          status: BookingStatus.CANCELLED,
        },
      });
    });
  } catch (err) {
    console.error("Error in cancel booking transaction:", err);
    throw new Error("Avbokning misslyckades. Försök igen.");
  }
}
