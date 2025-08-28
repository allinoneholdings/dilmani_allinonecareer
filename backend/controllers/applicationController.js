const Application = require('../models/Application');
const Job = require('../models/Job');

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
    
    const application = await Application.create({
      jobId,
      applicantId: req.user._id,
      experience,
      skills,
      notes,
      education,
      email: req.user.email,
      name: req.user.name
    });
    
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.user._id })
      .populate('jobId', 'title type salary')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private/Admin
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('jobId', 'title')
      .populate('applicantId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private/Admin
exports.updateApplicationStatus = async (req, res) => {
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
};