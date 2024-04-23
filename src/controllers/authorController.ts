import { Request, Response } from 'express';
import { AuthorModel } from '../models/Author';

export class AuthorController {
    static async createAuthor(req: Request, res: Response): Promise<void> {
        try {
            const authorData = req.body;
            await AuthorModel.createAuthor(authorData);
            res.status(201).json({ message: 'Author succesfully' });
        } catch (error) {
            console.error('Error creating Author', error);
            res.status(500).json({ message: 'Internal server error' })
        }
    }
    static async updateAuthor(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const authorData = req.body;
        try {
            await AuthorModel.updateAuthor(id, authorData);
            res.status(200).json({ message: 'Autor actualizado con exito' })
        } catch (error) {
            console.error('Error updating author: ', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async deleteAuthor(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        try {
            await AuthorModel.deleteAuthor(id);
            res.status(200).json({ message: 'Author eliminado con exito' });
        } catch (error) {
            console.log('Error deleting: ', error);
            res.status(500).json({
                message: 'Error interno del servidor'
            })
        }
    }
    static async getAuthorById(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        try {
            const author = await AuthorModel.getAuthorById(id);
            if (author) {
                res.status(200).json(author);
            } else {
                res.status(404).json({
                    message: 'Author no encontrado'
                })
            }
        } catch (error) {
            console.error('Error obteniendo el author por ID', error);
            res.status(500).json({
                message: 'Error interno del servidor'
            })
        }
    }
    static async getAllAuthors(req: Request, res: Response): Promise<void> {
        try {
            const authors = await AuthorModel.getAllAuthors();
            res.status(200).json(authors);
        } catch (error) {
            console.error('Error obteniendo a los autores: ', error);
            res.status(500).json('Error interno del servidor');
        }
    }
}