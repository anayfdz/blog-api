"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorController = void 0;
const Author_1 = require("../models/Author");
const uploadCloudinary_1 = require("../config/uploadCloudinary");
class AuthorController {
    static async createAuthor(req, res) {
        try {
            const { name, email, description } = req.body;
            const file = req.file;
            const imagePath = req.file?.path;
            let avatarImage;
            let imageUrl;
            if (file) {
                const buffer = file.buffer;
                const publicId = file.originalname.replace(/\.[^/.]+$/, "");
                try {
                    const result = await (0, uploadCloudinary_1.uploadImage)(buffer, publicId);
                    avatarImage = result.imageUrl;
                }
                catch (error) {
                    console.error('Error uploading image:', error);
                    avatarImage = "";
                }
            }
            const authorData = {
                email,
                name,
                avatarImage: avatarImage || "",
                description,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await Author_1.AuthorModel.createAuthor(authorData);
            res.status(201).json({ message: 'Author succesfully' });
        }
        catch (error) {
            console.error('Error creating Author', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async updateAuthor(req, res) {
        const { id } = req.params;
        const { name, email, description } = req.body;
        const file = req.file;
        try {
            let avatarImage;
            if (file) {
                const buffer = file.buffer;
                const publicId = file.originalname.replace(/\.[^/.]+$/, "");
                try {
                    const result = await (0, uploadCloudinary_1.uploadImage)(buffer, publicId);
                    avatarImage = result.imageUrl;
                }
                catch (error) {
                    console.error('Error uploading image:', error);
                    avatarImage = "";
                }
            }
            // Prepara los datos para la actualización
            const authorData = {
                name,
                email,
                description,
                updatedAt: new Date(),
            };
            if (avatarImage) {
                authorData.avatarImage = avatarImage;
            }
            await Author_1.AuthorModel.updateAuthor(id, authorData);
            res.status(200).json({ message: 'Autor actualizado con exito' });
        }
        catch (error) {
            console.error('Error updating author: ', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async deleteAuthor(req, res) {
        const { id } = req.params;
        try {
            await Author_1.AuthorModel.deleteAuthor(id);
            res.status(200).json({ message: 'Author eliminado con exito' });
        }
        catch (error) {
            console.log('Error deleting: ', error);
            res.status(500).json({
                message: 'Error interno del servidor'
            });
        }
    }
    static async getAuthorById(req, res) {
        const { id } = req.params;
        try {
            const author = await Author_1.AuthorModel.getAuthorById(id);
            if (author) {
                res.status(200).json(author);
            }
            else {
                res.status(404).json({
                    message: 'Author no encontrado'
                });
            }
        }
        catch (error) {
            console.error('Error obteniendo el author por ID', error);
            res.status(500).json({
                message: 'Error interno del servidor'
            });
        }
    }
    static async getAllAuthors(req, res) {
        try {
            const authors = await Author_1.AuthorModel.getAllAuthors();
            res.status(200).json(authors);
        }
        catch (error) {
            console.error('Error obteniendo a los autores: ', error);
            res.status(500).json('Error interno del servidor');
        }
    }
}
exports.AuthorController = AuthorController;
