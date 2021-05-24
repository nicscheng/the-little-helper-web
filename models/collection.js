const mongoose = require('mongoose');

const collectSchema = mongoose.Schema({
    collectName: {
        type: String,
        //required: true
    },
    collector: { 
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

const Collection = mongoose.model('Collection', collectSchema);

module.exports = Collection;