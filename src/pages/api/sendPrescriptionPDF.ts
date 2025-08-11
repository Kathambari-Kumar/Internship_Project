// pages/api/sendPrescriptionPDF.ts

import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import nodemailer from 'nodemailer';
import { Request, Response } from 'express';


interface NextApiRequestWithFile extends NextApiRequest {
  file: Express.Multer.File;
}

type Middleware = (req: Request, res: Response, next: (err?: unknown) => void) => void;


// Set up multer to handle multipart/form-data
const upload = multer();
const uploadMiddleware = upload.single('pdf');
// Middleware to allow multer usage in Next.js API route
export const config = {
  api: {
    bodyParser: false, // Important! Next.js must NOT parse the body
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /* upload.single('pdf')(req as any, res as any, async (err: any) => {
    if (err) return res.status(500).json({ error: 'Multer error' });  */

    await RunMiddleware(req, res, uploadMiddleware);

    const reqWithFile = req as NextApiRequestWithFile;
    const file = reqWithFile.file;
    //const { email } = req.body as any;
    const { email } = req.body as { email?: string };

    if (!file || !email) {
      return res.status(400).json({ error: 'Missing file or email' });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: '"Oves Optik" <digitaldragons571@gmail.com>',
        to: email,
        subject: 'Ditt Ögon Recept',
        text: 'Bifogat finns ditt recept från din senaste undersökning.',
        attachments: [
          {
            filename: file.originalname || "eye-prescription.pdf",
            content: file.buffer,
          },
        ],
      });

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Email failed' });
    }
  //});
};

export default handler;

function RunMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Middleware
): Promise<void> {
  return new Promise((resolve, reject) => {
    fn(req as unknown as Request, res as unknown as Response, (result: unknown) => {
      if (result instanceof Error) return reject(result);
      return resolve();
    });
  });
}