const mongoose = require("mongoose");
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

const messageSchema = new Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message ", messageSchema);

module.exports = Message;
