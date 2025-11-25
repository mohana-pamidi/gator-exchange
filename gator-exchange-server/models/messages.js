const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        index: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    senderEmail: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    receiverEmail: {
        type: String,
        required: true
    },
    receiverName: {
        type: String,
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'items',
        required: false  // Optional - for context about which item was discussed
    },
    itemName: {
        type: String,
        required: false  // Optional - for context
    },
    content: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Index for faster queries
messageSchema.index({ conversationId: 1, createdAt: -1 })
messageSchema.index({ senderEmail: 1 })
messageSchema.index({ receiverEmail: 1 })

const messageModel = mongoose.model("messages", messageSchema)
module.exports = messageModel