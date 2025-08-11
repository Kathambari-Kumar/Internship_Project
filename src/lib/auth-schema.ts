import { z } from "zod";

// Define the Auth Schema using Zod
export const formSchema = z.object({
    username: z
    .string()
    .min(1, {message :"Name is required"})
    .max(100, {message : "Name is too long"}),
    
    email: z
    .string()
    .email({message : "Please enter a valid email address"})
    .min(2)
    .max(50),
    
    password: z
    .string()
    .min(8, {message : "Password must be atleast 8 characters long"})
    .max(50, {message : "Password caanot exceed 50 characters"}),

  });
  
export const signInFormSchema = formSchema.pick({
    email : true,
    password : true,
});