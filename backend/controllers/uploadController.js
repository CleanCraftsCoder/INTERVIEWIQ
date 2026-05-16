const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const isPdfMime = file.mimetype === 'application/pdf';
  const isPdfExt = path.extname(file.originalname).toLowerCase() === '.pdf';

  if (isPdfMime || isPdfExt) {
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
    const parser = new PDFParse(new Uint8Array(dataBuffer));
    const resumeResult = await parser.getText();
    await parser.destroy();

    const resumeText = typeof resumeResult === 'object' ? resumeResult.text : resumeResult;
    const pageCount = typeof resumeResult === 'object' ? resumeResult.total ?? resumeResult.pages?.length ?? 0 : 0;

    // Save resume URL to user profile
    await User.findByIdAndUpdate(req.user._id, {
      'profile.resume': req.file.filename
    });

    res.json({
      message: 'Resume uploaded successfully',
      fileName: req.file.filename,
      text: resumeText,
      pages: pageCount
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    const message = error.message?.includes('Only PDF files')
      ? error.message
      : error.message?.toLowerCase().includes('invalid pdf') || error.message?.toLowerCase().includes('unexpected')
      ? 'Error parsing PDF file. Please upload a valid, non-corrupted PDF.'
      : 'Error processing resume. Please upload a valid PDF file.';
    const status = error.message?.includes('Only PDF files') ? 400 : 500;
    res.status(status).json({ message });
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
    const parser = new PDFParse(new Uint8Array(dataBuffer));
    const resumeResult = await parser.getText();
    await parser.destroy();

    const resumeText = typeof resumeResult === 'object' ? resumeResult.text : resumeResult;
    const pageCount = typeof resumeResult === 'object' ? resumeResult.total ?? resumeResult.pages?.length ?? 0 : 0;

    res.json({
      text: resumeText,
      pages: pageCount
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