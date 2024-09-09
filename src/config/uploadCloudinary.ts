import cloudinary from 'cloudinary';
import { v2 as cloudinaryV2 } from 'cloudinary';
// Configuración de Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

interface UploadImageResult {
  imageUrl: string;
}

// Función para subir imagen a Cloudinary
export const uploadImage = async (buffer: Buffer, publicId: string): Promise<UploadImageResult> => {
  return new Promise((resolve, reject) => {
    cloudinaryV2.uploader.upload_stream(
      { public_id: publicId, resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error('Error uploading image to Cloudinary:', error);
          return reject(error);
        }
        console.log("uploadImage result:", result);
          resolve({imageUrl: result?.secure_url || ''});
      }
    ).end(buffer);
  });
};
