const express = require('express');
const router = express.Router();
const { upload, uploadResume, extractResumeText } = require('../controllers/uploadController');
const auth = require('../middleware/auth');

// Upload resume (protected)
router.post('/resume', auth, upload.single('resume'), uploadResume);

// Extract text from resume (protected)
router.get('/resume/:fileName/text', auth, extractResumeText);

module.exports = router;