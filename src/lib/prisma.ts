import { PrismaClient } from "../generated/prisma";

/* declare global {
 var __prisma: PrismaClient | undefined;
}

const prisma = global.__prisma ?? new PrismaClient(); */
const globalForPrisma = globalThis as unknown as {
    __prisma?: PrismaClient;
  };
const prisma = globalForPrisma.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.__prisma = prisma;;
}

export default prisma;