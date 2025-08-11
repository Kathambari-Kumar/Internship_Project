import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  try {
    //  initializes a connection to an email service 
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'digitaldragons571@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: email,
      to: 'digitaldragons571@gmail.com',
      subject: `New contact form message from ${name}`,
      text: message,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ success: false });
  }
}
