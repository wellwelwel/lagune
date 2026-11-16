import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';

const s3 = new S3Client({});
const IMAGE_KEY = /^uploads\/[0-9a-f-]{36}\.(png|jpe?g)$/;

export const resize = async (event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

    if (!IMAGE_KEY.test(key)) continue;

    const original = await s3.send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    );
    const image = Buffer.from(await original.Body.transformToByteArray());
    const thumbnail = await sharp(image, { limitInputPixels: 40_000_000 })
      .resize(320)
      .png()
      .toBuffer();

    await s3.send(
      new PutObjectCommand({
        Bucket: 'thumbnail-function-thumbnails',
        Key: key.replace(/^uploads\//, 'thumbnails/'),
        Body: thumbnail,
        ContentType: 'image/png',
      })
    );
  }
};
