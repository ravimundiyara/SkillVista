const express = require('express');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const { validateUserUpdate } = require('../middleware/validation');

const router = express.Router();

// GET /api/users/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    // Users can only access their own profile
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/users/:id
router.put('/:id', authenticate, validateUserUpdate, async (req, res) => {
  try {
    // Users can only update their own profile
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { name, skills } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (skills !== undefined) updates.skills = skills;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /api/users/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Users can only delete their own account
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/users/:id/stats
router.get('/:id/stats', authenticate, async (req, res) => {
  try {
    // Users can only access their own stats
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const Attempt = require('../models/Attempt');
    const SavedJob = require('../models/SavedJob');
    const Progress = require('../models/Progress');

    // Get practice stats
    const practiceStats = await Attempt.getUserStats(req.params.id);
    const practiceData = practiceStats[0] || {
      totalAttempts: 0,
      totalPassed: 0,
      totalFailed: 0,
      averageScore: 0,
      bestScore: 0
    };

    // Get job stats
    const jobStats = await SavedJob.getUserJobStats(req.params.id);
    const jobData = jobStats[0] || {
      totalSaved: 0,
      totalApplied: 0,
      averageMatchPercentage: 0,
      bestMatch: 0
    };

    // Get learning stats
    const learningStats = await Progress.getUserDashboard(req.params.id);
    const learningData = learningStats[0] || {
      totalCourses: 0,
      totalCompleted: 0,
      totalInProgress: 0,
      averageProgress: 0,
      courses: []
    };

    res.json({
      success: true,
      data: {
        practice: practiceData,
        jobs: jobData,
        learning: learningData
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;