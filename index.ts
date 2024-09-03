import express from 'express';
import mongodb from 'mongodb';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import {connectDB} from './src/config/db';
import { userRoutes } from './src/routes/userRoutes';
import authRoutes from './src/routes/authRoutes';
import { authorRoutes } from './src/routes/authorRoutes';
import { categoryRoutes } from './src/routes/categoryRoutes';
import { postRoutes } from './src/routes/postRoutes';
import { commentRoutes } from './src/routes/commentRoutes';
import { likeRoutes } from './src/routes/likeRoutes';
import { tagRoutes } from './src/routes/tagRoutes'
import { config } from './src/config/env';
import { applyMiddleware  } from './src/config/middleware';
import { initializedDatabase } from './src/config/dbInitializer';


const app = express();
const port = config.PORT;

// Middleware
applyMiddleware(app);

// Database connection
initializedDatabase().then(() =>{
// Routes
app.use('/api/users',userRoutes);
app.use('/auth',authRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/categories',categoryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/tags', tagRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
})
.catch((error) => {
    console.error('Error connecting to the database: ', error);
});

export { app };


