const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const usersModel = require("./models/users")
const connect = require("./connect")
const posts = require("./postRoutes")
const itemRoutes = require("./itemRoutes")
const profileRoutes = require("./profileRoutes")
require("dotenv").config({path: "./config.env"})

const app = express()
app.use(express.json())
app.use(cors())

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

// Validate UFL email
function isValidUFLEmail(email) {
    const uflEmailRegex = /@ufl\.edu$/i
    return uflEmailRegex.test(email)
}

// Generate verification token
function generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex')
}

// Send verification email
async function sendVerificationEmail(email, token, name, isOrganization) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001'
    const verificationUrl = `${baseUrl}/verify/${token}`
    const accountType = isOrganization ? 'Organization' : 'UFL'

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Verify Your ${accountType} Account`,
        html: `
            <h1>Welcome ${name}!</h1>
            <h2>Email Verification Required</h2>
            <p>Thank you for registering${isOrganization ? ' your organization' : ' with your UFL email'}.</p>
            <p>Please click the link below to verify your GatorMail address:</p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #FA4616; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${verificationUrl}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you did not create this account, please ignore this email.</p>
        `
    }
    
    try {
        await transporter.sendMail(mailOptions)
        console.log("Verification email sent to:", email)
    } catch (error) {
        console.error("Error sending verification email:", error)
        throw new Error("Failed to send verification email")
    }
}

mongoose.connect(process.env.ATLAS_URI)

// Use routes
app.use('/api/items', itemRoutes)
app.use('/profile', profileRoutes)

app.post("/login", async (req, res) => {
    const {email, password, name} = req.body;

    try {
        const user = await usersModel.findOne({email: email})
        // Validate UFL email

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email"
            })
        }


        if (!user.isOrganization && !isValidUFLEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Student accounts must use @ufl.edu email addresses"
            })
        }


        
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email"
            })
        }
        
        // Check if user is verified
        if(!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email first. Check your GatorMail inbox.",
                needsVerification: true
            })
        }
        
        if(user.password === password) {
            res.json({
                success: true,
                message: "Login successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isOrganization: user.isOrganization  
                }
            })
        } else {
            res.status(401).json({
                success: false,
                message: "Incorrect password"
            })
        }
    } catch(err) {
        console.error("Login error:", err)
        res.status(500).json({
            success: false,
            message: "Server error during login"
        })
    }
})

app.post("/register", async (req, res) => {
    console.log("Registration attempt:", req.body)
    
    try {
        const {email, password, name, isOrganization} = req.body

        // Validate required fields
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // Check to see if UF email, only allow ufl/clicked they are an org
        if (!isOrganization && !isValidUFLEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Only @ufl.edu email addresses are allowed. Please use your GatorMail."
            })
        }
        
        // Check if user already exists
        const existingUser = await usersModel.findOne({email: email.toLowerCase()})
        if(existingUser) {
            if (!existingUser.isVerified) {
                return res.status(400).json({
                    success: false,
                    message: "This email is registered but not verified. Check your GatorMail or request a new verification email.",
                    needsVerification: true
                })
            }
            return res.status(400).json({
                success: false,
                message: "An account with this email already exists"
            })
        }
        
        // Generate verification token
        const verificationToken = generateVerificationToken()
        const verificationExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        
        // Create user with verification fields
        const userData = {
            name: name,
            email: email.toLowerCase(),
            password: password, 
            isOrganization: isOrganization || false,
            isVerified: false,
            verificationToken: verificationToken,
            verificationExpires: verificationExpires
        }
        
        const user = await usersModel.create(userData)
        console.log("User created successfully:", user.email, "Organization:", user.isOrganization)
        
        // Send verification email
        await sendVerificationEmail(user.email, verificationToken, user.name, user.isOrganization)
        
        const emailMessage = isOrganization 
            ? "Registration successful! Please check your email to verify your organization account."
            : "Registration successful! Please check your GatorMail (@ufl.edu) to verify your account."
        

        res.status(201).json({
            success: true,
            message: emailMessage,
            email: user.email
        })

    } catch(err) {
        console.error("Registration error:", err)
        res.status(500).json({
            success: false,
            message: "Server error during registration",
            error: err.message
        })
    }
})

// Email verification endpoint
app.get("/verify/:token", async (req, res) => {
    try {
        const user = await usersModel.findOne({
            verificationToken: req.params.token,
            verificationExpires: { $gt: Date.now() }
        })
        
        if(!user) {
            return res.status(400).send(`
                <html>
                    <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                        <h1 style="color: #FA4616;">Verification Failed</h1>
                        <p>This verification link is invalid or has expired.</p>
                        <p>Please request a new verification email.</p>
                    </body>
                </html>
            `)
        }
        
        // Update user as verified
        user.isVerified = true
        user.verificationToken = undefined
        user.verificationExpires = undefined
        await user.save()
        
        console.log("User verified successfully:", user.email)
        
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        
        res.send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: #0021A5;">Email Verified Successfully!</h1>
                    <p>Your UFL account has been verified.</p>
                    <p>You can now close this window and log in to your account.</p>
                    <a href="${frontendUrl}/login" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #FA4616; color: white; text-decoration: none; border-radius: 5px;">Go to Login</a>
                </body>
            </html>
        `)
    } catch(err) {
        console.error("Verification error:", err)
        res.status(500).send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: red;">Error</h1>
                    <p>An error occurred while verifying your email.</p>
                </body>
            </html>
        `)
    }
})

// Resend verification email
app.post("/resend-verification", async (req, res) => {
    const {email} = req.body
    
    try {
    
        const user = await usersModel.findOne({email: email.toLowerCase()})
        
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email"
            })
        }

        if (!user.isOrganization && !isValidUFLEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Student accounts must use @ufl.edu email addresses"
            })
        }
        
        
        if(user.isVerified) {
            return res.json({
                success: true,
                message: "This email is already verified. You can log in now."
            })
        }
        
        // Generate new token
        const verificationToken = generateVerificationToken()
        user.verificationToken = verificationToken
        user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000
        await user.save()
        
        // Send new verification email
        await sendVerificationEmail(user.email, verificationToken, user.name, user.isOrganization)
        
        res.json({
            success: true,
            message: "Verification email sent to your GatorMail. Please check your inbox."
        })
    } catch(err) {
        console.error("Resend verification error:", err)
        res.status(500).json({
            success: false,
            message: "Error sending verification email"
        })
    }
})

app.listen(3001, async () => {
    try {
        await mongoose.connection.asPromise()
        console.log("Mongoose connected to Atlas")
        
        connect.connectToServer()
        console.log(`Server is running on port: 3001`)
    } catch (error) {
        console.error("Database connection error:", error)
    }
})
