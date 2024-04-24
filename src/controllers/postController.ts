import { Request, Response } from 'express';
import { PostModel } from '../models/Post'
export class PostController {
    static async createPost(req: Request, res: Response):Promise<void> {
        try {
            const postData = req.body;
            await PostModel.createPost(postData);
            res.status(201).json({message: 'Post created successfully'});
        } catch (error) {
            console.error('Error creating post', error);
            res.status(500).json({ message: 'Error creating post'});
        }
    };
    static async getAllPosts(req: Request, res: Response): Promise<void> {
        try {
            const posts = await PostModel.getAllPosts();
            res.status(200).json({message: 'Successfully retrieved all posts', data: posts});
        } catch (error) {
            console.error('Error getting all posts', error);
            res.status(500).json({ message: 'Internal server error'})
        }
    };
    static async getPostById(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const post = await PostModel.getPostById(id);
            if (post) {
                res.status(200).json({data: post});
            } else {
                res.status(404).json({message:'Post no encontrado'});
            }

        } catch (error) {
            console.error('Error getting post by id', error);
            res.status(500).json('Internal server error');
        }
    };
    static async updatePost(req:Request,res:Response) {
        try {
            const  {id} = req.params;
            const postData = req.body;
            await PostModel.updatePost(id,postData);
            res.status(200).json({message:"Se ha actualizado el post correctamente"});
        } catch (error) {
            console.error('Error updating post', error);
            res.status(500).json('Server Error');
        }
    };
    static async deletePost(req:Request,res:Response) {
        try {
            const {id} = req.params;
            await PostModel.deletePost(id);
            res.status(200).json({message: 'Post eliminado con exito'});
        } catch (error) {
            console.error('Error deleting post', error);
            res.status(500).json('Server Error');
        }
    }
}