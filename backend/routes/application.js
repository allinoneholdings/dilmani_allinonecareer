const express = require('express');

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

router.post('/:jobId', upload.single('resume'), async (req, res) => {
  try {
    const { jobId } = req.params;
    const { applicantId, experience, skills, notes, education, email, name } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job || !job.is_active) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if applicant already applied
    const existingApplication = await Application.findOne({ jobId, applicantId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Build application data
   const applicationData = {
  jobId,
  applicantId,
  experience: experience ? JSON.parse(experience) : {},
  skills: skills ? JSON.parse(skills) : [],
  education: education ? JSON.parse(education) : [],
  email,
  name,
  notes: notes || ''
};

    if (req.file) {
      applicationData.resume = {
        filename: req.file.filename,
        originalName: req.file.originalname,
          path: `resumes/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype
      };
    }

    const application = await Application.create(applicationData);
    res.status(201).json(application);

  } catch (error) {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB' });
    }
    console.error(error); // log the real error
    res.status(500).json({ message: error.message });
  }
});

// Get user's applications
router.get('/job/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Find all applications for this job
    const applications = await Application.find({ jobId })
      .populate('applicantId', 'name email') // if you store applicant details
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download resume file
router.get('/:id/resume', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    if (!application.resume || !application.resume.path) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    // Fix the file path - prepend 'uploads/' to the stored path
    const filePath = path.join('uploads', application.resume.path);
    const fileName = application.resume.originalName || `resume-${application._id}${path.extname(filePath)}`;
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Resume file not found on server' });
    }
    
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', application.resume.mimetype || 'application/octet-stream');
    
    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Update application status (admin/superadmin)
router.patch('/:id/status', async (req, res) => {
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