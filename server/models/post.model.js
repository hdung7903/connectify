const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         ownerId:
 *           type: string
 *           description: The ID of the post owner (User).
 *         title:
 *           type: string
 *           description: Title of the post.
 *         content:
 *           type: string
 *           description: Content of the post.
 *         media:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [image, video, link, audio]
 *               url:
 *                 type: string
 *               thumbnailUrl:
 *                 type: string
 *               size:
 *                 type: integer
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         visibility:
 *           type: string
 *           enum: [public, friends, private]
 *         reactsCount:
 *           type: integer
 *           description: Total count of reactions.
 *         sharesCount:
 *           type: integer
 *           description: Total count of shares.
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const postSchema = new Schema({
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String },
    content: { type: String, required: true },
    media: [{
        type: { type: String, enum: ['image', 'video', 'link', 'audio'], default: 'image' },
        url: { type: String },
        thumbnailUrl: { type: String },
        size: { type: Number }
    }],
    tags: [{ type: String }],
    visibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
    likesCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    reactions: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        type: { type: String, enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'] },
        createdAt: { type: Date, default: Date.now }
    }],
    comments: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true },
        reactions: [{
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
            type: { type: String, enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'] },
            createdAt: { type: Date, default: Date.now }
        }],
        replies: [{
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
