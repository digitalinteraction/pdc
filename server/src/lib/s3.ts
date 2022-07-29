import * as Minio from 'minio'

export interface S3Client {
  bucketName: string
  client: Minio.Client
}

/** Create an S3 client from environment variables, if they are all set */
export function getS3ClientFromEnv(processEnv = process.env): S3Client | null {
  const { S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET_NAME } =
    processEnv

  if (!S3_ENDPOINT || !S3_ACCESS_KEY || !S3_SECRET_KEY || !S3_BUCKET_NAME) {
    return null
  }

  return {
    bucketName: S3_BUCKET_NAME,
    client: new Minio.Client({
      endPoint: S3_ENDPOINT,
      accessKey: S3_ACCESS_KEY,
      secretKey: S3_SECRET_KEY,
    }),
  }
}
