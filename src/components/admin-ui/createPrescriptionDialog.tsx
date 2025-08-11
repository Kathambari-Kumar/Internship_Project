"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { prescriptionSchema } from "@/lib/validators";

type PrescriptionInput = z.infer<typeof prescriptionSchema>
type  props = {
    control : Control<PrescriptionInput>;
    register :UseFormRegister<PrescriptionInput>;
    errors : FieldErrors;
}
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { z } from "zod";

const CreatePrescriptionCard  = ({control, register, errors} : props) => {

    const [symptoms, setSymptoms] = useState('');
    const handleSymptomsSelection = (value : string) => {
        console.log("selected symptom", value);
        console.log("Control", control, errors);
        setSymptoms(value);
    };
return( 
    <>
    <div className="flex gap-6 justify-between mb-4">
        <div className="w-1/4">
            <label 
            className="block text-1xl font-medium text-black">
                Tidigare Glass Höger
            </label>
            <Input   
                id="prevGlassLeft"
                {...register("prevGlassLeft", { valueAsNumber: true })}
                className="rounded-md mt-2" />                  
        </div>

        <div className="w-1/4">
            <label 
            className="block text-1xl font-medium text-black">
                Tidigare Glass Vänster
            </label>
            <Input 
            id="prevGlassRight"
            {...register("prevGlassRight", { valueAsNumber: true })}
            className="rounded-md mt-2"/>                  
        </div> 

        <div className="w-2/4">
            <label 
                className="block text-1xl text-center font-medium text-black">
                Anamnes
            </label>
            <div className="flex gap-3">
            <div className="w-1/2">
                <textarea id="currentSymptoms" value={symptoms} 
                    {...register("currentSymptoms")}
                    onChange={(e) => setSymptoms(e.target.value)}  // in case they type manually
                    className="w-full border rounded px-2 py-1"></textarea>
            </div>
            <div className="w-1/2">
                <Select onValueChange={handleSymptomsSelection} >
                <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Välj Symptom" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="huvudvärk">Huvudvärk</SelectItem>
                <SelectItem value="fotofobi">Fotofobi</SelectItem>
                <SelectItem value="otydlig-syn(avstånd, nära håll)">Otydlig syn (avstånd, nära håll)</SelectItem>
                <SelectItem value="symtomfri rutinundersökning">Symtomfri rutinundersökning</SelectItem>
                </SelectContent>
                </Select>
            </div>    
            </div>
        </div>
    </div>

    <div className="flex gap-6 justify-between mb-4">

        <div className="w-1/4">
            <label 
                className="block text-1xl font-medium text-black">
                P.D vänster {/* pupillary distance */}
            </label>
            <Input   
                id="leftPD"
                {...register("leftPD", { valueAsNumber: true })}
                className="rounded-md mt-2" />                  
        </div>

        <div className="w-1/4">
            <label 
            className="block text-1xl font-medium text-black">
                P.D höger
            </label>
            <Input 
                id="rightPD"
                {...register("rightPD", { valueAsNumber: true })} className="rounded-md mt-2" />                  
        </div> 
        <div className="w-1/4">
            <label 
                className="block text-1xl font-medium text-black">
                Fri Visus vänster {/* visual acuity */}
            </label>
            <Input   
                id="uncorrectedVisualLeft"
                {...register("uncorrectedVisualLeft", { valueAsNumber: true })}
                className="rounded-md mt-2" />                  
        </div>

        <div className="w-1/4">
            <label 
            className="block text-1xl font-medium text-black">
                Fri Visus höger
            </label>
            <Input id="uncorrectedVisualRight"
                {...register("uncorrectedVisualRight", { valueAsNumber: true })} className="rounded-md mt-2" />                  
        </div>    
    </div>

    <div className="flex gap-6 justify-between mb-4">
        <div className="w-1/4">
            <label 
                className="block text-1xl font-medium text-black">
                Styrka vänster
            </label>
            <Input   
                id="lensPowerLeft"
                {...register("lensPowerLeft", { valueAsNumber: true })}
                className="rounded-md mt-2" />                  
        </div>

        <div className="w-1/4">
            <label 
            className="block text-1xl font-medium text-black">
                Styrka höger
            </label>
            <Input id="lensPowerRight"
            {...register("lensPowerRight", { valueAsNumber: true })} className="rounded-md mt-2" />                  
        </div> 
        
        <div className="w-1/4">
            <label 
            className="block text-1xl font-medium text-black">
                Cylinder vänster
            </label>
            <Input  
                id="cylinderLeft"
                {...register("cylinderLeft", { valueAsNumber: true })} 
                className="rounded-md mt-2" />                  
        </div>

        <div className="w-1/4">
            <label 
            className="block text-1xl font-medium text-black">
                Cylinder höger
            </label>
            <Input 
             id="cylinderRight"
             {...register("cylinderRight", { valueAsNumber: true })} 
            className="rounded-md mt-2"/>                  
        </div> 
    </div>

    <div className="flex gap-6 justify-between mb-4">
            
        <div className="w-1/4">
            <label 
            className="block text-1xl font-medium text-black">
                Axel vänster
            </label>
            <Input   
                id="axisLeft"
                {...register("axisLeft", { valueAsNumber: true })}
                className="rounded-md mt-2" />                  
        </div>

        <div className="w-1/4">
            <label 
            className="block text-1xl font-medium text-black">
                Axel höger
            </label>
            <Input id="axisRight"
                {...register("axisRight", { valueAsNumber: true })} className="rounded-md mt-2" />                  
        </div> 

        <div className="w-1/4">
            <label 
                className="block text-1xl font-medium text-black">
                Visus vänster {/* visual acuity */}
            </label>
            <Input   
                id="correctedVisualLeft"
                {...register("correctedVisualLeft", { valueAsNumber: true })}
                className="rounded-md mt-2" />                  
        </div>

        <div className="w-1/4">
            <label 
            className="block text-1xl font-medium text-black">
                Visus höger
            </label>
            <Input id="correctedVisualRight"
                {...register("correctedVisualRight", { valueAsNumber: true })} className="rounded-md mt-2" />                  
        </div>         

    </div>

    <div className="flex gap-6 justify-between mb-4">
        
        <div className="w-1/4">
            <label 
                className="block text-1xl font-medium text-black">
                Add vänster
            </label>
            <Input   
                id="additionLeft"
                {...register("additionLeft", { valueAsNumber: true })}
                className="rounded-md mt-2" />                  
        </div>

        <div className="w-1/4">
            <label 
            className="block text-1xl font-medium text-black">
                Add höger
            </label>
            <Input id="additionRight"
                {...register("additionRight", { valueAsNumber: true })} className="rounded-md mt-2" />                  
        </div> 

        <div className="w-1/4">
            <label 
            className="block text-1xl font-medium text-black">
                Nöshögd Vänster {/* nose height */}
            </label>
            <Input   
                id="noseHeightLeft"
                {...register("noseHeightLeft", { valueAsNumber: true })} 
                className="rounded-md mt-2" />                  
        </div>

        <div className="w-1/4">
            <label 
            className="block text-1xl font-medium text-black">
                Nöshögd Höger {/* nose height */}
            </label>
            <Input   
                id="noseHeightRight"
                {...register("noseHeightRight", { valueAsNumber: true })} 
                className="rounded-md mt-2" />                  
        </div>
       
    </div>

    <div className="flex gap-6 justify-between mb-4">        
    
        <div className="w-1/4">
            <label 
            className="block text-1xl font-medium text-black">
                Glastyp Vänster
            </label>
            <Input id="glassTypeLeft"
                {...register("glassTypeLeft")} className="rounded-md mt-2" />                  
        </div> 

        <div className="w-1/4">
            <label 
            className="block text-1xl font-medium text-black">
                Glastyp Höger
            </label>
            <Input id="glassTypeRight"
                {...register("glassTypeRight")} className="rounded-md mt-2" />                  
        </div> 

        <div className="w-1/4">
            <label 
            className="block text-1xl font-medium text-black">
                Bågeavstånd {/* frame distance */}
            </label>
            <Input id="frameDistance"
                {...register("frameDistance", { valueAsNumber: true })}
                className="rounded-md mt-2" />                  
        </div>

        <div className="w-1/4">
            <label 
            className="block text-1xl font-medium text-black">
                Bäge Näre {/* near frame distance */}
            </label>
            <Input id="nearFrameDistance"
                {...register("nearFrameDistance", { valueAsNumber: true })} className="rounded-md mt-2" />                  
        </div> 
    </div>
    </>
);
};

export default CreatePrescriptionCard;