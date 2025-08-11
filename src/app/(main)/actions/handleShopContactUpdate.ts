"use server";

import { shopContactSchema } from "../../../lib/validators";
import prisma from "../../../lib/prisma";
import { ensureAdminAccess } from "@/lib/session";
import { z } from "zod";

type ShopContactInput = z.infer<typeof shopContactSchema>;
export async function UpdateShopContactDetails(data : ShopContactInput) {
  await ensureAdminAccess(); // to check if admin 
  const details =  await prisma.shopContactInfo.findFirst();
  const validatedData = shopContactSchema.parse(data);

    try {
      await prisma.shopContactInfo.update({
        where : {id : details?.id},
        data : {
            address : validatedData.address,
            city : validatedData.city,
            postalCode : validatedData.postalCode,
            phone1 : validatedData.phone1,
            phone2: validatedData.phone2,
            email : validatedData.email,
        },
      });
    }
    catch(error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }
