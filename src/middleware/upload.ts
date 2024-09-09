import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento para multer
const storage = multer.memoryStorage();

// Filtramos el tipo de archivo que aceptamos
const fileFilter = (req: any, file: Express.Multer.File, cb: Function) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

// Configuración de multer
const upload = multer({ storage, fileFilter });

export { upload };
