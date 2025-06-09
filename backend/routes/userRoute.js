import express from 'express';
import {
    registerUser,
    loginUser,
    getCurrentUser,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    googleAuth,
    uploadAvatar,
    removeAvatar
} from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router();

// Public
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/google-auth', googleAuth);

// Protected
userRouter.get('/me', authMiddleware, getCurrentUser);
userRouter.put('/profile', authMiddleware, updateProfile);
userRouter.put('/password', authMiddleware, updatePassword);
userRouter.post('/avatar', authMiddleware, uploadAvatar);
userRouter.delete('/avatar', authMiddleware, removeAvatar);

export default userRouter;