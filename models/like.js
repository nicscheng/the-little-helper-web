const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    liker: { 
        type: String
    },
    postID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    title: {
        type: String
    },
    content: {
        type: String
    }
}, {timestamps: true})

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;