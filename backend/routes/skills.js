const express = require('express');
const { protect, admin } = require('../middlewares/auth');

const router = express.Router();

// Predefined skills by category
const skillsByCategory = {
  programming: [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin',
    'TypeScript', 'HTML', 'CSS', 'SQL', 'R', 'Scala', 'Rust', 'Dart'
  ],
  frameworks: [
    'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
    'Laravel', 'Ruby on Rails', 'ASP.NET', 'jQuery', 'Bootstrap', 'Tailwind CSS'
  ],
  databases: [
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQLite', 'Microsoft SQL Server',
    'Firebase', 'Cassandra', 'Elasticsearch'
  ],
  devops: [
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'CI/CD', 'Jenkins', 'Git',
    'Terraform', 'Ansible', 'Linux', 'Nginx', 'Apache'
  ],
  softSkills: [
    'Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Time Management',
    'Adaptability', 'Creativity', 'Work Ethic', 'Critical Thinking', 'Conflict Resolution'
  ]
};

// Get all skills by category
router.get('/', async (req, res) => {
  try {
    res.json(skillsByCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new skill (admin/superadmin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { category, skill } = req.body;
    
    if (!skillsByCategory[category]) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    
    if (skillsByCategory[category].includes(skill)) {
      return res.status(400).json({ message: 'Skill already exists in this category' });
    }
    
    skillsByCategory[category].push(skill);
    res.status(201).json({ message: 'Skill added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;