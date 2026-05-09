const multer = require('multer');
const pdfParse = require('pdf-parse');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Extract text from PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);

    // Save resume URL to user profile
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user._id, {
      'profile.resume': req.file.filename
    });

    res.json({
      message: 'Resume uploaded successfully',
      fileName: req.file.filename,
      text: data.text,
      pages: data.numpages
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ message: 'Error processing resume' });
  }
};

// Extract text from uploaded resume
const extractResumeText = async (req, res) => {
  try {
    const { fileName } = req.params;

    if (!fileName) {
      return res.status(400).json({ message: 'File name is required' });
    }

    const filePath = path.join('uploads', fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    res.json({
      text: data.text,
      pages: data.numpages
    });
  } catch (error) {
    res.status(500).json({ message: 'Error extracting text' });
  }
};

module.exports = {
  upload,
  uploadResume,
  extractResumeText
};