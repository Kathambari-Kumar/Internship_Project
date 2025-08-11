import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const now = new Date();

        const events = await prisma.event.findMany({
        where: {
            startTime: {
            gt: now, // Only fetch events in the future
            },
        },
        orderBy: {
            id: "asc",
        },
        });
        return NextResponse.json(events) // Sending JSON response
    } catch (error) {
        console.error("Error fetching events :", error);
        return NextResponse.json({ error: "Failed to fetch events" });
    }
}
