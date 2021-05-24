const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    writer: { 
        type: String
    },
    postID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    content: {
        type: String
    }
}, {timestamps: true})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;