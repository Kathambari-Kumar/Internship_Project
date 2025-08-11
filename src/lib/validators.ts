import {z} from "zod";
const timeRegex = /^(?:\d|[01]\d|2[0-3]):[0-5]\d$/;
;
// this is a schema for booking an event by admin/user

export const eventSchema = z.object({
    title : z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be 100 characters or less"),

    description : z
    .string()
    .min(0, "Description is Optional")
    .max(500, "Description must be 500 chracters or less"),
    
    startTime : z.string(),
    endTime : z.string(), 
    isPrivate : z.boolean(),
});

// this is a schema for timeslot table
export const timeSlotSchema = z.object({
    
    startTime: z
        .string()
        .regex(timeRegex, 
        { message: "Start time must be in HH or HH:MM (only :00 or :30) format and valid 24-hour time.",
      }),
    endTime: z
        .string()
        .regex(timeRegex, 
        { message: "End time must be in HH or HH:MM (only :00 or :30) format and valid 24-hour time.",
      }),
      duration: z
        .string()
        .regex(/^\d+$/, 
        { message: "Duration must be numeric only (in minutes)." }),
    })
    .refine((data) => {
        // Parse times into minutes since midnight
        const parseTime = (t: string) => {
            const [h, m = "00"] = t.split(":");
            return parseInt(h) * 60 + parseInt(m);
        };
        return parseTime(data.startTime) < parseTime(data.endTime);
        }, {
        message: "Start time must be earlier than end time.",
        path: ["endTime"], // Associate error with endTime field
});

// shop details schema to update shop contacts
export const shopContactSchema = z.object({

    address: z
    .string()
    .min(2, { message: "City is required (at least 2 characters)" }),

    city: z
      .string()
      .min(2, { message: "City is required (at least 2 characters)" }),
  
    postalCode: z
      .string()
      .regex(/^\d{5}$/, { message: "Invalid postal code – must be 5 digits" }),
  
    phone1: z
      .string()
      .min(7, { message: "Phone number is required (at least 7 digits)" }),
  
    phone2: z
      .string()
      .optional(),
  
    email: z
      .string()
      .email({ message: "Invalid email address" }),
  });

  // prescription Scheme

  export const prescriptionSchema = z.object({
    prevGlassLeft: z.number(),            
    prevGlassRight: z.number(),           
    lensPowerLeft: z.number().optional(),           
    lensPowerRight: z.number().optional(),           
    cylinderLeft: z.number().optional(),  
    cylinderRight: z.number().optional(), 
    axisLeft: z.number().optional(),     
    axisRight: z.number().optional(),     
    additionLeft: z.number().optional(),  
    additionRight: z.number().optional(), 
    leftPD: z.number().optional(),        
    rightPD: z.number().optional(),   
    uncorrectedVisualLeft: z.number().optional(),    
    correctedVisualLeft: z.number().optional(), 
    uncorrectedVisualRight: z.number().optional(), 
    correctedVisualRight: z.number().optional(), 
    noseHeightLeft: z.number().optional(),    
    noseHeightRight: z.number().optional(),     
    glassTypeLeft: z.string().optional(),
    glassTypeRight: z.string().optional(),       
    frameDistance: z.number().optional(),      
    nearFrameDistance: z.number().optional(),  
    currentSymptoms: z.string() 
  });