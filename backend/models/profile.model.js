import mongoose from "mongoose";

const profileSchema = mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    profileName: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export const Profile = mongoose.model("Profile", profileSchema);