import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const now = new Date();
        const appointments = await prisma.appointment.findMany({
            where: {
              timeSlots: {
                some: { // At least one related record matches the condition
                  startTime: {
                    gt: now, // Only include appointments with future time slots
                  },
                },
              },
            },
            include: {
              timeSlots: {
                orderBy: {
                  startTime: "asc",
                },
              },
            },
            orderBy: {
              id: "asc", // or however you want to order appointments
            },
          });
      
        return NextResponse.json(appointments) // Sending JSON response
    } catch (error) {
        console.error("Error fetching appointments :", error);
        return NextResponse.json({ error: "Failed to fetch appointments" });
    }
}
