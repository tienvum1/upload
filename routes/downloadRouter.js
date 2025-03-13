const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const File = require('../models/File');

// Render files list for download
router.get('/download', async (req, res) => {
  try {
    // Get files from database
    const files = await File.find().sort({ uploadDate: -1 });
    
    res.render('download', { files, error: null });
  } catch (error) {
    console.error('Error reading files:', error);
    res.render('download', { files: [], error: 'Error retrieving files from database' });
  }
});

// Handle file download
router.get('/download/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Find file in database
    const fileRecord = await File.findOne({ filename: filename });
    
    if (!fileRecord) {
      return res.render('download', { 
        files: await File.find().sort({ uploadDate: -1 }), 
        error: 'File not found in database' 
      });
    }
    
    const filePath = path.join(__dirname, '../uploads', filename);
    
    // Check if file exists on disk
    if (!fs.existsSync(filePath)) {
      return res.render('download', { 
        files: await File.find().sort({ uploadDate: -1 }), 
        error: 'File exists in database but not found on disk' 
      });
    }
    
    // Download the file
    res.download(filePath, fileRecord.originalName, (err) => {
      if (err) {
        console.error('Download error:', err);
        return res.status(500).send('Error downloading file');
      }
    });
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router; 