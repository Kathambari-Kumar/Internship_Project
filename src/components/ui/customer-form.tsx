// this is a reusable component used in: customer booking page, admin booking page, and customer-create/update page

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, CustomerFormData } from "@/lib/customer-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEffect } from "react";

type CustomerFormProps = {
  defaultCustomer?: CustomerFormData;
  onSubmit: (data: CustomerFormData) => void;
  buttonLable?: string;
  submitted?: boolean;
  onCancel?: () => void;
};
// Define the form fileds
export default function CustomerForm({
  defaultCustomer,
  onSubmit,
  buttonLable = "Submit",
  submitted = false,
  onCancel,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }, // isDirty is true if any field is dirty/changed from default value
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: defaultCustomer,
  });

  // "errors" are zod fields that are not valid"
  useEffect(() => {
    console.log("Zod errors:", errors);
  }, [errors]);

  // "error" are the error that are returned from the server
  const [error, setError] = useState<string | null>(null);

  // myHandleSubmit is a wrapper around the onSubmit function and show error
  const myHandleSubmit = async (data: CustomerFormData) => {
    setError(null); // Reset error state
    try {
      await onSubmit(data); // Call the onSubmit function passed as a prop
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Set error message from the server
      } else {
        setError("Ett okänt fel har inträffat."); // Fallback error message
      }
    }
  };

  return (
    
    <form
      onSubmit={handleSubmit(myHandleSubmit)}
      className="max-w-md space-y-4"
    >    
      <div>
        <label
          htmlFor="firstname"
          className="block text-md mb-1 font-medium text-black"
        >
          Förnamn
        </label>
        <Input
          {...register("firstname")}
          disabled={submitted}
          className="input"
        />
        {errors.firstname && (
          <p className="text-red-500 text-sm">{errors.firstname.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="lastname"
          className="block text-md mb-1 font-medium text-black"
        >
          Efternamn
        </label>
        <Input
          {...register("lastname")}
          disabled={submitted}
          className="input"
        />
        {errors.lastname && (
          <p className="text-red-500 text-sm">{errors.lastname.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-md mb-1 font-medium text-black"
        >
          E-post Adress
        </label>
        <Input {...register("email")} disabled={submitted} className="input" />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-md mb-1 font-medium text-black"
        >
          Telefon
        </label>
        <Input {...register("phone")} disabled={submitted} className="input" />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="personalnumber"
          className="block text-md mb-1 font-medium text-black"
        >
          Person Nummer
        </label>
        <Input
          {...register("personalnumber")}
          disabled={submitted}
          className="input"
        />
        {errors.personalnumber && (
          <p className="text-red-500 text-sm">
            {errors.personalnumber.message}
          </p>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-center space-x-2 mt-4">
        <Button type="submit" disabled={submitted || !isDirty}>
          {buttonLable}
        </Button>
        {onCancel && (
          <Button type="button" onClick={onCancel}>
            Stäng
          </Button>
        )}
      </div>
    </form>
  );
}
