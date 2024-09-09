"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializedDatabase = void 0;
const db_1 = require("./db");
const User_1 = require("../models/User");
const Author_1 = require("../models/Author");
const Category_1 = require("../models/Category");
const Comment_1 = require("../models/Comment");
const LikeCounter_1 = require("../models/LikeCounter");
const Post_1 = require("../models/Post");
const Tag_1 = require("../models/Tag");
const initializedDatabase = async () => {
    try {
        const db = await (0, db_1.connectDB)();
        console.log("Database connected successfully.");
        await User_1.UserModel.init();
        await Author_1.AuthorModel.init();
        await Category_1.CategoryModel.init();
        await Comment_1.CommentModel.init();
        await LikeCounter_1.LikeModel.init();
        await Post_1.PostModel.init();
        await Tag_1.TagModel.init();
        console.log("Models initialized successfully.");
    }
    catch (err) {
        console.error("Error initializing database and models:", err);
        throw err;
    }
};
exports.initializedDatabase = initializedDatabase;
