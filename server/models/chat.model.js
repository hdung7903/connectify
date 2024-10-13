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

module.exports = mongoose.model('Chat', chatSchema);
