"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
// Configuración de Cloudinary
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const uploadImage = async (imagePath) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.default.v2.uploader.upload(imagePath, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                if (result && result.secure_url) {
                    resolve(result.secure_url);
                    console.log('Resultado de subida:', result);
                }
                else {
                    reject(new Error('Image upload result is undefined or missing secure_url'));
                }
            }
        });
    });
};
exports.uploadImage = uploadImage;
