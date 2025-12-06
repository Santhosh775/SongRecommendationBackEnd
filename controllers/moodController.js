const Mood = require('../models/Mood');

// Get all moods
exports.getAllMoods = async (req, res) => {
    try {
        const moods = await Mood.find({ isActive: true })
            .select('-__v')
            .sort({ name: 1 });
        
        res.json({
            success: true,
            count: moods.length,
            data: moods
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error: ' + error.message
        });
    }
};

// Get single mood
exports.getMoodById = async (req, res) => {
    try {
        const mood = await Mood.findById(req.params.id)
            .select('-__v');
        
        if (!mood) {
            return res.status(404).json({
                success: false,
                error: 'Mood not found'
            });
        }
        
        res.json({
            success: true,
            data: mood
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error: ' + error.message
        });
    }
};

// Create mood
exports.createMood = async (req, res) => {
    try {
        const mood = new Mood(req.body);
        await mood.save();
        
        res.status(201).json({
            success: true,
            data: mood
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Mood with this name already exists'
            });
        }
        res.status(400).json({
            success: false,
            error: 'Validation Error: ' + error.message
        });
    }
};

// Update mood
exports.updateMood = async (req, res) => {
    try {
        const mood = await Mood.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-__v');
        
        if (!mood) {
            return res.status(404).json({
                success: false,
                error: 'Mood not found'
            });
        }
        
        res.json({
            success: true,
            data: mood
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Update Error: ' + error.message
        });
    }
};

// Delete mood
exports.deleteMood = async (req, res) => {
    try {
        const mood = await Mood.findByIdAndDelete(req.params.id);
        
        if (!mood) {
            return res.status(404).json({
                success: false,
                error: 'Mood not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Mood deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error: ' + error.message
        });
    }
};

// Add song to mood
exports.addSongToMood = async (req, res) => {
    try {
        const mood = await Mood.findById(req.params.id);
        
        if (!mood) {
            return res.status(404).json({
                success: false,
                error: 'Mood not found'
            });
        }
        
        const songData = req.body;
        if (req.file) {
            songData.thumbnail = `/uploads/${req.file.filename}`;
        }
        
        mood.songs.push(songData);
        await mood.save();
        
        res.status(201).json({
            success: true,
            data: mood
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Add Song Error: ' + error.message
        });
    }
};

// Remove song from mood
exports.removeSongFromMood = async (req, res) => {
    try {
        const mood = await Mood.findById(req.params.id);
        
        if (!mood) {
            return res.status(404).json({
                success: false,
                error: 'Mood not found'
            });
        }
        
        mood.songs.id(req.params.songId).deleteOne();
        await mood.save();
        
        res.json({
            success: true,
            data: mood
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Remove Song Error: ' + error.message
        });
    }
};

// Update song in mood
exports.updateSongInMood = async (req, res) => {
    try {
        const mood = await Mood.findById(req.params.id);
        
        if (!mood) {
            return res.status(404).json({
                success: false,
                error: 'Mood not found'
            });
        }
        
        const song = mood.songs.id(req.params.songId);
        if (!song) {
            return res.status(404).json({
                success: false,
                error: 'Song not found'
            });
        }
        
        const updateData = req.body;
        if (req.file) {
            updateData.thumbnail = `/uploads/${req.file.filename}`;
        }
        
        Object.assign(song, updateData);
        await mood.save();
        
        res.json({
            success: true,
            data: mood
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Update Song Error: ' + error.message
        });
    }
};

// Get songs by mood
exports.getSongsByMood = async (req, res) => {
    try {
        const mood = await Mood.findById(req.params.id)
            .select('songs name emoji color');
        
        if (!mood) {
            return res.status(404).json({
                success: false,
                error: 'Mood not found'
            });
        }
        
        res.json({
            success: true,
            data: mood
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error: ' + error.message
        });
    }
};

// Increment play count
exports.incrementPlayCount = async (req, res) => {
    try {
        const mood = await Mood.findById(req.params.id);
        
        if (!mood) {
            return res.status(404).json({
                success: false,
                error: 'Mood not found'
            });
        }
        
        const song = mood.songs.id(req.params.songId);
        if (!song) {
            return res.status(404).json({
                success: false,
                error: 'Song not found'
            });
        }
        
        song.plays += 1;
        await mood.save();
        
        res.json({
            success: true,
            plays: song.plays
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Update Error: ' + error.message
        });
    }
};