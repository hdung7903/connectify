const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String },
    content: { type: String },
    media: [{
        type: { type: String, enum: ['image', 'video', 'link', 'audio'], default: 'image' },
        url: { type: String },
        thumbnailUrl: { type: String },
        size: { type: Number }
    }],
    tags: [{ type: String }],
    visibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
    reactsCount: { type: Number, default: 0 },
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
