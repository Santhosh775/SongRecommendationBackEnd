const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const upload = require('../config/multer');

// Mood routes
router.get('/', moodController.getAllMoods);
router.get('/:id', moodController.getMoodById);
router.post('/', moodController.createMood);
router.put('/:id', moodController.updateMood);
router.delete('/:id', moodController.deleteMood);

// Song routes within mood
router.get('/:id/songs', moodController.getSongsByMood);
router.post('/:id/songs', upload.single('thumbnail'), moodController.addSongToMood);
router.delete('/:id/songs/:songId', moodController.removeSongFromMood);
router.put('/:id/songs/:songId', upload.single('thumbnail'), moodController.updateSongInMood);
router.put('/:id/songs/:songId/play', moodController.incrementPlayCount);

module.exports = router;