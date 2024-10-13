const postSchema = new Schema({
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String },
    content: { type: String, required: true },
    media: [{
        type: { type: String, enum: ['image', 'video', 'link', 'audio'], default: 'image' },
        url: { type: String },
        thumbnailUrl: { type: String },
        size: { type: Number }
    }],
    tags: [{ type: String }],
    visibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
    likesCount: { type: Number, default: 0 },
    reactions: {
        like: {
            count: { type: Number, default: 0 },
            users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
        },
        love: {
            count: { type: Number, default: 0 },
            users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
        },
        laugh: {
            count: { type: Number, default: 0 },
            users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
        }
    },
    commentsCount: { type: Number, default: 0 },
    comments: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true },
        reactions: {
            like: {
                count: { type: Number, default: 0 },
                users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
            }
        },
        replies: [{
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
