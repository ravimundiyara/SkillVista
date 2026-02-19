const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/skill-analysis/analyze
router.post('/analyze', authenticate, async (req, res) => {
  try {
    const { targetRole, currentSkills } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: 'Target role is required'
      });
    }

    // Get user's current skills
    const userSkills = currentSkills || req.user.skills || [];
    
    // Define skill requirements for common roles
    const roleRequirements = getRoleRequirements(targetRole);
    
    // Analyze skill gaps
    const analysis = analyzeSkills(userSkills, roleRequirements);

    res.json({
      success: true,
      data: {
        targetRole,
        analysis,
        recommendations: generateRecommendations(analysis, targetRole)
      }
    });

  } catch (error) {
    console.error('Skill analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/skill-analysis/roles
router.get('/roles', authenticate, (req, res) => {
  try {
    const roles = getAvailableRoles();
    
    res.json({
      success: true,
      data: {
        roles
      }
    });

  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/skill-analysis/compare
router.post('/compare', authenticate, async (req, res) => {
  try {
    const { jobIds } = req.body;

    if (!jobIds || !Array.isArray(jobIds)) {
      return res.status(400).json({
        success: false,
        message: 'Job IDs array is required'
      });
    }

    const Job = require('../models/Job');
    const jobs = await Job.find({ _id: { $in: jobIds }, isActive: true });
    
    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active jobs found'
      });
    }

    const userSkills = req.user.skills || [];
    
    const comparisons = jobs.map(job => {
      const matchPercentage = job.calculateSkillMatch(userSkills);
      const gaps = findSkillGaps(userSkills, job.requiredSkills);
      
      return {
        jobId: job._id,
        title: job.title,
        company: job.company,
        matchPercentage,
        gaps,
        requiredSkills: job.requiredSkills
      };
    });

    res.json({
      success: true,
      data: {
        comparisons,
        userSkills
      }
    });

  } catch (error) {
    console.error('Skill comparison error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Helper function to get role requirements
function getRoleRequirements(role) {
  const requirements = {
    'Frontend Developer': [
      'HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'TypeScript',
      'Responsive Design', 'CSS Frameworks', 'Build Tools', 'Version Control'
    ],
    'Backend Developer': [
      'Node.js', 'Python', 'Java', 'Database Design', 'API Development',
      'Authentication', 'Security', 'Cloud Services', 'Testing', 'Version Control'
    ],
    'Full Stack Developer': [
      'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Database Design',
      'API Development', 'Authentication', 'Testing', 'Version Control'
    ],
    'Data Scientist': [
      'Python', 'Statistics', 'Machine Learning', 'Data Analysis', 'SQL',
      'Data Visualization', 'Mathematics', 'Big Data', 'Communication'
    ],
    'DevOps Engineer': [
      'Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Cloud Platforms',
      'Monitoring', 'Scripting', 'Infrastructure as Code', 'Security'
    ],
    'Mobile Developer': [
      'iOS Development', 'Android Development', 'React Native', 'Flutter',
      'Mobile UI/UX', 'API Integration', 'Testing', 'App Store Deployment'
    ],
    'UI/UX Designer': [
      'User Research', 'Wireframing', 'Prototyping', 'Design Tools',
      'User Testing', 'Visual Design', 'Interaction Design', 'Communication'
    ]
  };

  return requirements[role] || requirements['Full Stack Developer'];
}

// Helper function to analyze skills
function analyzeSkills(userSkills, roleRequirements) {
  const userSkillSet = new Set(userSkills.map(skill => skill.toLowerCase()));
  const requiredSkillSet = new Set(roleRequirements.map(skill => skill.toLowerCase()));
  
  const matchedSkills = [];
  const missingSkills = [];
  
  // Find matched skills
  roleRequirements.forEach(skill => {
    if (userSkillSet.has(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const matchPercentage = Math.round((matchedSkills.length / roleRequirements.length) * 100);

  return {
    totalRequired: roleRequirements.length,
    matchedCount: matchedSkills.length,
    missingCount: missingSkills.length,
    matchPercentage,
    matchedSkills,
    missingSkills
  };
}

// Helper function to generate recommendations
function generateRecommendations(analysis, targetRole) {
  const recommendations = [];
  
  if (analysis.matchPercentage < 50) {
    recommendations.push({
      priority: 'High',
      category: 'Fundamentals',
      suggestion: `Focus on building core ${targetRole} fundamentals. Consider taking comprehensive courses.`,
      estimatedTime: '3-6 months'
    });
  }
  
  if (analysis.missingCount > 0) {
    recommendations.push({
      priority: 'Medium',
      category: 'Skill Development',
      suggestion: `Work on ${analysis.missingCount} missing skills: ${analysis.missingSkills.slice(0, 3).join(', ')}${analysis.missingSkills.length > 3 ? '...' : ''}`,
      estimatedTime: '1-3 months'
    });
  }
  
  if (analysis.matchPercentage > 70) {
    recommendations.push({
      priority: 'Low',
      category: 'Advanced Topics',
      suggestion: `Consider learning advanced topics and specializations in ${targetRole}.`,
      estimatedTime: 'Ongoing'
    });
  }

  return recommendations;
}

// Helper function to get available roles
function getAvailableRoles() {
  return [
    'Frontend Developer',
    'Backend Developer', 
    'Full Stack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Mobile Developer',
    'UI/UX Designer'
  ];
}

// Helper function to find skill gaps
function findSkillGaps(userSkills, requiredSkills) {
  const userSkillSet = new Set(userSkills.map(skill => skill.toLowerCase()));
  
  return requiredSkills.filter(skill => 
    !userSkillSet.has(skill.toLowerCase())
  );
}

module.exports = router;