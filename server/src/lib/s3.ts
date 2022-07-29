import * as Minio from 'minio'

export interface S3Client {
  bucketName: string
  client: Minio.Client
  list(prefix: string): Promise<Minio.BucketItem[]>
}

/** Create an S3 client from environment variables, if they are all set */
export function getS3ClientFromEnv(processEnv = process.env): S3Client | null {
  const { S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET_NAME } =
    processEnv

  if (!S3_ENDPOINT || !S3_ACCESS_KEY || !S3_SECRET_KEY || !S3_BUCKET_NAME) {
    return null
  }

  const bucketName = S3_BUCKET_NAME

  const client = new Minio.Client({
    endPoint: S3_ENDPOINT,
    accessKey: S3_ACCESS_KEY,
    secretKey: S3_SECRET_KEY,
  })

  function list(prefix: string) {
    const stream = client.listObjectsV2(bucketName, prefix)

    return new Promise<Minio.BucketItem[]>((resolve, reject) => {
      const items: Minio.BucketItem[] = []
      stream.on('data', (item) => items.push(item))
      stream.on('end', () => resolve(items))
      stream.on('error', (error) => reject(error))
    })
  }

  return { bucketName, client, list }
}
