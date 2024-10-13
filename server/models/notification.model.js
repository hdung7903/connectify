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

module.exports = mongoose.model('Notification', notificationSchema);
