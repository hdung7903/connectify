const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Unique username of the user
 *         email:
 *           type: string
 *           description: User's email address
 *         passwordHash:
 *           type: string
 *           description: Hashed password for the user
 *         gender:
 *           type: string
 *           enum: ["male", "female", "other"]
 *           description: User's gender
 *         verifiedCode:
 *           type: string
 *           description: Verification code for account
 *         dob:
 *           type: string
 *           format: date
 *           description: Date of birth of the user
 *         avatarUrl:
 *           type: string
 *           description: URL of the user's avatar image
 *         bio:
 *           type: string
 *           description: Short bio of the user
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *             country:
 *               type: string
 *             lat:
 *               type: number
 *             long:
 *               type: number
 *           description: Location details of the user
 *         friends:
 *           type: array
 *           items:
 *             type: string
 *           description: List of user IDs representing friends
 *       required:
 *         - username
 *         - email
 *         - passwordHash
 */

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    verifiedCode: { type: String },
    dob: { type: Date },
    avatarUrl: { type: String },
    coverUrl: { type: String },
    bio: { type: String },
    location: {
      city: String,
      country: String,
      lat: Number,
      long: Number,
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: "User" }],
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    accountVerification: {
      isVerified: { type: Boolean, default: false },
      verificationCode: { type: String },
      verifiedAt: { type: Date },
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
