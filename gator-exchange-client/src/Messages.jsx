import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Send, MessageSquare, Package } from 'lucide-react'

function Messages() {
    const navigate = useNavigate()
    const location = useLocation()
    const messagesEndRef = useRef(null)
    const conversationLoadedRef = useRef(false)
    
    const [userEmail, setUserEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [conversations, setConversations] = useState([])
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [contextItem, setContextItem] = useState(null)

    useEffect(() => {
        const email = localStorage.getItem('userEmail')
        const name = localStorage.getItem('userName')
        
        if (!email) {
            navigate('/login')
            return
        }
        
        setUserEmail(email)
        setUserName(name || '')
        
        // Initialize: fetch conversations
        fetchConversations(email).then(() => {
            // After conversations are loaded, check if we need to open a specific one
            if (location.state && !conversationLoadedRef.current) {
                const { ownerEmail, ownerName, itemId, itemName } = location.state
                if (ownerEmail) {
                    conversationLoadedRef.current = true
                    loadOrCreateConversation(email, ownerEmail, ownerName, itemId, itemName)
                }
            } else {
                setLoading(false)
            }
        })
    }, [])

    const fetchConversations = async (email) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/messages/conversations/${email}`)
            if (response.data.success) {
                setConversations(response.data.conversations)
            }
            return response.data
        } catch (error) {
            console.error('Error fetching conversations:', error)
            return { success: false }
        }
    }

    const loadOrCreateConversation = async (senderEmail, receiverEmail, receiverName, itemId, itemName) => {
        setLoading(true)
        
        try {
            console.log('Loading conversation between:', senderEmail, 'and', receiverEmail)
            
            // Check if conversation exists
            const response = await axios.get(
                `http://localhost:3001/api/messages/conversation-exists`, {
                    params: {
                        user1Email: senderEmail,
                        user2Email: receiverEmail
                    }
                }
            )

            console.log('Conversation exists response:', response.data)

            if (response.data.success) {
                const { exists, conversationId, messages: existingMessages } = response.data
                
                // Set context item
                if (itemId && itemName) {
                    setContextItem({ id: itemId, name: itemName })
                }

                // Handle both existing and new conversations
                const messagesList = existingMessages || []
                const lastMessage = messagesList.length > 0 
                    ? messagesList[messagesList.length - 1]
                    : null

                // Create conversation object
                const conversationData = {
                    _id: conversationId,
                    lastMessage: {
                        conversationId,
                        senderEmail,
                        senderName: userName,
                        receiverEmail,
                        receiverName,
                        content: lastMessage ? lastMessage.content : '',
                        createdAt: lastMessage ? lastMessage.createdAt : new Date()
                    },
                    unreadCount: 0
                }
                
                setSelectedConversation(conversationData)
                setMessages(messagesList)
                
                if (exists && messagesList.length > 0) {
                    // Mark messages as read
                    await axios.get(
                        `http://localhost:3001/api/messages/conversation/${conversationId}?userEmail=${senderEmail}`
                    )
                }
                
                // Refresh conversations list
                await fetchConversations(senderEmail)
                
                scrollToBottom()
            }
        } catch (error) {
            console.error('Error loading conversation:', error)
            console.error('Error details:', error.response?.data || error.message)
            alert(`Failed to load conversation: ${error.response?.data?.error || error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const selectConversation = async (conversation) => {
        setSelectedConversation(conversation)
        setContextItem(null)
        setLoading(true)
        
        try {
            const response = await axios.get(
                `http://localhost:3001/api/messages/conversation/${conversation._id}?userEmail=${userEmail}`
            )
            if (response.data.success) {
                setMessages(response.data.messages)
                scrollToBottom()
                
                // Refresh conversations to update unread count
                fetchConversations(userEmail)
            }
        } catch (error) {
            console.error('Error fetching messages:', error)
        } finally {
            setLoading(false)
        }
    }

    const sendMessage = async (e) => {
        e.preventDefault()
        
        if (!newMessage.trim() || !selectedConversation) return
        
        setSending(true)
        
        try {
            const lastMsg = selectedConversation.lastMessage
            const receiverEmail = lastMsg.senderEmail === userEmail 
                ? lastMsg.receiverEmail 
                : lastMsg.senderEmail

            const messageData = {
                senderEmail: userEmail,
                receiverEmail: receiverEmail,
                content: newMessage.trim()
            }

            // Add item context if we have it
            if (contextItem?.id) {
                messageData.itemId = contextItem.id
            }

            const response = await axios.post('http://localhost:3001/api/messages/send', messageData)

            if (response.data.success) {
                setMessages([...messages, response.data.message])
                setNewMessage('')
                scrollToBottom()
                
                // Clear context item after first message
                setContextItem(null)
                
                // Refresh conversations to update last message
                fetchConversations(userEmail)
            }
        } catch (error) {
            console.error('Error sending message:', error)
            alert('Failed to send message. Please try again.')
        } finally {
            setSending(false)
        }
    }

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }

    const formatTime = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getOtherPartyName = (conversation) => {
        const lastMsg = conversation.lastMessage
        return lastMsg.senderEmail === userEmail 
            ? lastMsg.receiverName 
            : lastMsg.senderName
    }

    const getDiscussedItems = () => {
        const itemMap = new Map()
        messages.forEach(msg => {
            if (msg.itemId && msg.itemName) {
                itemMap.set(msg.itemId.toString(), msg.itemName)
            }
        })
        return Array.from(itemMap.entries()).map(([id, name]) => ({ id, name }))
    }

    if (loading && conversations.length === 0 && !selectedConversation) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* Navigation Bar */}
            <nav className="navbar navbar-dark" style={{ backgroundColor: '#0021A5' }}>
                <div className="container">
                    <button 
                        className="btn btn-outline-light"
                        onClick={() => navigate('/home')}
                    >
                        <ArrowLeft size={20} className="me-2" />
                        Back to Home
                    </button>
                    <span className="navbar-brand fw-bold">
                        <MessageSquare size={24} className="me-2" />
                        Messages
                    </span>
                </div>
            </nav>

            <div className="container-fluid mt-4">
                <div className="row" style={{ height: 'calc(100vh - 120px)' }}>
                    {/* Conversations List */}
                    <div className="col-md-4 border-end" style={{ overflowY: 'auto', height: '100%' }}>
                        <h5 className="mb-3">Conversations</h5>
                        
                        {conversations.length === 0 && !selectedConversation ? (
                            <div className="text-center py-5">
                                <MessageSquare size={48} className="text-muted mb-3" />
                                <p className="text-muted">No conversations yet</p>
                                <p className="text-muted small">
                                    Click "Rent this item" on any listing to start a conversation
                                </p>
                            </div>
                        ) : (
                            <div className="list-group">
                                {conversations.map((conversation) => (
                                    <button
                                        key={conversation._id}
                                        className={`list-group-item list-group-item-action ${
                                            selectedConversation?._id === conversation._id ? 'active' : ''
                                        }`}
                                        onClick={() => selectConversation(conversation)}
                                    >
                                        <div className="d-flex w-100 justify-content-between">
                                            <h6 className="mb-1">
                                                {getOtherPartyName(conversation)}
                                            </h6>
                                            {conversation.unreadCount > 0 && (
                                                <span className="badge bg-danger rounded-pill">
                                                    {conversation.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <p className="mb-0 small text-truncate">
                                            {conversation.lastMessage.content || 'Start a conversation...'}
                                        </p>
                                        <small className="text-muted">
                                            {formatTime(conversation.lastMessage.createdAt)}
                                        </small>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Messages Area */}
                    <div className="col-md-8 d-flex flex-column" style={{ height: '100%' }}>
                        {selectedConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="border-bottom pb-3 mb-3">
                                    <h5 className="mb-1">
                                        {getOtherPartyName(selectedConversation)}
                                    </h5>
                                    
                                    {/* Show context item if we just clicked from an item */}
                                    {contextItem && (
                                        <div className="alert alert-info py-2 mb-2 mt-2" style={{ fontSize: '0.9rem' }}>
                                            <Package size={16} className="me-2" />
                                            Inquiring about: <strong>{contextItem.name}</strong>
                                        </div>
                                    )}
                                    
                                    {/* Show items discussed in this conversation */}
                                    {messages.length > 0 && getDiscussedItems().length > 0 && (
                                        <div className="mt-2">
                                            <small className="text-muted">
                                                <Package size={14} className="me-1" />
                                                Items discussed: 
                                                {getDiscussedItems().map((item, idx) => (
                                                    <span key={item.id}>
                                                        {idx > 0 && ', '}
                                                        <strong>{item.name}</strong>
                                                    </span>
                                                ))}
                                            </small>
                                        </div>
                                    )}
                                </div>

                                {/* Messages */}
                                <div 
                                    className="flex-grow-1 overflow-auto mb-3" 
                                    style={{ maxHeight: 'calc(100vh - 300px)' }}
                                >
                                    {messages.length === 0 ? (
                                        <div className="text-center text-muted py-5">
                                            <p>No messages yet. Start the conversation!</p>
                                            {contextItem && (
                                                <p className="small">
                                                    Send a message about <strong>{contextItem.name}</strong>
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        messages.map((message, index) => (
                                            <div key={message._id || index}>
                                                {/* Show item context if message has item reference */}
                                                {message.itemName && (
                                                    index === 0 || 
                                                    messages[index - 1].itemId?.toString() !== message.itemId?.toString()
                                                ) && (
                                                    <div className="text-center my-3">
                                                        <small className="badge bg-secondary">
                                                            <Package size={12} className="me-1" />
                                                            {message.itemName}
                                                        </small>
                                                    </div>
                                                )}
                                                
                                                <div
                                                    className={`d-flex mb-3 ${
                                                        message.senderEmail === userEmail 
                                                            ? 'justify-content-end' 
                                                            : 'justify-content-start'
                                                    }`}
                                                >
                                                    <div
                                                        className={`rounded p-3 ${
                                                            message.senderEmail === userEmail
                                                                ? 'bg-primary text-white'
                                                                : 'bg-light'
                                                        }`}
                                                        style={{ maxWidth: '70%' }}
                                                    >
                                                        <p className="mb-1">{message.content}</p>
                                                        <small 
                                                            className={
                                                                message.senderEmail === userEmail 
                                                                    ? 'text-white-50' 
                                                                    : 'text-muted'
                                                            }
                                                        >
                                                            {formatTime(message.createdAt)}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <form onSubmit={sendMessage} className="border-top pt-3">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Type your message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            disabled={sending}
                                        />
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                            disabled={sending || !newMessage.trim()}
                                        >
                                            {sending ? (
                                                <span className="spinner-border spinner-border-sm" />
                                            ) : (
                                                <>
                                                    <Send size={18} className="me-1" />
                                                    Send
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="d-flex align-items-center justify-content-center h-100">
                                <div className="text-center text-muted">
                                    <MessageSquare size={64} className="mb-3" />
                                    <p>Select a conversation to view messages</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messages