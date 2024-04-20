import express from 'express';
import mongodb from 'mongodb';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MongoClient } from 'mongodb';
//import { userRoutes, postRoutes, categoryRoutes, commentRoutes, likeRoutes, tagRoutes, roleRoutes } from './routes';


const app = express();
const PORT = process.env.PORT || 3000;
// Middleware

app.use(bodyParser.json());
app.use(cors());

// Routes

/*app.use('/api/users',userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories',categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/roles', roleRoutes);
*/


