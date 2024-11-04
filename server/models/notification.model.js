const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user associated with the notification
 *         type:
 *           type: string
 *           enum: ["friend_request", "message", "comment", "like", "reaction", "follow"]
 *           description: Type of notification
 *         content:
 *           type: string
 *           description: Content of the notification
 *         relatedId:
 *           type: string
 *           description: ID of the related object (e.g., post, comment)
 */

const notificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['friend_request', 'message', 'comment', 'like', 'reaction', 'follow'], required: true },
    content: { type: String, required: true },
    relatedId: { type: Schema.Types.ObjectId }, // Could reference post, comment, etc.
    isRead: { type: Boolean, default: false },
    linkUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    readAt: { type: Date }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification
