// components/CustomerForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { CreateCustomer } from "@/app/(main)/actions/customers";
import CustomerForm from "@/components/ui/customer-form";
import { CustomerFormData } from "@/lib/customer-schema";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export default function CustomerCreateModal() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const onSubmit = async (data: CustomerFormData) => {
    try {
      setSuccessMessage(null);
      setErrorMessage(null);
      setHasSubmitted(true);
      await CreateCustomer(data);
      setSuccessMessage("✅ Kunden skapas.");
    } catch (error) {
      console.error("Kunden skapas error:", error);
      setErrorMessage("❌ Kunde inte skapa kunden.");
    }
  }; // Call the CreateCustomer function};

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen && hasSubmitted) {
          window.location.reload();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Skapa kund</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto justify-center">
        <DialogHeader>
          <DialogTitle>Create Customer</DialogTitle>
        </DialogHeader>

        <CustomerForm
          onSubmit={onSubmit}
          submitted={hasSubmitted}
          buttonLable="Register"
        ></CustomerForm>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
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
