const express = require('express')
const multer = require('multer')
const itemModel = require('./models/items')
require("dotenv").config({path: "./config.env"})

const router = express.Router()

// configure multer for memory storage
const storage = multer.memoryStorage()
const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
        fieldSize: 50 * 1024 * 1024 // 50MB limit for field data (for Base64 images in existingImages)
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed'), false)
        }
    }
})

// create new item listing
router.post('/create', upload.array('images', 10), async (req, res) => {
    try {
        const { name, description, hourlyRate, startDate, endDate, ownerEmail } = req.body
        
        // process images, convert to base64 and store in MongoDB
        const imageUploads = []
        if (req.files && req.files.length > 0) {
            req.files.forEach((file, index) => {
                const base64String = file.buffer.toString('base64')
                const dataUri = `data:${file.mimetype};base64,${base64String}`
                
                imageUploads.push({
                    url: dataUri,
                    filename: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size
                })
            })
        }

        // find user by email to get ObjectId
        const usersModel = require('./models/users')
        const user = await usersModel.findOne({ email: ownerEmail.toLowerCase() })
        console.log('Looking for user with email:', ownerEmail.toLowerCase())
        console.log('Found user:', user)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        const newItem = new itemModel({
            name,
            description,
            hourlyRate: parseFloat(hourlyRate),
            images: imageUploads,
            availableDates: {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            },
            owner: user._id,
            ownerEmail,
            ownerName: user.name
        })

        const savedItem = await newItem.save()
        console.log('Saved item:', savedItem)
        res.json({ success: true, item: savedItem })

    } catch (error) {
        console.error('Error creating item:', error)
        res.status(500).json({ error: 'Failed to create item listing' })
    }
})

// get all items (must come before id route)
router.get('/all', async (req, res) => {
    try {
        const items = await itemModel.find()
            .populate('owner', 'name averageRating ratingCount') // Populate owner details
            .sort({ createdAt: -1 });
            
        res.json(items)
    } catch (error) {
        console.error('Error fetching items:', error)
        res.status(500).json({ error: 'Failed to fetch items' })
    }
})

// get items by user (must come before id route)
router.get('/user/:email', async (req, res) => {
    try {
        const { email } = req.params
        const items = await itemModel.find({ ownerEmail: email }).sort({ createdAt: -1 })
        res.json(items)
    } catch (error) {
        console.error('Error fetching user items:', error)
        res.status(500).json({ error: 'Failed to fetch user items' })
    }
})

// update item (must come before GET id to avoid conflicts)
router.put('/:id', upload.array('images', 10), async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, hourlyRate, startDate, endDate, ownerEmail, existingImages } = req.body
        
        console.log('=== UPDATE ITEM REQUEST ===')
        console.log('Item ID:', id)
        console.log('Owner Email:', ownerEmail)
        console.log('Request body fields:', Object.keys(req.body))
        console.log('Files received:', req.files?.length || 0)
        
        // verify item exists and user is owner
        const item = await itemModel.findById(id)
        if (!item) {
            console.log('Item not found')
            return res.status(404).json({ error: 'Item not found' })
        }
        
        console.log('Found item owner:', item.ownerEmail)
        if (item.ownerEmail.toLowerCase() !== ownerEmail.toLowerCase()) {
            console.log('Authorization failed: owner mismatch')
            return res.status(403).json({ error: 'Not authorized to edit this item' })
        }

        // handle images: keep existing & add new ones
        let imageUploads = []
        
        // parse existing images if provided
        if (existingImages) {
            try {
                imageUploads = JSON.parse(existingImages)
                console.log('Parsed existing images:', imageUploads.length)
            } catch (e) {
                console.error('Error parsing existing images:', e)
            }
        }

        // add new images
        if (req.files && req.files.length > 0) {
            console.log('Processing new images:', req.files.length)
            req.files.forEach((file) => {
                const base64String = file.buffer.toString('base64')
                const dataUri = `data:${file.mimetype};base64,${base64String}`
                
                imageUploads.push({
                    url: dataUri,
                    filename: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size
                })
            })
        }

        console.log('Total images after update:', imageUploads.length)

        // validate dates
        if (!startDate || !endDate) {
            console.log('Missing date information')
            return res.status(400).json({ error: 'Start date and end date are required' })
        }

        const updateData = {
            name,
            description,
            hourlyRate: parseFloat(hourlyRate),
            images: imageUploads,
            availableDates: {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            }
        }

        console.log('Update data prepared successfully')
        console.log('Updating in database...')

        const updatedItem = await itemModel.findByIdAndUpdate(id, updateData, { new: true })
        
        if (!updatedItem) {
            console.log('Failed to update item - item not found after update')
            return res.status(404).json({ error: 'Item not found after update' })
        }
        
        console.log('Item updated successfully:', updatedItem._id)
        res.json({ success: true, item: updatedItem })

    } catch (error) {
        console.error('=== ERROR UPDATING ITEM ===')
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
        
        // Send proper JSON error response
        return res.status(500).json({ 
            success: false,
            error: 'Failed to update item', 
            details: error.message,
            name: error.name 
        })
    }
})

// delete item (must come before GET id)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { ownerEmail } = req.body
        
        console.log('Delete request for item:', id, 'by user:', ownerEmail)
        
        // verify item exists and user is owner
        const item = await itemModel.findById(id)
        if (!item) {
            return res.status(404).json({ error: 'Item not found' })
        }
        if (item.ownerEmail.toLowerCase() !== ownerEmail.toLowerCase()) {
            return res.status(403).json({ error: 'Not authorized to delete this item' })
        }

        await itemModel.findByIdAndDelete(id)
        console.log('Item deleted successfully')
        res.json({ success: true, message: 'Item deleted successfully!' })

    } catch (error) {
        console.error('Error deleting item:', error)
        res.status(500).json({ error: 'Failed to delete item', details: error.message })
    }
})

// get single item by id (must come LAST among GET routes with params)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const item = await itemModel.findById(id).populate('owner', 'name averageRating ratingCount')
        if (!item) {
            return res.status(404).json({ error: 'Item not found' })
        }
        res.json(item)
    } catch (error) {
        console.error('Error fetching item:', error)
        res.status(500).json({ error: 'Failed to fetch item' })
    }
})

module.exports = router