const express = require('express');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const { authenticate } = require('../middleware/auth');
const { validateCourse, validateProgress } = require('../middleware/validation');

const router = express.Router();

// GET /api/courses
router.get('/', authenticate, async (req, res) => {
  try {
    const { 
      category, 
      difficulty, 
      skills, 
      limit = 10, 
      skip = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
      query.skillsCovered = { $in: skillsArray };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const courses = await Course.find(query)
      .sort(sortOptions)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    // Get progress for each course
    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const progress = await course.getUserProgress(req.user._id);
        return {
          ...course.toObject(),
          progress
        };
      })
    );

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      data: {
        courses: coursesWithProgress,
        total,
        hasMore: skip + limit < total
      }
    });

  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/courses/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const progress = await course.getUserProgress(req.user._id);

    res.json({
      success: true,
      data: {
        course: {
          ...course.toObject(),
          progress
        }
      }
    });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/courses
router.post('/', authenticate, validateCourse, async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      createdBy: req.user._id
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: {
        course
      }
    });

  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/courses/:id/progress
router.get('/:id/progress', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const progress = await course.getUserProgress(req.user._id);

    res.json({
      success: true,
      data: {
        progress
      }
    });

  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/courses/:id/progress
router.post('/:id/progress', authenticate, validateProgress, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const { completedLessons } = req.body;

    // Get or create progress record
    let progress = await Progress.findOne({
      userId: req.user._id,
      courseId: course._id
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user._id,
        courseId: course._id,
        _courseLessonsCount: course.lessons.length
      });
    }

    // Mark lessons as completed
    if (completedLessons && completedLessons.length > 0) {
      for (const lesson of completedLessons) {
        await progress.markLessonCompleted(lesson.lessonId, lesson.score);
      }
    }

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        progress: await course.getUserProgress(req.user._id)
      }
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/courses/:id/lessons/:lessonId/complete
router.post('/:id/lessons/:lessonId/complete', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if lesson exists
    const lesson = course.lessons.id(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Get or create progress record
    let progress = await Progress.findOne({
      userId: req.user._id,
      courseId: course._id
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user._id,
        courseId: course._id,
        _courseLessonsCount: course.lessons.length
      });
    }

    // Mark lesson as completed
    const score = req.body.score || null;
    await progress.markLessonCompleted(req.params.lessonId, score);

    res.json({
      success: true,
      message: 'Lesson completed successfully',
      data: {
        progress: await course.getUserProgress(req.user._id)
      }
    });

  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/courses/:id/lessons/:lessonId/progress
router.get('/:id/lessons/:lessonId/progress', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const progress = await course.getUserProgress(req.user._id);
    const isCompleted = progress.completedLessons.some(
      lesson => lesson.lessonId.toString() === req.params.lessonId
    );

    res.json({
      success: true,
      data: {
        isCompleted,
        completedAt: progress.completedLessons.find(
          lesson => lesson.lessonId.toString() === req.params.lessonId
        )?.completedAt
      }
    });

  } catch (error) {
    console.error('Get lesson progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/courses/dashboard
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const dashboard = await Progress.getUserDashboard(req.user._id);
    const completedCourses = await Progress.getUserCompletedCourses(req.user._id);

    res.json({
      success: true,
      data: {
        dashboard: dashboard[0] || {
          totalCourses: 0,
          totalCompleted: 0,
          totalInProgress: 0,
          averageProgress: 0,
          courses: []
        },
        completedCourses
      }
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/courses/recommended
router.get('/recommended', authenticate, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    // Get user's skills
    const userSkills = req.user.skills || [];
    
    // Get courses based on user skills
    const courses = await Course.findBySkills(userSkills, {
      limit: parseInt(limit)
    });

    // Get progress for each course
    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const progress = await course.getUserProgress(req.user._id);
        return {
          ...course.toObject(),
          progress
        };
      })
    );

    res.json({
      success: true,
      data: {
        courses: coursesWithProgress
      }
    });

  } catch (error) {
    console.error('Get recommended courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;