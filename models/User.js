import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please Enter Username"],
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please enter email"],
            unique: [true, "email is already used"],
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Please enter password"]
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
        updated_at: {
            type: Date,
            default: Date.now,
        },
    },
);

export default mongoose.model('User', UserSchema);