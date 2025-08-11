import type { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';
import { Buffer } from 'buffer';
import { s3, bucketName, ensureBucketExists } from '@/lib/minio';

let bucketChecked = false;

const accountSid = process.env.TWILIO_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromNumber = process.env.TWILIO_PHONE!;

//initializing the Twilio API client, create a client object
const twilioClient = twilio(accountSid, authToken);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  if (!bucketChecked) {
    await ensureBucketExists();
    bucketChecked = true;
  }
  const { base64PDF, fileName, toNumber } = req.body;

  if (!base64PDF || !fileName || !toNumber) {
    return res.status(400).json({ error: 'Missing base64PDF or fileName' });
  }

  try {
    // takes the pdf string and decodes it into binary buffer
    const buffer = Buffer.from(base64PDF, 'base64');
    const objectKey = `${fileName}.pdf`;
    await s3
      .putObject({
        Bucket: bucketName, // where to upload (here "prescriptions")
        Key: objectKey, // the filename in MinIO
        Body: buffer, // actual file content (binary PDF)
        ContentType: 'application/pdf', // helps with file previews
        ACL: 'public-read', // Access Control List 
        // makes file publicly accessible
      })
      .promise();

    const pdfUrl = `${process.env.MINIO_PUBLIC_URL}/${bucketName}/${objectKey}`;
    /* time-limited, secure link that gives someone temporary 
       access to a private file */
    const signedUrl = s3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: objectKey,
      Expires: 60 * 60 * 24, // URL valid for 24 hours
    });

    const normalizedPhone = toNumber
                  .replace(/^0/, '+46') // if starts with 0 
                  .replace(/\s+/g, ''); // remove spaces
                   
    // Send SMS with the PDF link
    const result = await twilioClient.messages.create({
      body: `Klicka på länken för att ladda ner ditt recept : ${signedUrl}`,
      from: fromNumber,
      to: normalizedPhone,
    });

    res.status(200).json({ message: 'SMS sent', sid: result.sid, link: signedUrl, Link : pdfUrl });
  } catch (err) {
    console.error('Error in send-sms:', err);
    res.status(500).json({ error: 'Failed to upload or send SMS' });
  }
}

