const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    img1: {
        type: String,
        //required: true
    },
    img2: {
        type: String
    },
    img3: {
        type: String
    },
    img4: {
        type: String
    },
    img5: {
        type: String
    },
    category: {
        type: String, 
        required: true
    },
    link: {
        type: String,
    },
    postID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    author: {
        type: String
    }
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

