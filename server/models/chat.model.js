const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
*     Chat:
 *       type: object
 *       required:
 *         - type
 *       properties:
 *         type:
 *           type: string
 *           enum: [personal, group]
 *         participants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: objectId
 *               joinedAt:
 *                 type: string
 *                 format: date-time
 *               lastSeenMessage:
 *                 type: string
 *                 format: objectId
 *         name:
 *           type: string
 *         avatarUrl:
 *           type: string
 *         admins:
 *           type: array
 *           items:
 *             type: string
 *             format: objectId
 *         lastMessage:
 *           type: object
 *           properties:
 *             messageId:
 *               type: string
 *               format: objectId
 *             preview:
 *               type: string
 *         unreadCount:
 *           type: number
 *           default: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const chatSchema = new Schema({
    type: { type: String, enum: ['personal', 'group'], required: true },
    participants: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        joinedAt: { type: Date, default: Date.now },
        lastSeenMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
    }],
    name: { type: String },
    avatarUrl: { type: String },
    admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: {
        messageId: { type: Schema.Types.ObjectId, ref: 'Message' },
        preview: { type: String }
    },
    unreadCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat
