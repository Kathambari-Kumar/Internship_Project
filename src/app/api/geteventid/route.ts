import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const event = await prisma.event.findMany({
            orderBy: {
                createdAt: 'desc' // Sort newest record first
              },
              take: 1,
    });
        return NextResponse.json(event) // Sending JSON response
    } catch (error) {
        console.error("Error fetching event :", error);
        return NextResponse.json({ error: "Failed to fetch event" });
    }
}
