import {
  PutObjectCommandOutput,
  DeleteObjectCommandOutput,
  S3,
} from "@aws-sdk/client-s3";

export async function uploadToS3(
  file: Buffer | File,
  name: string
): Promise<{ file_key: string; file_name: string }> {
  return new Promise((resolve, reject) => {
    try {
      const s3 = new S3({
        region: "us-east-2",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
      });

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = name.split(".").pop();
      const file_key = `uploads/${timestamp}-${randomString}.${extension}`;

      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
        Body: file,
      };

      s3.putObject(
        params,
        (err: any, data: PutObjectCommandOutput | undefined) => {
          return resolve({
            file_key,
            file_name: name,
          });
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

export async function deleteFileFromS3(file_key: string) {
  return new Promise((resolve, reject) => {
    try {
      const s3 = new S3({
        region: "us-east-2",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
      });

      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
      };

      s3.deleteObject(
        params,
        (err: any, data: DeleteObjectCommandOutput | undefined) => {
          return resolve(data);
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${file_key}`;
  return url;
}
