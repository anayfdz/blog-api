import cloudinary from './cloudinaryConfig';

export async function uploadImage(imagePath: string): Promise<string> {
  try {
    const result = await cloudinary.v2.uploader.upload(imagePath);
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}
