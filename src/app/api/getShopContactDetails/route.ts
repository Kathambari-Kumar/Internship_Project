import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET()
{
    try  {
        const shopDetail = await prisma.shopContactInfo.findFirst();
        return NextResponse.json(shopDetail);
    } catch (error) {
        console.log(error);
       return NextResponse.json({error : "Failed to fetch shop details."})
    }
}