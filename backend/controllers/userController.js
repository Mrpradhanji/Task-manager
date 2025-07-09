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
        
        // Send welcome email
        console.log('Registration successful, attempting to send welcome email to:', user.email);
        try {
            await emailService.sendWelcomeEmail(user);
            console.log('Welcome email sent successfully during registration');
        } catch (emailError) {
            console.error('Failed to send welcome email during registration:', {
                error: emailError.message,
                code: emailError.code,
                stack: emailError.stack
            });
            // Continue with registration even if email fails
        }
        
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
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
        return res.status(400).json({ success: false, message: "Name is required." });
    }
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name },
            { new: true, runValidators: true, select: "name email avatar" }
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
    console.log('Forgot password request for email:', email);
    
    if (!email || !validator.isEmail(email)) {
        console.log('Invalid email format:', email);
        return res.status(400).json({ success: false, message: "Valid email required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('No user found for email:', email);
            // Don't reveal if email exists or not
            return res.json({ success: true, message: "If your email is registered, you will receive a password reset link." });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        console.log('Generated reset token:', resetToken);
        console.log('Token expiry:', new Date(resetTokenExpiry).toISOString());

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // Send reset email using email service
        await emailService.sendPasswordResetEmail(user, resetToken);
        console.log('Reset email sent successfully to:', email);

        res.json({ success: true, message: "If your email is registered, you will receive a password reset link." });
    } catch (err) {
        console.error('Password reset error:', err);
        res.status(500).json({ success: false, message: "Error processing request." });
    }
}

// RESET PASSWORD
export async function resetPassword(req, res) {
    const { token, newPassword } = req.body;
    console.log('Reset password attempt with token:', token);
    console.log('Token length:', token?.length);
    
    if (!token || !newPassword || newPassword.length < 8) {
        console.log('Invalid request - missing token or password');
        return res.status(400).json({ success: false, message: "Invalid token or password." });
    }

    try {
        // Find user with valid reset token
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            // Let's check if the token exists but is expired
            const expiredUser = await User.findOne({ resetToken: token });
            if (expiredUser) {
                console.log('Token found but expired for user:', expiredUser.email);
                console.log('Token expiry:', new Date(expiredUser.resetTokenExpiry).toISOString());
                return res.status(400).json({ success: false, message: "Reset token has expired. Please request a new one." });
            }
            
            console.log('No user found with token');
            return res.status(400).json({ success: false, message: "Invalid reset token. Please request a new password reset link." });
        }

        console.log('Found user for token:', user.email);
        console.log('Token expiry:', new Date(user.resetTokenExpiry).toISOString());

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

// REMOVE AVATAR
export async function removeAvatar(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // If user has an avatar, delete the file
        if (user.avatar) {
            const avatarPath = path.join(process.cwd(), user.avatar);
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }
        }

        // Update user to remove avatar
        user.avatar = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Avatar removed successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: null
            }
        });
    } catch (error) {
        console.error('Error removing avatar:', error);
        res.status(500).json({ success: false, message: 'Error removing avatar' });
    }
}