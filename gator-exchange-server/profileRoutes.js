const express = require('express')
const usersModel = require('./models/users')
const router = express.Router()

// Update user profile
router.put('/update', async (req, res) => {
    try {
        console.log('=== Profile Update Request ===')
        console.log('Request body:', req.body)
        
        const { email, name, password } = req.body

        // Validate required fields
        if (!email || !name) {
            console.log('Missing required fields')
            return res.status(400).json({
                success: false,
                message: 'Email and name are required'
            })
        }

        // Find user by email
        const user = await usersModel.findOne({ email: email.toLowerCase() })
        
        console.log('User found:', user ? 'Yes' : 'No')
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        // Prepare update object
        const updateData = {
            name: name.trim()
        }

        // Only update password if a new one is provided
        if (password && password.trim() !== '') {
            console.log('Password will be updated')
            updateData.password = password
        } else {
            console.log('Password not being updated')
        }

        console.log('Update data:', updateData)

        // Update user
        const updateResult = await usersModel.updateOne(
            { email: email.toLowerCase() },
            { $set: updateData }
        )

        console.log('Update result:', updateResult)

        if (updateResult.modifiedCount > 0 || updateResult.matchedCount > 0) {
            res.json({
                success: true,
                message: 'Profile updated successfully',
                user: {
                    name: name,
                    email: email
                }
            })
        } else {
            res.json({
                success: true,
                message: 'No changes were made',
                user: {
                    name: name,
                    email: email
                }
            })
        }

    } catch (error) {
        console.error('=== Profile Update Error ===')
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to update profile: ' + error.message
        })
    }
})

// Get user profile
router.get('/:email', async (req, res) => {
    try {
        console.log('=== Get Profile Request ===')
        console.log('Email:', req.params.email)
        
        const user = await usersModel.findOne({ email: req.params.email.toLowerCase() })
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        // Don't send password in response
        res.json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                createdAt: user.createdAt
            }
        })

    } catch (error) {
        console.error('=== Get Profile Error ===')
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        })
    }
})

module.exports = router