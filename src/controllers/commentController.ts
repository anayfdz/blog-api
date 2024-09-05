import { Request, Response } from 'express';
import { CommentModel } from '../models/Comment';
import { LikeModel } from '../models/LikeCounter';
import { PostModel } from '../models/Post';

export class CommentController {
    static async createComment(req: Request, res: Response): Promise<void> {
        try {
            
            const commentData = { ...req.body};
            if (!commentData.post || !commentData.content) {
                res.status(400).json({ message: 'Post ID and content are required' });
                return;
              }
            await CommentModel.createComment(commentData);
            res.status(200).json({message: 'Comment created successfully'});

        } catch (error) {
            console.error('Error in creating comment', error);
            res.status(500).json({ message: 'Error creating comment'});
        }
    };
    static async updateComment(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const commentData = req.body;
            await CommentModel.updateComment(id, commentData);
            res.status(200).json({message: 'Comment updated successfully'});
        } catch (error) {
            console.error('Error updating comment', error);
        }
    };
    static async deleteComment(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            await CommentModel.deleteComment(id);
            res.status(200).json({message: 'Deleted Successfully!'})
        } catch (error) {
            console.log("Delete Error", error);
            res.status(500).json({message: 'Internal server error'})
        }
    };
    static async getCommentById(req: Request, res: Response): Promise<void>{
        try {
            const  {id} = req.params;
            const comment = await  CommentModel.getCommentById(id);
            res.status(200).json(comment);
        } catch (error) {
            console.error('Error getting the comment by id', error);
            res.status(500).json({message: 'Internal server error'})
        }
    };
    static async getAllComments(req: Request, res: Response): Promise<void> {
        try {
            const comments = await CommentModel.getAllComments();
            res.status(200).json(comments);
        } catch (error) {
            console.error('Error getting all comments:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async likeComment(req: Request, res: Response) {
        try {
            const { postId, userId } = req.body;
          await LikeModel.likeContent(postId, userId);
          await PostModel.updateCommentLikes(postId);
          res.status(200).send({ message: 'Comment liked successfully' });
        } catch (error) {
          console.error('Error liking comment:', error);
          res.status(500).send({ message: 'Error liking comment' });
        }
      }
}