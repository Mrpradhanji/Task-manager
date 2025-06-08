import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"]
    },
    googleId: {
        type: String,
        sparse: true
    },
    profilePicture: {
        type: String
    },
    resetToken: String,
    resetTokenExpiry: Date
}, {
    timestamps: true
});

const userModel = mongoose.models.user || mongoose.model("User", userSchema);

export default userModel;