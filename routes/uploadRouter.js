const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const File = require('../models/File');

// Ensure uploads directory exists
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('Created uploads directory');
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    // Use original filename with timestamp to avoid duplicates
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.originalname.split('.')[0] + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure upload settings
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Render upload form
router.get('/upload', async (req, res) => {
  try {
    // Get list of files from database
    const files = await File.find().sort({ uploadDate: -1 });
    res.render('upload', { message: null, files });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.render('upload', { message: 'Error fetching files', files: [] });
  }
});

// Handle file upload
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.render('upload', { message: 'Error: No file selected!', files: [] });
  }
  
  try {
    // Save file information to database
    const fileRecord = new File({
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });
    
    await fileRecord.save();
    
    // Get updated list of files from database
    const files = await File.find().sort({ uploadDate: -1 });
    
    res.render('upload', { 
      message: 'File uploaded successfully!', 
      file: req.file,
      files: files
    });
  } catch (error) {
    console.error('Error saving file to database:', error);
    res.render('upload', { 
      message: 'File uploaded but failed to save to database', 
      file: req.file,
      files: []
    });
  }
});

module.exports = router; 