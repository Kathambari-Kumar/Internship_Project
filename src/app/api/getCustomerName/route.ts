import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req : Request) {
    const {searchParams} = new URL(req.url);
    const customerId = searchParams.get("id");

    if (!customerId) {
        return NextResponse.json({ error: "Customer Id parameter is required" });
    }

    try {
        const customer = await prisma.customer.findUnique({
          where: { id: customerId },
          select: { firstname: true,
                    lastname : true,
                } // select only the customer name
        });
    
        if (!customer) {
          return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }   
        return NextResponse.json(customer); // if succeed

      } catch (error) {
        console.error("Error fetching customer:", error);
        return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
      }
}
