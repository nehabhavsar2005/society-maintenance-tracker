import { cloudinary } from '../config/cloudinary';
import { logger } from '../config/logger';

export interface UploadedImage {
  url: string;
  publicId: string;
}

export async function uploadImageBuffer(buffer: Buffer, folder = 'society-tracker/complaints'): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ width: 1600, height: 1600, crop: 'limit' }, { quality: 'auto:good' }, { fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          logger.error(`[cloudinary] upload failed: ${error?.message}`);
          return reject(error ?? new Error('Cloudinary upload failed'));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error(`[cloudinary] delete failed: ${(error as Error).message}`);
  }
}
