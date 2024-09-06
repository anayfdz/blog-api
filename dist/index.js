"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const userRoutes_1 = require("./src/routes/userRoutes");
const authRoutes_1 = __importDefault(require("./src/routes/authRoutes"));
const authorRoutes_1 = require("./src/routes/authorRoutes");
const categoryRoutes_1 = require("./src/routes/categoryRoutes");
const postRoutes_1 = require("./src/routes/postRoutes");
const commentRoutes_1 = require("./src/routes/commentRoutes");
const likeRoutes_1 = require("./src/routes/likeRoutes");
const tagRoutes_1 = require("./src/routes/tagRoutes");
const env_1 = require("./src/config/env");
const middleware_1 = require("./src/config/middleware");
const dbInitializer_1 = require("./src/config/dbInitializer");
const app = (0, express_1.default)();
exports.app = app;
const port = env_1.config.PORT;
// Middleware
(0, middleware_1.applyMiddleware)(app);
// Database connection
(0, dbInitializer_1.initializedDatabase)().then(() => {
    // Routes
    app.use('/api/users', userRoutes_1.userRoutes);
    app.use('/auth', authRoutes_1.default);
    app.use('/api/authors', authorRoutes_1.authorRoutes);
    app.use('/api/categories', categoryRoutes_1.categoryRoutes);
    app.use('/api/posts', postRoutes_1.postRoutes);
    app.use('/api/comments', commentRoutes_1.commentRoutes);
    app.use('/api/likes', likeRoutes_1.likeRoutes);
    app.use('/api/tags', tagRoutes_1.tagRoutes);
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
    .catch((error) => {
    console.error('Error connecting to the database: ', error);
});
