const express = require('express')
const messageModel = require('./models/messages')
const usersModel = require('./models/users')
const itemModel = require('./models/items')
const router = express.Router()

// Generate unique conversation ID between two users (not item-specific)
function generateConversationId(user1Email, user2Email) {
    const emails = [user1Email, user2Email].sort()
    return `${emails[0]}_${emails[1]}`
}

// Get all conversations for a user
router.get('/conversations/:userEmail', async (req, res) => {
    try {
        const { userEmail } = req.params
        
        // Get all messages where user is sender or receiver
        const messages = await messageModel.aggregate([
            {
                $match: {
                    $or: [
                        { senderEmail: userEmail.toLowerCase() },
                        { receiverEmail: userEmail.toLowerCase() }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: '$conversationId',
                    lastMessage: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { 
                                    $and: [
                                        { $eq: ['$receiverEmail', userEmail.toLowerCase()] },
                                        { $eq: ['$read', false] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: { 'lastMessage.createdAt': -1 }
            }
        ])

        res.json({ success: true, conversations: messages })
    } catch (error) {
        console.error('Error fetching conversations:', error)
        res.status(500).json({ success: false, error: 'Failed to fetch conversations' })
    }
})

// Get messages for a specific conversation
router.get('/conversation/:conversationId', async (req, res) => {
    try {
        const { conversationId } = req.params
        const { userEmail } = req.query
        
        const messages = await messageModel
            .find({ conversationId })
            .sort({ createdAt: 1 })
        
        // Mark messages as read if user is the receiver
        if (userEmail) {
            await messageModel.updateMany(
                { 
                    conversationId,
                    receiverEmail: userEmail.toLowerCase(),
                    read: false
                },
                { 
                    $set: { read: true }
                }
            )
        }

        res.json({ success: true, messages })
    } catch (error) {
        console.error('Error fetching messages:', error)
        res.status(500).json({ success: false, error: 'Failed to fetch messages' })
    }
})

// Check if conversation exists between two users
router.get('/conversation-exists', async (req, res) => {
    try {
        const { user1Email, user2Email } = req.query
        
        if (!user1Email || !user2Email) {
            return res.status(400).json({ 
                success: false, 
                error: 'Both user emails are required' 
            })
        }

        const conversationId = generateConversationId(
            user1Email.toLowerCase(),
            user2Email.toLowerCase()
        )

        // Check if any messages exist in this conversation
        const messageExists = await messageModel.findOne({ conversationId })

        if (messageExists) {
            // Get all messages in this conversation
            const messages = await messageModel
                .find({ conversationId })
                .sort({ createdAt: 1 })

            res.json({ 
                success: true, 
                exists: true,
                conversationId,
                messages
            })
        } else {
            res.json({ 
                success: true, 
                exists: false,
                conversationId,
                messages: []  // Return empty array for new conversations
            })
        }
    } catch (error) {
        console.error('Error checking conversation:', error)
        res.status(500).json({ success: false, error: 'Failed to check conversation' })
    }
})

// Send a new message
router.post('/send', async (req, res) => {
    try {
        const { 
            senderEmail, 
            receiverEmail, 
            itemId,      // Optional - for context
            content 
        } = req.body

        // Validate input
        if (!senderEmail || !receiverEmail || !content) {
            return res.status(400).json({ 
                success: false, 
                error: 'Sender email, receiver email, and content are required' 
            })
        }

        // Get sender info
        const sender = await usersModel.findOne({ email: senderEmail.toLowerCase() })
        if (!sender) {
            return res.status(404).json({ success: false, error: 'Sender not found' })
        }

        // Get receiver info
        const receiver = await usersModel.findOne({ email: receiverEmail.toLowerCase() })
        if (!receiver) {
            return res.status(404).json({ success: false, error: 'Receiver not found' })
        }

        // Generate conversation ID (vendor-based, not item-based)
        const conversationId = generateConversationId(
            senderEmail.toLowerCase(), 
            receiverEmail.toLowerCase()
        )

        // Prepare message object
        const messageData = {
            conversationId,
            senderId: sender._id,
            senderEmail: sender.email,
            senderName: sender.name,
            receiverId: receiver._id,
            receiverEmail: receiver.email,
            receiverName: receiver.name,
            content: content.trim(),
            read: false
        }

        // Add item context if provided
        if (itemId) {
            const item = await itemModel.findById(itemId)
            if (item) {
                messageData.itemId = item._id
                messageData.itemName = item.name
            }
        }

        // Create new message
        const newMessage = new messageModel(messageData)
        const savedMessage = await newMessage.save()
        
        res.json({ success: true, message: savedMessage })

    } catch (error) {
        console.error('Error sending message:', error)
        res.status(500).json({ success: false, error: 'Failed to send message' })
    }
})

// Mark conversation as read
router.put('/mark-read/:conversationId', async (req, res) => {
    try {
        const { conversationId } = req.params
        const { userEmail } = req.body

        await messageModel.updateMany(
            { 
                conversationId,
                receiverEmail: userEmail.toLowerCase(),
                read: false
            },
            { 
                $set: { read: true }
            }
        )

        res.json({ success: true })
    } catch (error) {
        console.error('Error marking messages as read:', error)
        res.status(500).json({ success: false, error: 'Failed to mark messages as read' })
    }
})

// Delete a conversation
router.delete('/conversation/:conversationId', async (req, res) => {
    try {
        const { conversationId } = req.params
        const { userEmail } = req.body

        // In a production app, you might want to soft-delete or only delete for one user
        // For now, we'll delete all messages in the conversation
        const result = await messageModel.deleteMany({ conversationId })

        res.json({ 
            success: true, 
            message: `Deleted ${result.deletedCount} messages` 
        })
    } catch (error) {
        console.error('Error deleting conversation:', error)
        res.status(500).json({ success: false, error: 'Failed to delete conversation' })
    }
})

module.exports = router