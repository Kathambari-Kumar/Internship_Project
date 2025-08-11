"use client";

import { timeSlotSchema } from "../../lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
// The useForm hook comes from the react-hook-form library
import { useForm } from "react-hook-form";

import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React from "react";
import { CreateTimeSlot } from "@/app/(main)/actions/handleTimeslots";
import { toast, ToastOptions } from 'react-toastify';
import { DateTime } from "luxon";

const TimeSlotForm = () => {
  type TimeSlotFormData = z.infer<typeof timeSlotSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof timeSlotSchema>>({
    resolver: zodResolver(timeSlotSchema),
    mode : "onChange",
    defaultValues: {
      startTime: "09:30",
      endTime: "17:00", 
    },
  });

  const toastOptions: ToastOptions = {
    autoClose: 2000,
    onClose: () => {
      window.location.href = "/dashboard";
    }
  };

  const onSubmit = async (data: TimeSlotFormData) => {
    try {
    
        const currentDate = new Date(); // today's date
        const currentMonth = currentDate.getMonth(); // current month
        const endDate = new Date(currentDate);
        endDate.setMonth(currentMonth + 4); // generate slots for 1 month

        while (currentDate <= endDate) {
          const dateString = currentDate.toISOString().split("T")[0];

          // Only generate slots for Mon, Tue, Wed
          const day = currentDate.getDay();
          if (day >= 1 && day <= 3) {
            const startTime = DateTime.fromISO(`${dateString}T${data.startTime}`, {
              zone: "Europe/Stockholm",
            });
            const endTime = DateTime.fromISO(`${dateString}T${data.endTime}`, {
              zone: "Europe/Stockholm",
            });
            const interval = Number(data.duration);

            let slotTime = startTime;

            while (slotTime < endTime) {
              const dateStringISO = startTime.toISODate(); 
              const timeString = slotTime.toFormat("HH:mm"); 
              if (dateStringISO) {
                await CreateTimeSlot(dateStringISO, timeString, interval);
              } else {
                console.warn("Invalid date encountered:", slotTime.toISO());
              }
              slotTime = slotTime.plus({ minutes: interval });
            }
          }
          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
          }
          toast.success("Tidsluckor skapade!", toastOptions);
          console.log("TimeSlots created successfully!");
    }
    catch(error) {
          console.error(error);
          toast.error("Misslyckades med att skapa tidsluckor!!")
    }
      
  };

  return (
    <>
    
    <Card className="w-full max-w-md justify-center">
      <CardHeader className="bg-gray-200 py-4 items-center">
        <CardTitle className="text-2xl text-center">Skapa Tidsluckor</CardTitle>
      </CardHeader>
      <hr/>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="startTime"
              className="block text-1xl font-medium text-black"
            >
              StartTid <span className="text-blue-600">( HH eller HH:MM )</span>
            </label>
            <Input id="startTime" {...register("startTime")} className="mt-2" />
            {errors.startTime && (
              <p className="text-red-600  text-sm mt-1">
                {errors.startTime.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="endTime"
              className="block text-1xl font-medium text-black"
            >
              SlutTid <span className="text-blue-600">( HH eller HH:MM )</span>
            </label>
            <Input id="endTime" {...register("endTime")} className="mt-2" />
            {errors.endTime && (
              <p className="text-red-600  text-sm mt-1">{errors.endTime.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="duration"
              className="block text-1xl font-medium text-black"
            >
              Tidslängd (i minuter)
            </label>
            <Input
              id="duration"
              {...register("duration")}
              defaultValue={30}
              className="mt-2"
            />
            {errors.duration && (
              <p className="text-red-600  text-sm mt-1">{errors.duration.message}</p>
            )}
          </div>
          <p className="text-red-500 font-bold">⚠️This is now handled by a scheduled task!</p>
          <Button type="submit">Avslut</Button>
        </form>
      </CardContent>
    </Card>
  </>
  );
};

export default TimeSlotForm;
