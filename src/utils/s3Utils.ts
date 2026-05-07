import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import s3 from "../lib/s3";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const uploadToS3 = async (file: Express.Multer.File) => {
  const key = `${uuidv4()}-${file.originalname}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return key;
};

export const deleteTrackFromS3 = async (key: string) => {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: key,
    }),
  );
};

export const getTrackStreamUrl = async (key: string) => {
  const cmd = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: key,
  });

  const url = await getSignedUrl(s3, cmd, {
    expiresIn: 60 * 5, // 5 mins
  });

  return url;
};
