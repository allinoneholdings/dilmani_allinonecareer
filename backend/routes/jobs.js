const express = require('express');
const { protect, admin, superAdmin } = require('../middlewares/auth');
const Job = require('../models/Job');
const Application = require('../models/Application');

const router = express.Router();

// Get all jobs (public)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ is_active: true })
      .populate('posted_by', 'name')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single job (public)
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('posted_by', 'name');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create job (superadmin only)
router.post('/', protect, superAdmin, async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      posted_by: req.user._id
    });
    
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update job (superadmin only)
router.put('/:id', protect, superAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete job (superadmin only)
router.delete('/:id', protect, superAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Also delete all applications for this job
    await Application.deleteMany({ jobId: req.params.id });
    
    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get applications for a job (admin/superadmin)
router.get('/:id/applications', protect, admin, async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.id })
      .populate('applicantId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;