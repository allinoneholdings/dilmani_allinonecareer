import React, { useState, useEffect } from 'react';
import { FaUpload, FaPlus, FaTrash, FaUser, FaEnvelope, FaBriefcase, FaGraduationCap, FaFilePdf, FaPaperPlane } from 'react-icons/fa';

const JobApplicationForm = () => {
  const [applicantId, setApplicantId] = useState('');
  const [formData, setFormData] = useState({
    jobId: '',
    name: '',
    email: '',
    experience: { years: 0, months: 0 },
    skills: [],
    education: [],
    notes: '',
    resume: null
  });
  const [currentSkill, setCurrentSkill] = useState('');
  const [educationItem, setEducationItem] = useState({
    institution: '',
    degree: '',
    field: '',
    startYear: '',
    endYear: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate a unique applicant ID on component mount
  useEffect(() => {
    const generateId = () => {
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 8);
      return `APP-${timestamp}-${randomStr}`.toUpperCase();
    };
    setApplicantId(generateId());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        [name]: parseInt(value) || 0
      }
    }));
  };

  const handleSkillAdd = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleEducationAdd = () => {
    if (educationItem.institution && educationItem.degree) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { ...educationItem }]
      }));
      setEducationItem({
        institution: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: '',
        description: ''
      });
    }
  };

  const handleEducationRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({
        ...prev,
        resume: file
      }));
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create FormData object to send file and form data
      const submitData = new FormData();
      submitData.append('applicantId', applicantId);
      submitData.append('jobId', formData.jobId);
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('experience', JSON.stringify(formData.experience));
      submitData.append('skills', JSON.stringify(formData.skills));
      submitData.append('education', JSON.stringify(formData.education));
      submitData.append('notes', formData.notes);
      
      if (formData.resume) {
        submitData.append('resume', formData.resume);
      }

      // Simulate API call
      console.log('Submitting application:', {
        applicantId,
        ...formData,
        resume: formData.resume ? formData.resume.name : 'No file'
      });

      // In a real application, you would send this to your backend:
      // const response = await fetch('/api/applications', {
      //   method: 'POST',
      //   body: submitData
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Application submitted successfully!');
      
      // Reset form
      setFormData({
        jobId: '',
        name: '',
        email: '',
        experience: { years: 0, months: 0 },
        skills: [],
        education: [],
        notes: '',
        resume: null
      });
      
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Job Application Form</h1>
          <p className="opacity-90">Apply for your dream job with our quick and easy application process</p>
          <div className="mt-4 bg-amber-400 text-gray-900 inline-block px-4 py-2 rounded-full font-semibold">
            Applicant ID: {applicantId}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Personal Information Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
              <FaUser className="mr-2" /> Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaEnvelope className="mr-1" /> Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job ID *</label>
              <input
                type="text"
                name="jobId"
                value={formData.jobId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
                placeholder="Enter the Job ID you're applying for"
              />
            </div>
          </div>

          {/* Experience Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
              <FaBriefcase className="mr-2" /> Work Experience
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years</label>
                <input
                  type="number"
                  name="years"
                  value={formData.experience.years}
                  onChange={handleExperienceChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Months</label>
                <input
                  type="number"
                  name="months"
                  value={formData.experience.months}
                  onChange={handleExperienceChange}
                  min="0"
                  max="11"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Skills</h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleSkillRemove(skill)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={12} />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex">
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleSkillAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          {/* Education Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
              <FaGraduationCap className="mr-2" /> Education
            </h2>
            
            {formData.education.map((edu, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
                <button
                  type="button"
                  onClick={() => handleEducationRemove(index)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
                <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                <p className="text-gray-600">{edu.institution} ({edu.startYear} - {edu.endYear})</p>
                {edu.description && <p className="mt-2 text-sm">{edu.description}</p>}
              </div>
            ))}
            
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                  <input
                    type="text"
                    value={educationItem.institution}
                    onChange={(e) => setEducationItem({...educationItem, institution: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={educationItem.degree}
                    onChange={(e) => setEducationItem({...educationItem, degree: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={educationItem.field}
                    onChange={(e) => setEducationItem({...educationItem, field: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
                    <input
                      type="number"
                      value={educationItem.startYear}
                      onChange={(e) => setEducationItem({...educationItem, startYear: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
                    <input
                      type="number"
                      value={educationItem.endYear}
                      onChange={(e) => setEducationItem({...educationItem, endYear: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={educationItem.description}
                  onChange={(e) => setEducationItem({...educationItem, description: e.target.value})}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                ></textarea>
              </div>
              
              <button
                type="button"
                onClick={handleEducationAdd}
                className="flex items-center justify-center w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus className="mr-2" /> Add Education
              </button>
            </div>
          </div>

          {/* Resume Upload Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
              <FaFilePdf className="mr-2" /> Resume Upload
            </h2>
            
            <div className="border-2 border-dashed border-blue-400 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="file"
                id="resume-upload"
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <FaUpload className="text-blue-500 text-4xl mx-auto mb-3" />
                <p className="text-gray-700 font-medium">Click to upload your resume</p>
                <p className="text-gray-500 text-sm mt-1">PDF format only (Max. 5MB)</p>
                {formData.resume && (
                  <p className="text-green-600 font-medium mt-2">
                    <FaFilePdf className="inline mr-1" /> {formData.resume.name}
                  </p>
                )}
              </label>
            </div>
          </div>

          {/* Notes Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Additional Notes</h2>
            
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any additional information you'd like to share with the hiring team..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            ></textarea>
          </div>

          {/* Submit Section */}
          <div className="p-6 bg-gray-50">
            <button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.email || !formData.jobId}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <FaPaperPlane className="mr-2" /> Submit Application
                </>
              )}
            </button>
            
            <p className="text-center text-gray-500 text-sm mt-4">
              Your Applicant ID: <span className="font-mono font-semibold">{applicantId}</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationForm;