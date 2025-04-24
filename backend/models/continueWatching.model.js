import mongoose from "mongoose";

const continueWatchingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
        index: true,
    },
    mediaId: {
        type: Number, // ID from TMDB
        required: true,
        index: true,
    },
    mediaType: {
        type: String, // 'movie' or 'tv'
        enum: ['movie', 'tv'],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    backdropPath:{
        type:String,
    },
    posterPath: {
        type: String,
    },
    currentSeason: {
        type: Number,
        min: 1,
        default: 1,
        required: function() { return this.mediaType === 'tv'; }
    },
    currentEpisode: {
        type: Number,
        min: 1,
        default: 1,
        required: function() { return this.mediaType === 'tv'; }
    },
    currentTime: {
        type: Number, // Current playback time in seconds
        default: 0,
        min: 0,
    },
    totalDuration: {
        type: Number, // Total duration in seconds (can be null or updated later)
        min: 0,
    },
    lastWatchedAt: {
        type: Date,
        default: Date.now,
    },
},{
    timestamps: true, // This automatically adds createdAt and updatedAt
    unique: ['profileId', 'mediaId', 'mediaType']
});

export const continueWatching = mongoose.model("continueWatching", continueWatchingSchema);