"use server";

import { ensureAdminAccess } from "@/lib/session";
import { customerSchema, CustomerFormData } from "@/lib/customer-schema";
import prisma from "@/lib/prisma";

// admin-only server actions
export async function CreateCustomer(data: unknown) {
  
  await ensureAdminAccess();
  const result = customerSchema.safeParse(data);

  if (!result.success) {
    console.error("Validation failed:", result.error.format());
    throw new Error("Validation failed!");
  }

  try {
    const customer = await prisma.customer.create({
      data: {
        ...result.data,
      },
    });
    return customer;
  } catch (err) {
    console.log(err);
    throw new Error("Database error: could not save customer!");
  }
}

export async function GetCustomerById(id: string) {
  await ensureAdminAccess();
  try {
    return await prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        personalnumber: true,
      },
    });
  } catch (err) {
    console.log(err);
    console.error("Database error in getCustomerById:", err);
    return null;
  }
}

export async function GetAllCustomers() {
  await ensureAdminAccess();
  try {
    return await prisma.customer.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        personalnumber: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (err) {
    console.log(err);
    console.error("Database error in getAllCustomers:", err);
    throw err;
  }
}

export async function UpdateCustomer(data: CustomerFormData) {
  await ensureAdminAccess();
  const result = customerSchema.safeParse(data);
  if (!result.success) {
    console.error("Validation failed:", result.error.format());
    throw new Error("Validation failed!");
  }
  try {
    return await prisma.customer.update({
      where: { id: result.data.id },
      data: {
        firstname: result.data.firstname,
        lastname: result.data.lastname,
        email: result.data.email,
        phone: result.data.phone,
        personalnumber: result.data.personalnumber,
      },
    });
  } catch (err) {
    console.log(err);
    console.error("Database error in updateCustomer:", err);
    throw err;
  }
}

export async function SearchCustomersByNameOrPNOrEmailOrPhone(query: string) {
  await ensureAdminAccess();
  if (!query.trim()) return null;

  return await prisma.customer.findMany({
    where: {
      OR: [
        { personalnumber: query },
        { firstname: { contains: query, mode: "insensitive" } },
        { lastname: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { phone: { contains: query, mode: "insensitive" } },
      ],
    },
  });
}

// public access server actions
export async function GetCustomerByPersonalNumber(personalnumber: string) {

  try {
    return await prisma.customer.findUnique({
      where: { personalnumber },
      select: {
        id : true,
        personalnumber: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
      },
    });
  } catch (err) {
    console.log(err);
    console.error("Database error in getCustomerById:", err);
    return null;
  }
}

export async function UpdateCustomerByPersonalNumber(data: CustomerFormData) {
  const result = customerSchema.safeParse(data);
  if (!result.success) {
    console.error("Validation failed:", result.error.format());
    throw new Error("Validation failed!");
  }
  try {
    return await prisma.customer.update({
      where: { personalnumber: result.data.personalnumber },
      data: {
        firstname: result.data.firstname,
        lastname: result.data.lastname,
        email: result.data.email,
        phone: result.data.phone,
      },
    });
  } catch (err) {
    console.error("Database error in updateCustomer:", err);
    throw err;
  }
}

export async function CreateCustomerByCustomer(data: CustomerFormData) {
  const result = customerSchema.safeParse(data);

  if (!result.success) {
    console.error("Validation failed:", result.error.format());
    throw new Error("Validation failed!");
  }

  try {
    const customer = await prisma.customer.create({
      data: {
        ...result.data,
      },
    });
    return customer;
  } catch (err) {
    console.log(err);
    throw new Error("Database error: could not save customer!");
  }
}


export async function CheckCustomerHasPrescription(query : string) {

  await ensureAdminAccess();
  if (!query.trim()) return null;
  return await prisma.customer.findFirst({
    where: {
      personalnumber: { contains: query, mode: "insensitive" } ,
    },
    include: {
      prescriptions: true, 
    },
  });  
}


export async function GetCustomerByEmail(query: string) {
  await ensureAdminAccess();
  try {
    return await prisma.customer.findFirst({
      where: { 
        email : {contains : query, mode : "insensitive" }
    },
    });
  } catch (err) {
    console.error("Database error in getCustomerById:", err);
    return null;
  }
}