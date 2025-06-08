import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import crypto from "crypto";
import { Resend } from 'resend';
import { OAuth2Client } from "google-auth-library";
import emailService from "../services/emailService.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
const TOKEN_EXPIRES = "24h";
const RESET_TOKEN_EXPIRES = "1h";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    console.log('Upload directory:', uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `avatar-${uniqueSuffix}${ext}`;
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only image files (JPEG, PNG, GIF) are allowed!'), false);
    }
    cb(null, true);
  }
}).single('avatar');

const createToken = (userId) =>
    jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

// REGISTER
export async function registerUser(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email." });
    }
    if (password.length < 8) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    try {
        if (await User.findOne({ email })) {
            return res.status(409).json({ success: false, message: "User already exists." });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed });
        const token = createToken(user._id);
        res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error." });
    }
}

// LOGIN
export async function loginUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }
        const token = createToken(user._id);
        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error." });
    }
}

// GET CURRENT USER
export async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user.id).select("name email avatar");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error." });
    }
}

// UPDATE PROFILE
export async function updateProfile(req, res) {
    const { name, email } = req.body;
    if (!name || !email || !validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Valid name and email required." });
    }
    try {
        const exists = await User.findOne({ email, _id: { $ne: req.user.id } });
        if (exists) {
            return res.status(409).json({ success: false, message: "Email already in use by another account." });
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true, select: "name email" }
        );
        res.json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error." });
    }
}

// CHANGE PASSWORD
export async function updatePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
        return res.status(400).json({ success: false, message: "Passwords invalid or too short." });
    }
    try {
        const user = await User.findById(req.user.id).select("password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: "Current password incorrect." });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ success: true, message: "Password changed." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error." });
    }
}

// FORGOT PASSWORD
export async function forgotPassword(req, res) {
    const { email } = req.body;
    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Valid email required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if email exists or not
            return res.json({ success: true, message: "If your email is registered, you will receive a password reset link." });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // Send reset email using email service
        await emailService.sendPasswordResetEmail(user, resetToken);

        res.json({ success: true, message: "If your email is registered, you will receive a password reset link." });
    } catch (err) {
        console.error('Password reset error:', err);
        res.status(500).json({ success: false, message: "Error processing request." });
    }
}

// RESET PASSWORD
export async function resetPassword(req, res) {
    const { token, newPassword } = req.body;
    console.log('Reset password request received:', { token: token?.substring(0, 10) + '...', hasPassword: !!newPassword });
    
    if (!token || !newPassword || newPassword.length < 8) {
        console.log('Invalid request data:', { hasToken: !!token, passwordLength: newPassword?.length });
        return res.status(400).json({ success: false, message: "Invalid token or password." });
    }

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        console.log('User found:', !!user);

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token." });
        }

        // Update password and clear reset token
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        console.log('Password reset successful for user:', user.email);
        res.json({ success: true, message: "Password has been reset successfully." });
    } catch (err) {
        console.error('Error in resetPassword:', err);
        res.status(500).json({ success: false, message: "Error resetting password." });
    }
}

// GOOGLE AUTH
export async function googleAuth(req, res) {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ success: false, message: "Google token required." });
    }

    try {
        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Find or create user
        let user = await User.findOne({ email });
        if (!user) {
            // Create new user with Google info
            user = await User.create({
                email,
                name,
                password: crypto.randomBytes(16).toString('hex'), // Random password
                googleId: payload.sub,
                profilePicture: picture
            });
        } else if (!user.googleId) {
            // Link existing account with Google
            user.googleId = payload.sub;
            user.profilePicture = picture;
            await user.save();
        }

        // Create JWT token
        const jwtToken = createToken(user._id);
        res.json({
            success: true,
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (err) {
        console.error(err);
        res.status(401).json({ success: false, message: "Invalid Google token." });
    }
}

// UPLOAD AVATAR
export async function uploadAvatar(req, res) {
    upload(req, res, async function(err) {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ success: false, message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        try {
            const avatarPath = `/uploads/avatars/${req.file.filename}`;
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { avatar: avatarPath },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.json({
                success: true,
                message: 'Avatar uploaded successfully',
                avatar: avatarPath,
                fullAvatarUrl: `${process.env.FRONTEND_URL || 'http://localhost:4000'}${avatarPath}`
            });
        } catch (error) {
            console.error('Error updating avatar:', error);
            res.status(500).json({ success: false, message: 'Error updating avatar' });
        }
    });
}