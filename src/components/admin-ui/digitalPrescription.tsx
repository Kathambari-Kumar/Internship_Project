"use client";

import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import CustomerCreateModal from "./customer/customer-create-modal";
import { CustomerFormData } from "@/lib/customer-schema";
import { CheckCustomerHasPrescription, GetCustomerByPersonalNumber} from "@/app/(main)/actions/customers";
import React from "react";
import { Customer, Prescription } from "@/generated/prisma";
import CustomerPrescriptionTable from "../ui/customerPrescriptionHistoryTable";
import CreatePrescriptionCard from "./createPrescriptionDialog";
import { Lora } from "next/font/google";
import { prescriptionSchema } from "@/lib/validators";
import { useForm } from "react-hook-form";
import { z } from "zod";
const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePrescription } from "@/app/(main)/actions/handlePrescription";
import generatePrescriptionPDF from "./generatePrescriptionPDF";

export default function CreatePrescriptionForm() {

    
    type CustomerWithPrescriptions = Customer & { prescriptions: Prescription[] };
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<CustomerFormData | null>(null);
    const [prescriptionResults, setPrescription] = useState<CustomerWithPrescriptions | null>(null);
    const [isPending, startTransition] = useTransition();
    const [step, setStep] = useState(1);
    const [hasSearched, setHasSearched] = useState(false);

    const {register, handleSubmit, control, formState:{errors}} = 
    useForm<z.infer<typeof prescriptionSchema>>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
        prevGlassLeft: 0,
        prevGlassRight: 0,
        leftPD: 0,
        rightPD: 0,
        uncorrectedVisualLeft : 0,
        uncorrectedVisualRight : 0,
        lensPowerLeft: 0,
        lensPowerRight: 0,
        cylinderLeft: 0,
        cylinderRight: 0,
        axisLeft: 0,
        axisRight: 0,
        correctedVisualRight: 0,
        correctedVisualLeft: 0,
        additionLeft: 0,
        additionRight: 0,
        noseHeightLeft: 0,
        noseHeightRight: 0,
        glassTypeLeft: "-",
        glassTypeRight : "-",
        frameDistance: 0,
        nearFrameDistance: 0,
        currentSymptoms: ""
      }
    
    });

    
    /*  USECALLBACK 
        Memoize = Remember/cache a value or function so you don’t recompute/recreate it 
        unnecessarily.

        useCallback memoizes(optimize/remembering) a function so it keeps the same identity across 
        renders unless dependencies change.

        This helps React know when to re-run effects or re-render efficiently.

     */

    // search the customer has alredy registered
        const handleSearch = async () => {
            if (!query.trim()) return;
        
            setHasSearched(true);
            startTransition(() => {
                GetCustomerByPersonalNumber(query).then(
                (searchedCustomers) => {
                setResults(searchedCustomers ?? null);
                }
            );
            });

            startTransition(() => {
                CheckCustomerHasPrescription(query).then(
                    (customer) => {
                        setPrescription(customer ?? null);
                    }
                );
            });
        };

        /* useEffect(() => {
            if (step === 1) {        
            handleSearch(); }
        }, [step, handleSearch]); */

    
        const handleCreateClick = () => {
            setStep(2);
        };

        const handleBack = () => {
            setStep(1);
        };

        const onSubmit = async (data:z.infer<typeof prescriptionSchema>) => {
        console.log("Cust Id", results?.id)
        console.log("submit clicked", data, results?.id);
        if (!results?.id) {
                throw new Error("Customer ID is missing.");
            }
            try {
                await CreatePrescription(data, results?.id);
                const email = typeof results.email === 'string' ? results.email.trim() : '';
                await generatePrescriptionPDF(data, results.firstname, results.lastname, email, results.phone);
                handleSearch();
                setStep(1);
            }
            catch(error) {
                console.log("MissLycades Skapa Recept!", error)
            }
        };

        const onError = () => {
            console.error("VALIDATION ERRORS:");
        };

return(
    
    <> 
    {step  === 1 && (
        <>
        <div className="w-full mb-6">
            <label  
            className="text-1xl font-medium text-black">
                Ange PersonNummer om redan registrerad eller skapa en ny kund
            </label>
            <div className="flex">
            <Input autoFocus id="personNumber"  value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-md mt-2 me-1.5" />
            <Button onClick={handleSearch} 
                disabled={isPending} className="mt-2 me-3">
                {isPending ? "Söker..." : "Sök"}
            </Button>       
            <div className="mt-2"><CustomerCreateModal></CustomerCreateModal></div></div>
        </div>
        {hasSearched && (
        <Card> 
        <CardHeader className="font-bold text-2xl bg-amber-200  text-center text-teal-700">
            Kund Detaljer</CardHeader>
        <CardContent>
            {results && (            
            <>                      
                <React.Fragment key={results.id}>
                <p><span className="font-bold">Id : </span>{results.id}</p>
                    <p><span className="font-bold">Namn : </span>
                        {results.firstname} {results.lastname}</p>
                    <p><span className="font-bold">Epost-Adress : </span>{results.email}</p>
                    <p><span className="font-bold">Telefon : </span>{results.phone}</p>
                </React.Fragment>           
            </>)}

            {prescriptionResults && prescriptionResults.prescriptions.length > 0 && (            
            <>                   
                <CustomerPrescriptionTable prescriptions={prescriptionResults.prescriptions} />
                <Button onClick={handleCreateClick}>Skapa nytt recept</Button>             
            </>)}
           
            {!results && !isPending &&(
                <p className="text-red-500">No customer found.</p>
            )}

            {prescriptionResults && prescriptionResults.prescriptions.length  === 0 && (
                <>
                <div className="flex mt-3">
                <p className="text-red-600 text-1xl mt-2 me-3">Ingen tidigare anamnes.</p>
                <Button onClick={handleCreateClick}>Skapa nytt recept</Button></div>
            </>)}

        </CardContent>
        </Card>)}</>)}

        {step === 2 && (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div id="receipt" className="w-full">      
        <h2 className={`${lora.className} text-3xl font-bold text-center text-primary`}>
                Skapa Nytt Recept
            </h2>
            <hr className="my-4 mt-3 border-t border-teal-700" /> 
            <p><span className="font-bold">Namn : </span>{results?.firstname} {" "}{results?.lastname}</p> 
            <p><span className="font-bold">Epost-Adress : </span>{results?.email}</p>
            <hr className="my-4 mt-3 border-t border-teal-700" />  
            <CreatePrescriptionCard control={control} register={register} errors={errors}></CreatePrescriptionCard>
        </div>        
        <div className="flex items-center justify-center gap-2">
        <Button onClick={handleBack}>Tillbaka</Button>
        <Button type="submit">Skapa</Button> </div>     
        <hr className="my-4 mt-3 border-t border-teal-700" />     
    </form>)}
    </>
)};