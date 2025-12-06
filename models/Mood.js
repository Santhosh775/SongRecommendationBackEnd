const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Song title is required'],
        trim: true
    },
    artist: {
        type: String,
        required: [true, 'Artist name is required'],
        trim: true
    },
    album: {
        type: String,
        trim: true
    },
    duration: {
        type: String,
        required: [true, 'Duration is required']
    },
    youtubeId: {
        type: String,
        required: [true, 'YouTube ID is required']
    },
    thumbnail: {
        type: String
    },
    plays: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const moodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Mood name is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    emoji: {
        type: String,
        required: [true, 'Emoji is required']
    },
    color: {
        type: String,
        required: [true, 'Color is required'],
        default: '#6366f1'
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    songs: [songSchema],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Add text index for search
moodSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Mood', moodSchema);