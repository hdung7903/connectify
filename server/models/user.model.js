const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    verifiedCode: { type: String },
    dob: { type: Date },
    avatarUrl: { type: String },
    bio: { type: String },
    location: {
        city: String,
        country: String,
        lat: Number,
        long: Number
    },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    friendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    accountVerification: {
        isVerified: { type: Boolean, default: false },
        verificationCode: { type: String },
        verifiedAt: { type: Date },
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User
