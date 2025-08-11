// pages/api/createAdmin.ts

import { auth } from "@/lib/auth";
import { createAdminUser } from "@/lib/session";
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/prisma";

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
  
  // Creates a new, empty Fetch API Headers object.
  const headersList = new Headers();

  // Copy headers from Node.js req to fetch-compatible Headers
  // Gets all key-value pairs from the Node.js headers object.
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "string") {
      headersList.set(key, value);
    }
  }

  /* 
    req.headers:
      {
        cookie: "session=abc123",
        host: "localhost:3000",
        "user-agent": "Mozilla/5.0",
        accept: "application/json"
      }
    
    Key-value pair be like :
    cookie: session=abc123
    host: localhost:3000
    user-agent: Mozilla/5.0
    accept: application/json

  */ 
  const session = await auth.api.getSession({ headers: headersList }); 

  if (!session || !session.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {

    const existingAdmin = await prisma.admin.findUnique({
      where: { userId: session.user.id },
    });

    if (!existingAdmin) {
      await createAdminUser(session.user.id);
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log("Error", err);
    return res.status(500).json({ error: "Could not create admin" });
  }
}
