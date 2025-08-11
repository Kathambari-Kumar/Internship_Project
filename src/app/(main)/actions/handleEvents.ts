"use server";

import { eventSchema } from "../../../lib/validators";
import prisma from "../../../lib/prisma";
import { DateTime } from "luxon";
import { ensureAdminAccess } from "@/lib/session";
import { z } from "zod";

type EventSchemaInput = z.infer<typeof eventSchema>

export async function CreateEvent(data : EventSchemaInput)  {

  //If the user is not admin, they are redirected
  const session = await ensureAdminAccess();
  
  // Parse the input as local Stockholm time
  const validatedData = eventSchema.parse(data);
  const localStart = DateTime.fromISO(validatedData.startTime, {
    zone: "Europe/Stockholm",
  });
  const localEnd = DateTime.fromISO(validatedData.endTime, {
    zone: "Europe/Stockholm",
  });

  // Convert to UTC Date objects for DB storage
  const startTime = localStart.toUTC().toJSDate();
  const endTime = localEnd.toUTC().toJSDate();

  const overlappingEvent = await prisma.event.findFirst({
      where: {
        OR: [
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
        ],
      },
    });
  
    if (overlappingEvent) {
      throw new Error("Händelsen överlappar med en befintlig händelse.");
    }
  
    // Create the event
    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        startTime: startTime,
        endTime: endTime,
        userID: session.user.id,
      },
    });
  
    return event;
  }

  export async function CheckConflictWithAppointment(startStr : string, endStr:string): Promise<string>  {
      
    await ensureAdminAccess(); // to check if admin
       
    const startDate = new Date(`${startStr}`);
    const endDate = new Date(`${endStr}`);

    // Check for conflicting timeslot with appointment
      const timeslotConflict = await prisma.timeSlot.findFirst({
        where: {
          appointmentId: { not: null },
          startTime: { lte: startDate },
          endTime: { gte:endDate },
          isAvailable : false
        },
      });
  
    if (timeslotConflict) {
      return "Error";
    }
    return "Success"
  }

  // checking overlap between events

  export async function CheckEventsOverlap(startStr : string, endStr:string): Promise<string> {
    const startDate = new Date(`${startStr}`);
    const endDate = new Date(`${endStr}`);
    const overlappingEvent = await prisma.event.findFirst({
      where: {
        AND: [
          {
            startTime: { lt: endDate },
            endTime: { gt: startDate },
          },
        ],
      },
    });
  
    return overlappingEvent ? "Error" : "Success";
  }
  
  export async function UpdateEvent(data : EventSchemaInput, eventId : number) {
      
      const session = await ensureAdminAccess(); // to check if admin
      const user = session?.user;
    
      const validatedData = eventSchema.parse(data); 
      const startDateUTC = new Date(`${validatedData.startTime}`);
      const endDateUTC = new Date(`${validatedData.endTime}`);

      try {

        // update the old timeslot's eventid as null
        await prisma.timeSlot.updateMany({
          where: {
            eventId: eventId
          },
          data: {
            eventId: null,
            isAvailable : true
          }
        });

        // update the event table timeslot
        await prisma.event.update({
          where : {id : eventId},
          data: {
            title: validatedData.title,
            description: validatedData.description,
            startTime: startDateUTC,
            endTime: endDateUTC,
            userID: user.id,
          },
        });

        // update the event new timeslots in timeslot table
        await prisma.timeSlot.updateMany({
          where : {
            startTime: {
            gte: startDateUTC,
            lt: endDateUTC,
          },
          },
          data : {
            eventId : eventId,
            isAvailable : false
          },
        });
      }
      catch(error) {
        console.error("Error updating event:", error);
        throw error;
      }
    }

  export async function DeleteEvent(eventId : number) {
    await ensureAdminAccess(); // to check if admin
      try {
        // update the timeslot table
        await prisma.timeSlot.updateMany({
          where: {
            eventId: eventId
          },
          data: {
            eventId: null,
            isAvailable : true
          }
        });
        // delete the event from event table
        await prisma.event.delete( {
          where : {id : eventId},
        })
      }
      catch(error){
        throw error;
      }
    }