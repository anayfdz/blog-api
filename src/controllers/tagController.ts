import { Request, Response } from 'express';
import { TagModel} from '../models/Tag';

export class TagController {
    static async getAllTags(res: Response, req: Request): Promise<void> {
        try {
            const tags = await TagModel.getAllTags();
            res.status(200).json({tags});

        } catch (err) {
            console.error('Error getting all tags: ', err);
            res.status(500).json({message: 'Internal server error'})
        }
    };
    static async createTag(res: Response, req: Request): Promise<void> {
        try {
            const tagData = req.body;
            await TagModel.createTag(tagData);
            res.status(200).json({ message: "Tag created successfully" });

        } catch (err) {
            console.error('Error creating tag: ', err);
            res.status(500).json({message: 'Internal server error'});
        }
    }
}