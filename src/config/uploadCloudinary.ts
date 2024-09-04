import cloudinary from 'cloudinary';

// Configuración de Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadImage = async (imagePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(imagePath, (error, result) => {
      if (error) {
        reject(error);
      } else {
        if (result && result.secure_url) {
          resolve(result.secure_url);
          console.log('Resultado de subida:', result);
        } else {
          reject(new Error('Image upload result is undefined or missing secure_url')); 
        }
      }
    });
  });
};
