const express = require('express')
const multer = require('multer')
const itemModel = require('./models/items')
require("dotenv").config({path: "./config.env"})

const router = express.Router()

// configure multer for memory storage
const storage = multer.memoryStorage()
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
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

// get all items
router.get('/all', async (req, res) => {
    try {
        const items = await itemModel.find().sort({ createdAt: -1 })
        res.json(items)
    } catch (error) {
        console.error('Error fetching items:', error)
        res.status(500).json({ error: 'Failed to fetch items' })
    }
})

// get items by user
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

// get single item by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const item = await itemModel.findById(id)
        if (!item) {
            return res.status(404).json({ error: 'Item not found' })
        }
        res.json(item)
    } catch (error) {
        console.error('Error fetching item:', error)
        res.status(500).json({ error: 'Failed to fetch item' })
    }
})

// update item
router.put('/:id', upload.array('images', 10), async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, hourlyRate, startDate, endDate, ownerEmail, existingImages } = req.body
        
        console.log('Update request for item:', id)
        console.log('Request body:', req.body)
        
        // verify item exists and user is owner
        const item = await itemModel.findById(id)
        if (!item) {
            return res.status(404).json({ error: 'Item not found' })
        }
        if (item.ownerEmail !== ownerEmail) {
            return res.status(403).json({ error: 'Not authorized to edit this item' })
        }

        // handle images: keep existing + add new ones
        let imageUploads = []
        
        // parse existing images if provided
        if (existingImages) {
            try {
                imageUploads = JSON.parse(existingImages)
            } catch (e) {
                console.error('Error parsing existing images:', e)
            }
        }

        // add new images
        if (req.files && req.files.length > 0) {
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

        console.log('Updating item with data:', updateData)

        const updatedItem = await itemModel.findByIdAndUpdate(id, updateData, { new: true })
        console.log('Updated item:', updatedItem)
        res.json({ success: true, item: updatedItem })

    } catch (error) {
        console.error('Error updating item:', error)
        res.status(500).json({ error: 'Failed to update item', details: error.message })
    }
})

// delete item
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
        if (item.ownerEmail !== ownerEmail) {
            return res.status(403).json({ error: 'Not authorized to delete this item' })
        }

        await itemModel.findByIdAndDelete(id)
        console.log('Item deleted successfully')
        res.json({ success: true, message: 'Item deleted successfully' })

    } catch (error) {
        console.error('Error deleting item:', error)
        res.status(500).json({ error: 'Failed to delete item', details: error.message })
    }
})

module.exports = router