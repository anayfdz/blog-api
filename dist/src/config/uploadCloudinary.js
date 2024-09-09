"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const cloudinary_2 = require("cloudinary");
// Configuración de Cloudinary
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
// Función para subir imagen a Cloudinary
const uploadImage = async (buffer, publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary_2.v2.uploader.upload_stream({ public_id: publicId, resource_type: 'image' }, (error, result) => {
            if (error) {
                console.error('Error uploading image to Cloudinary:', error);
                return reject(error);
            }
            console.log("uploadImage result:", result);
            resolve({ imageUrl: result?.secure_url || '' });
        }).end(buffer);
    });
};
exports.uploadImage = uploadImage;
