import { Router, Request, Response } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../config/env';

const router = Router();

const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

interface PresignedUrlRequest {
  filename: string;
  contentType: string;
  fileSize: number;
}

router.post('/presigned-url', async (req: Request, res: Response) => {
  const { filename, contentType, fileSize } = req.body as Partial<PresignedUrlRequest>;

  if (!filename || !contentType || typeof fileSize !== 'number') {
    res.status(400).json({ error: 'Missing required fields: filename, contentType, fileSize' });
    return;
  }

  if (fileSize > 5 * 1024 * 1024 * 1024) {
    res.status(400).json({ error: 'File size exceeds 5GB limit' });
    return;
  }

  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 255);
  const key = `uploads/${Date.now()}-${sanitizedFilename}`;

  if (!config.aws.s3Bucket) {
    res.status(503).json({ error: 'S3 not configured on this server' });
    return;
  }

  try {
    const command = new PutObjectCommand({
      Bucket: config.aws.s3Bucket,
      Key: key,
      ContentType: contentType,
      ContentLength: fileSize,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    res.json({
      url,
      key,
      bucket: config.aws.s3Bucket,
      region: config.aws.region,
      publicUrl: `https://${config.aws.s3Bucket}.s3.${config.aws.region}.amazonaws.com/${key}`,
    });
  } catch (err) {
    console.error('[s3] Error generating presigned URL:', err);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
});

export default router;
