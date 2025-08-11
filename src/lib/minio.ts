// lib/minio.ts
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.MINIO_ACCESS_KEY!,
  secretAccessKey: process.env.MINIO_SECRET_KEY!,
  endpoint: process.env.MINIO_ENDPOINT!,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

const bucketName = 'prescriptions';

async function ensureBucketExists() {
  try {
    // api call - Sends a request to check if the bucket exists
    // Also checks if your credentials have permission to access it
    await s3.headBucket({ Bucket: bucketName }).promise();
    console.log(`Bucket "${bucketName}" exists`);
  } catch (err) {
    // if not exist, create the bucket
    console.log(err);
    console.log(`Bucket "${bucketName}" not found, creating...`);
    await s3.createBucket({ Bucket: bucketName }).promise();
    console.log(`Bucket "${bucketName}" created`);
  }
}

export { s3, bucketName, ensureBucketExists };
