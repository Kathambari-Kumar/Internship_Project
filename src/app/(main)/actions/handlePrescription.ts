"use server";
import prisma from "@/lib/prisma";
import { ensureAdminAccess } from "@/lib/session";
import { prescriptionSchema } from "@/lib/validators";

export async function CreatePrescription(data : unknown, id : string) {
    await ensureAdminAccess(); // to check if admin
    const result = prescriptionSchema.safeParse(data);
    if (!result.success) {
        console.error("Validation failed:", result.error.format());
        throw new Error("Validation failed!");
      }

      const { 
        prevGlassLeft,
        prevGlassRight,
        leftPD,
        rightPD,
        uncorrectedVisualLeft,
        uncorrectedVisualRight,
        correctedVisualLeft,
        correctedVisualRight,
        lensPowerLeft,
        lensPowerRight,
        noseHeightLeft,
        noseHeightRight,
        currentSymptoms,
        cylinderLeft,
        cylinderRight,
        axisLeft,
        axisRight,
        additionLeft,
        additionRight,        
        glassTypeLeft,
        glassTypeRight,
        frameDistance,
        nearFrameDistance
      } = result.data;
      
      
      
    try {
        const prescription = await prisma.prescription.create({
            data: {
              prevGlassLeft : prevGlassLeft,
              prevGlassRight : prevGlassRight,
              currentSymptoms : currentSymptoms,
              leftPD : leftPD,
              rightPD : rightPD,
              uncorrectedVisualRight : uncorrectedVisualLeft,
              uncorrectedVisualLeft : uncorrectedVisualRight,
              correctedVisualRight : correctedVisualLeft,
              correctedVisualLeft : correctedVisualRight,
              lensPowerLeft : lensPowerLeft,
              lensPowerRight : lensPowerRight,           
              cylinderLeft : cylinderLeft,
              cylinderRight : cylinderRight,
              axisLeft : axisLeft,
              axisRight : axisRight ,
              addLeft : additionLeft,
              addRight : additionRight,
              noseHeightLeft : noseHeightLeft,
              noseHeightRight : noseHeightRight,     
              glassTypeLeft : glassTypeLeft,
              glassTypeRight : glassTypeRight,
              frameDistance : frameDistance,
              nearFrameDistance :nearFrameDistance,   
              customerId: id,              
            },
        });
        return prescription;
    }
    catch(err) {
        console.error("DB error", err);
        throw new Error("Database error: could not save prescription!");
    }
    

}