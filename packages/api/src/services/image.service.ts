import sharp from 'sharp';
import { uploadToR2, generateKey } from './storage';

export interface ProcessedImage {
  originalUrl: string;
  largeUrl: string;
  thumbnailUrl: string;
}

export const processImage = async (buffer: Buffer, listingId: string): Promise<ProcessedImage> => {
  const image = sharp(buffer);

  const metadata = await image.metadata();
  const ext = metadata.format === 'png' ? 'png' : 'webp';
  const contentType = ext === 'png' ? 'image/png' : 'image/webp';

  const originalResized = image.clone().resize(1920, 1440, { fit: 'inside', withoutEnlargement: true });
  const originalBuffer = await originalResized.toFormat(ext as any, { quality: 85 }).toBuffer();
  const originalKey = generateKey(`listings/${listingId}`, ext);
  const originalUrl = await uploadToR2(originalKey, originalBuffer, contentType);

  const largeBuffer = await sharp(buffer)
    .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
    .toFormat(ext as any, { quality: 80 })
    .toBuffer();
  const largeKey = generateKey(`listings/${listingId}`, ext);
  const largeUrl = await uploadToR2(largeKey, largeBuffer, contentType);

  const thumbBuffer = await sharp(buffer)
    .resize(320, 240, { fit: 'inside', withoutEnlargement: true })
    .toFormat(ext as any, { quality: 75 })
    .toBuffer();
  const thumbKey = generateKey(`listings/${listingId}/thumbs`, ext);
  const thumbnailUrl = await uploadToR2(thumbKey, thumbBuffer, contentType);

  return { originalUrl, largeUrl, thumbnailUrl };
};
