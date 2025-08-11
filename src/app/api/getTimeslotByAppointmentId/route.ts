import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req : Request) {
    const {searchParams} = new URL(req.url);
    const Id = Number(searchParams.get("id"));

    if (isNaN(Id)) {
        return NextResponse.json({ error: "Id parameter is required" });
    }

    try {
        const timeslots = await prisma.timeSlot.findMany(
            {
                where: {
                    appointmentId: Id!,
                  },
                  orderBy: {
                    startTime: "asc",
                  },
                });
        return NextResponse.json(timeslots) // Sending JSON response
    } catch (error) {
        console.error("Error fetching the timeslots:", error);
        return NextResponse.json({ error: "Failed to fetch the timeslots" });
    }
}
