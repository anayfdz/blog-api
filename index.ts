import express from 'express';
import mongodb from 'mongodb';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import {connectDB} from './src/config/db';
import { userRoutes } from './src/routes/userRoutes';
import { authorRoutes } from './src/routes/authorRoutes';
import { categoryRoutes } from './src/routes/categoryRoutes';
import { postRoutes } from './src/routes/postRoutes';
import { commentRoutes } from './src/routes/commentRoutes';
import { likeRoutes } from './src/routes/likeRoutes';
import { tagRoutes } from './src/routes/tagRoutes'
import { roleRoutes } from './src/routes/roleRoutes'
import { config } from './src/config/env';
import { applyMiddleware  } from './src/config/middleware';



const app = express();
const port = config.PORT;

// Middleware
applyMiddleware(app);


// Routes

app.use('/api/users',userRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/categories',categoryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/roles', roleRoutes);

// Database connection

connectDB()
.then(() => {
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
}).catch((error) => {
    console.error('Error connecting to the database: ', error);
});

export { app };


