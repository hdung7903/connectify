const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
*     Conversation:
 *       type: object
 *       required:
 *         - chatId
 *         - senderId
 *         - content
 *       properties:
 *         chatId:
 *           type: string
 *           format: objectId
 *           description: Reference to Chat
 *         senderId:
 *           type: string
 *           format: objectId
 *           description: Reference to User
 *         content:
 *           type: string
 *         contentType:
 *           type: string
 *           enum: [text, image, video, audio, file, link]
 *           default: text
 *         mediaUrl:
 *           type: string
 *         mediaMetadata:
 *           type: object
 *           properties:
 *             size:
 *               type: number
 *             format:
 *               type: string
 *         reactions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: objectId
 *               reaction:
 *                 type: string
 *                 enum: [like, love, haha, wow, sad, angry]
 *         seenBy:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: objectId
 *               seenAt:
 *                 type: string
 *                 format: date-time
 */


const conversationSchema = new Schema({
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    contentType: { type: String, enum: ['text', 'image', 'video', 'audio', 'file', 'link'], default: 'text' },
    mediaUrl: { type: String },
    mediaMetadata: {
        size: { type: Number },
        format: { type: String }
    },
    reactions: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        reaction: { type: String, enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'] }
    }],
    seenBy: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        seenAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation
