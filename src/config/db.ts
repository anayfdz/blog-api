import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv'
dotenv.config()
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('Missing MONGO environment variable');
}
let cacheDb: Db | null = null;

const client = new MongoClient(uri);

export async function connectDB(): Promise<Db> {
    if (cacheDb) {
        return cacheDb;
    }
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('test');
        cacheDb = db;
        return db;
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit();
    }
}