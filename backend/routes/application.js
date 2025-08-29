const express = require('express');
const { protect, admin } = require('../middlewares/auth');
const Application = require('../models/Application');
const Job = require('../models/Job');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/resumes';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

const router = express.Router();

// Apply for a job with file upload
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { jobId, experience, skills, notes, education } = req.body;
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job || !job.is_active) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if user already applied
    const existingApplication = await Application.findOne({
      jobId,
      applicantId: req.user._id
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    
    const applicationData = {
      jobId,
      applicantId: JSON.parse(applicantId || '{}'),
      experience: JSON.parse(experience || '{}'),
      skills: JSON.parse(skills || '[]'),
      notes,
      education: JSON.parse(education || '[]'),
      email:JSON.parse(email || '{}'),
      name: JSON.parse(name|| '{}')
    };
    
    // Add resume file info if uploaded
    if (req.file) {
      applicationData.resume = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      };
    }
    
    const application = await Application.create(applicationData);
    
    res.status(201).json(application);
  } catch (error) {
    // Handle multer errors
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 5MB' });
      }
    }
    res.status(500).json({ message: error.message });
  }
});

// Get user's applications
router.get('/my-applications', protect, async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.user._id })
      .populate('jobId', 'title type salary')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all applications (admin/superadmin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('jobId', 'title')
      .populate('applicantId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update application status (admin/superadmin)
router.patch('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('applicantId', 'name email');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;