import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export interface UploadResult {
  url: string;
  cloudinary_id: string;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  folder = 'portfolio',
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'image' }, (error, result) => {
        if (error || !result) return reject(error ?? new Error('Upload failed'));
        resolve({ url: result.secure_url, cloudinary_id: result.public_id });
      })
      .end(buffer);
  });
}

export async function deleteFromCloudinary(cloudinaryId: string): Promise<void> {
  await cloudinary.uploader.destroy(cloudinaryId);
}
