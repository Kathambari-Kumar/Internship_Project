"use server";

import prisma from "@/lib/prisma";
import { AppointmentData } from "@/components/customer-ui/bookingWizard";
import { Slot } from "@/components/customer-ui/selectTimeSlot";
import { AppointmentWithRelations } from "./appointments";
import { BookingStatus, Appointment } from "@/generated/prisma";
import { ensureAdminAccess } from "@/lib/session";

export async function HandleAdminBooking(
  data: AppointmentData
): Promise<Appointment> {
  await ensureAdminAccess();
  const { slot, customer, isAdult, isGlasses } = data;

  // 1, check if  slots are still available
  if (!slot) {
    throw new Error("No time slot selected. Please select a time slot.");
  }
  const slots = await prisma.timeSlot.findMany({
    where: {
      startTime: {
        gte: slot.startTime,
      },
      endTime: {
        lte: slot.endTime,
      },
    },
  });

  const unavailable = slots.some((slot) => !slot.isAvailable);

  if (unavailable || slots.length === 0) {
    throw new Error(
      "This time slot is no longer available. Please choose another."
    );
  }

  // 2. Check and save customer OUTSIDE transaction

  if (!customer || !customer.id) {
    throw new Error("Customer is missing or invalid.");
  }
  const existingCustomer = await prisma.customer.findUnique({
    where: { id: customer.id },
  });

  if (!existingCustomer) {
    throw new Error("Customer no longer exists.");
  }

  // 3. Create appointment and update timeslot in transaction

  try {
    const result = await prisma.$transaction(async (tx) => {
      //  Create new appointment linked to saved customer and time slot
      const appointment = await tx.appointment.create({
        data: {
          customerId: existingCustomer.id,
          isAdult,
          isGlasses,
          timeSlots: { connect: slots.map((slot) => ({ id: slot.id })) },
        },
      });

      //  Update the selected time slot: mark as unavailable and link appointment
      await tx.timeSlot.updateMany({
        where: { id: { in: slots.map((s) => s.id) } },
        data: {
          isAvailable: false,
          appointmentId: appointment.id,
        },
      });
      return appointment;
    });
    return result;
  } catch (err) {
    console.error("Error in booking transaction:", err);
    throw new Error("Bokning misslyckades. Försök igen.");
  }
}

export async function HandleAdminBookingReschedule(
  appointment: AppointmentWithRelations,
  newSlot: Slot
) {
  await ensureAdminAccess();
  // 1, check if new slots are still available and find them
  if (!newSlot) {
    throw new Error("No time slot selected. Please select a time slot.");
  }
  const slots = await prisma.timeSlot.findMany({
    where: {
      startTime: {
        gte: newSlot.startTime,
      },
      endTime: {
        lte: newSlot.endTime,
      },
    },
  });

  const unavailable = slots.some((slot) => !slot.isAvailable);

  if (unavailable || slots.length === 0) {
    throw new Error(
      "This time slot is no longer available. Please choose another."
    );
  }

  // 2, check if the appointment exists
  if (
    appointment.status !== BookingStatus.CONFIRMED ||
    !appointment.timeSlots ||
    appointment.timeSlots.length === 0
  ) {
    throw new Error("Appointment not valid for rescheduling.");
  }

  //3, update the appointment and time slots in a transaction
  try {
    await prisma.$transaction(async (tx) => {
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

export async function HandleAdminBookingCancel(
  appointment: AppointmentWithRelations
) {
  await ensureAdminAccess();
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
