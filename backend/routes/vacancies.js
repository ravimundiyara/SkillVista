const express = require('express');
const Job = require('../models/Job');
const SavedJob = require('../models/SavedJob');
const { authenticate } = require('../middleware/auth');
const { validateJob } = require('../middleware/validation');

const router = express.Router();

// GET /api/vacancies/jobs
router.get('/jobs', authenticate, async (req, res) => {
  try {
    const { 
      type, 
      experienceLevel, 
      location, 
      skills, 
      limit = 10, 
      skip = 0,
      sortBy = 'postedAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = { isActive: true };
    
    if (type) {
      query.type = type;
    }
    
    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
      query.requiredSkills = { $in: skillsArray };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const jobs = await Job.find(query)
      .sort(sortOptions)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    // Calculate match percentages for each job
    const jobsWithMatches = await Promise.all(
      jobs.map(async (job) => {
        const matchPercentage = job.calculateSkillMatch(req.user.skills);
        
        // Check if job is saved by user
        const savedJob = await SavedJob.findOne({
          userId: req.user._id,
          jobId: job._id
        });

        return {
          ...job.toObject(),
          matchPercentage,
          isSaved: !!savedJob,
          isApplied: savedJob ? savedJob.isApplied : false,
          savedJobId: savedJob ? savedJob._id : null
        };
      })
    );

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      data: {
        jobs: jobsWithMatches,
        total,
        hasMore: skip + limit < total
      }
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/vacancies/jobs/:id
router.get('/jobs/:id', authenticate, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (!job.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Calculate match percentage
    const matchPercentage = job.calculateSkillMatch(req.user.skills);
    
    // Check if job is saved by user
    const savedJob = await SavedJob.findOne({
      userId: req.user._id,
      jobId: job._id
    });

    res.json({
      success: true,
      data: {
        job: {
          ...job.toObject(),
          matchPercentage,
          isSaved: !!savedJob,
          isApplied: savedJob ? savedJob.isApplied : false,
          savedJobId: savedJob ? savedJob._id : null
        }
      }
    });

  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/vacancies/jobs
router.post('/jobs', authenticate, validateJob, async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      postedBy: req.user._id
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: {
        job
      }
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/vacancies/jobs/:id/save
router.post('/jobs/:id/save', authenticate, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (!job.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Calculate match percentage
    const matchPercentage = job.calculateSkillMatch(req.user.skills);

    // Check if already saved
    let savedJob = await SavedJob.findOne({
      userId: req.user._id,
      jobId: job._id
    });

    if (savedJob) {
      // Update existing saved job
      savedJob.matchPercentage = matchPercentage;
      await savedJob.save();
    } else {
      // Create new saved job
      savedJob = new SavedJob({
        userId: req.user._id,
        jobId: job._id,
        matchPercentage: matchPercentage
      });
      await savedJob.save();
    }

    res.json({
      success: true,
      message: 'Job saved successfully',
      data: {
        savedJobId: savedJob._id,
        matchPercentage: savedJob.matchPercentage
      }
    });

  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /api/vacancies/jobs/:id/save
router.delete('/jobs/:id/save', authenticate, async (req, res) => {
  try {
    const savedJob = await SavedJob.findOneAndDelete({
      userId: req.user._id,
      jobId: req.params.id
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: 'Saved job not found'
      });
    }

    res.json({
      success: true,
      message: 'Job removed from saved list'
    });

  } catch (error) {
    console.error('Remove saved job error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/vacancies/jobs/:id/apply
router.post('/jobs/:id/apply', authenticate, async (req, res) => {
  try {
    const savedJob = await SavedJob.findOne({
      userId: req.user._id,
      jobId: req.params.id
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found in saved list'
      });
    }

    savedJob.isApplied = true;
    savedJob.appliedAt = new Date();
    savedJob.notes = req.body.notes || savedJob.notes;
    
    await savedJob.save();

    res.json({
      success: true,
      message: 'Job application submitted successfully',
      data: {
        appliedAt: savedJob.appliedAt,
        notes: savedJob.notes
      }
    });

  } catch (error) {
    console.error('Apply job error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/vacancies/saved
router.get('/saved', authenticate, async (req, res) => {
  try {
    const { limit = 10, skip = 0, includeApplied = true } = req.query;
    
    const savedJobs = await SavedJob.getUserSavedJobs(req.user._id, {
      includeApplied: includeApplied === 'true',
      sortBy: 'createdAt',
      sortOrder: -1
    });

    const total = await SavedJob.countDocuments({
      userId: req.user._id,
      ...(includeApplied === 'false' ? { isApplied: false } : {})
    });

    res.json({
      success: true,
      data: {
        savedJobs,
        total,
        hasMore: skip + limit < total
      }
    });

  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/vacancies/matches
router.get('/matches', authenticate, async (req, res) => {
  try {
    const { minMatchPercentage = 50, limit = 10, skip = 0 } = req.query;
    
    const jobs = await Job.findBySkillMatch(req.user.skills, {
      limit: parseInt(limit),
      skip: parseInt(skip)
    });

    // Filter by minimum match percentage
    const filteredJobs = jobs.filter(job => {
      const matchPercentage = job.calculateSkillMatch(req.user.skills);
      return matchPercentage >= parseInt(minMatchPercentage);
    });

    // Add match percentages and saved status
    const jobsWithMatches = await Promise.all(
      filteredJobs.map(async (job) => {
        const matchPercentage = job.calculateSkillMatch(req.user.skills);
        
        const savedJob = await SavedJob.findOne({
          userId: req.user._id,
          jobId: job._id
        });

        return {
          ...job.toObject(),
          matchPercentage,
          isSaved: !!savedJob,
          isApplied: savedJob ? savedJob.isApplied : false,
          savedJobId: savedJob ? savedJob._id : null
        };
      })
    );

    res.json({
      success: true,
      data: {
        jobs: jobsWithMatches,
        total: filteredJobs.length,
        hasMore: skip + limit < filteredJobs.length
      }
    });

  } catch (error) {
    console.error('Get skill matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;