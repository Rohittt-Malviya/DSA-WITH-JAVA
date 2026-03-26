import 'dotenv/config';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const config = {
  port: parseInt(optionalEnv('PORT', '4000'), 10),
  corsOrigin: optionalEnv('CORS_ORIGIN', 'http://localhost:5173'),
  aws: {
    accessKeyId: optionalEnv('AWS_ACCESS_KEY_ID', ''),
    secretAccessKey: optionalEnv('AWS_SECRET_ACCESS_KEY', ''),
    region: optionalEnv('AWS_REGION', 'us-east-1'),
    s3Bucket: optionalEnv('S3_BUCKET', ''),
  },
  roomTimeoutMs: parseInt(optionalEnv('ROOM_TIMEOUT_MS', '3600000'), 10),
};
