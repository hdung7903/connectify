const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     RefreshToken:
 *       type: object
 *       required:
 *         - userId
 *         - token
 *         - expiresAt
 *       properties:
 *         userId:
 *           type: string
 *           format: objectId
 *           description: Reference to User
 *         token:
 *           type: string
 *           description: Unique refresh token
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         isRevoked:
 *           type: boolean
 *           default: false
 */


const refreshTokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    isRevoked: {
        type: Boolean,
        default: false,
    },
});
const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken


