"use client";

import { CustomerFormData } from "@/lib/customer-schema";
import { Button } from "@/components/ui/button";
import { UpdateCustomer } from "@/app/(main)/actions/customers";
import CustomerForm from "@/components/ui/customer-form";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";

type CustomerEditModalProps = {
  defaultCustomer: CustomerFormData;
};
export default function CustomerEditModal({
  defaultCustomer,
}: CustomerEditModalProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setSuccessMessage(null);
      setErrorMessage(null);
      setHasSubmitted(true);
      await UpdateCustomer(data);
      setSuccessMessage("✅ Kunden uppdaterades.");
    } catch (error) {
      console.error("Update error:", error);
      setErrorMessage("❌ Kunde inte uppdatera kunden.");
    }
  }; // Call the UpdateCustomer function};

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen && hasSubmitted) {
          window.location.reload();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Redigera kund</Button>
      </DialogTrigger>
     
      <DialogContent className="max-w-md mx-auto justify-center">  
        <DialogHeader> 
          <DialogTitle className="text-center text-2xl text-teal-700">Redigera kund</DialogTitle>         
        </DialogHeader>     
        <CustomerForm
          defaultCustomer={defaultCustomer}
          onSubmit={onSubmit}
          buttonLable="Redigera"
        ></CustomerForm>
        <DialogClose asChild>
          <Button variant="outline">Stäng</Button>
        </DialogClose>
        {successMessage && (
          <p className="text-green-700 bg-green-100 px-4 py-2 rounded mt-2">
            {successMessage}
          </p>
        )}

        {errorMessage && (
          <p className="text-red-600 bg-red-100 px-4 py-2 rounded mt-2">
            {errorMessage}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
