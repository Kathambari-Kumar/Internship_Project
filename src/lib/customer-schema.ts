import { z } from "zod";

export const customerSchema = z.object({
  id: z.string().optional(),
  firstname: z.string().min(2, "First name is required"),
  lastname: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email").nullable().optional(),
  phone: z
    .string()
    .length(10, "Phone number is required: Must be 10 digits (07x-xxxxxxx)")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  personalnumber: z
    .string()
    .length(12, "Must be exactly 12 digits (YYYYMMDDXXXX)")
    .regex(/^\d+$/, "Personal number must contain only digits")
    .refine(isValidSwedishPersonalNumber, {
      message: "Invalid personal number",
    }),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

// This function checks if the personal number is valid according to the Luhn algorithm and if the date is valid.
function isValidSwedishPersonalNumber(pnr: string): boolean {
  const clean = pnr.replace(/[-+]/g, "");

  // Must be exactly 12 digits
  if (!/^\d{12}$/.test(clean)) return false;

  const birthdate = clean.substring(0, 8);
  const luhnPart = clean.substring(2); // use last 10 digits for Luhn (YYMMDDXXXX)

  // Check if date is valid
  const year = parseInt(birthdate.substring(0, 4), 10);
  const month = parseInt(birthdate.substring(4, 6), 10) - 1;
  const day = parseInt(birthdate.substring(6, 8), 10);
  const date = new Date(year, month, day);
  const isValidDate =
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day;

  if (!isValidDate) return false;

  // Luhn check
  let sum = 0;
  const digits = luhnPart.split("").map(Number);

  for (let i = 0; i < digits.length - 1; i++) {
    let digit = digits[i];
    if (i % 2 === 0) digit *= 2;
    if (digit > 9) digit -= 9;
    sum += digit;
  }

  const checksum = (10 - (sum % 10)) % 10;
  return checksum === digits[digits.length - 1];
}

// contact form schema which helps to send messages
// to admin(shop owner)

export const contactFormSchema = z.object({
  name: z
  .string()
  .min(1, {message : "Name is required", })
  .regex(/^[a-zA-Z\s]*$/, { message: "Name must not contain special characters" })
  .nullable()
  .optional(),
  
  email: z
  .string()
  .email("Invalid email address"),
  
  message: z
  .string()
  .min(10, {message : "Message must be at least 10 characters",}),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;