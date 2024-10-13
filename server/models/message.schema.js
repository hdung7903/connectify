const conversationSchema = new Schema({
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    contentType: { type: String, enum: ['text', 'image', 'video', 'audio', 'file', 'link'], default: 'text' },
    mediaUrl: { type: String },
    mediaMetadata: {
        size: { type: Number },
        format: { type: String }
    },
    reactions: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        reaction: { type: String, enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'] }
    }],
    seenBy: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        seenAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
