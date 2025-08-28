const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  field: String,
  startYear: Number,
  endYear: Number,
  description: String
});

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  experience: {
    years: { type: Number, default: 0 },
    months: { type: Number, default: 0 },
    days: { type: Number, default: 0 }
  },
  skills: [{
    type: String,
    required: true
  }],
  notes: String,
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  education: [educationSchema],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });


module.exports = mongoose.model('Application', applicationSchema);