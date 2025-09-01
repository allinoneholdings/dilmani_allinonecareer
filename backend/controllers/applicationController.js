const Application = require('../models/Application');
const Job = require('../models/Job');
//const multer = require('multer');
//const path = require('path');
//const fs = require('fs');
//const { uploadResume } = require('../middlewares/upload');

// Configure multer for file uploads
/*const storage = multer.diskStorage({
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
});*/

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private
exports.applyForJob = async (req, res) => {
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
      applicantId: JSON.parse(applicantId||'{}'),
      experience: JSON.parse(experience || '{}'),
      skills: JSON.parse(skills || '[]'),
      notes,
      education: JSON.parse(education || '[]'),
      email: JSON.parse(email||'{}'),
      name: JSON.parse(name||'{}')
    };
    
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
    res.status(500).json({ message: error.message });
  }
};

// Export the upload middleware
//exports.uploadResume = upload.single('resume');
