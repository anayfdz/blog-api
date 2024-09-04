import multer from 'multer';
import path from 'path';

// Configura el almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Asegúrate de que esta carpeta exista
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Crea el middleware de multer para manejar la carga de archivos
const upload = multer({ storage }).single('imageUrl');

// Middleware adicional para depuración
const uploadMiddleware = (req: any, res: any, next: any) => {
  console.log("Archivo recibido por multer:", req.file); // Log para depuración
  next();
};

// Exporta multer y el middleware adicional por separado
export { upload, uploadMiddleware };
