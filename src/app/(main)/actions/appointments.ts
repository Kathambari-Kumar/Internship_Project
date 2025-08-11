"use server";
import prisma from "@/lib/prisma";

import { startOfMonth } from "date-fns";

// This function retrieves all confirmed appointments from the current month to future
export async function getAllConfirmedAppointments() {
  const startDate = startOfMonth(new Date());
  return prisma.appointment.findMany({
    where: {
      status: "CONFIRMED",
      timeSlots: {
        some: {
          startTime: {
            gte: startDate,
          },
        },
      },
    },

    include: {
      customer: true,
      timeSlots: true,
    },
  });
}

export type AppointmentWithRelations = Awaited<
  ReturnType<typeof getAllConfirmedAppointments>
>[number];

// This function retrieves all events starting from the beginning of the current month
export async function getAllEvents() {
  const startDate = startOfMonth(new Date());
  return prisma.event.findMany({
    where: {
      startTime: {
        gte: startDate,
      },
    },
  });
}

export type PrismaEvent = Awaited<ReturnType<typeof getAllEvents>>[number];

export async function GetAppointmentById(id: number) {
  if (!id) throw new Error("Appointment ID is required.");

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      customer: true,
      timeSlots: true,
    },
  });

  if (!appointment) {
    throw new Error("Appointment not found.");
  }

  return appointment;
}

export async function GetAppointmentByCustomerId(id: string) {
  if (!id) throw new Error("Appointment ID is required.");

  const appointments = await prisma.appointment.findMany({
    where: { 
      customerId : id },
    include: {
      customer: true,
      timeSlots: true,
    },
  });

  if (appointments.length === 0) {
    throw new Error("Appointment not found.");
  }

  return appointments;
}