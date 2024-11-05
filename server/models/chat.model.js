const mongoose = require("mongoose");
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

const chatSchema = new Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
