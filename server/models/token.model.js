const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: Unique ID of the user the token belongs to
 *         accessToken:
 *           type: string
 *           description: The access token
 *         refreshToken:
 *           type: string
 *           description: The refresh token
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: Expiration date and time for the access token
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time when the token was created
 *       required:
 *         - userId
 *         - accessToken
 *         - refreshToken
 */

const tokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
