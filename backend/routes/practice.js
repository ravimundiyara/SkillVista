const express = require('express');
const Problem = require('../models/Problem');
const Attempt = require('../models/Attempt');
const { authenticate } = require('../middleware/auth');
const { validateProblem, validateAttempt } = require('../middleware/validation');

const router = express.Router();

// GET /api/practice/problems
router.get('/problems', authenticate, async (req, res) => {
  try {
    const { difficulty, topic, limit = 10, skip = 0 } = req.query;
    
    const query = { isActive: true };
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (topic) {
      query.topic = topic;
    }

    const problems = await Problem.find(query)
      .select('-testCases -solution')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Problem.countDocuments(query);

    res.json({
      success: true,
      data: {
        problems,
        total,
        hasMore: skip + limit < total
      }
    });

  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/practice/problems/:id
router.get('/problems/:id', authenticate, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    if (!problem.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Get user's best attempt for this problem
    const bestAttempt = await Attempt.getBestAttempt(req.user._id, req.params.id);

    res.json({
      success: true,
      data: {
        problem: {
          ...problem.toObject(),
          bestAttempt: bestAttempt || null
        }
      }
    });

  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/practice/problems
router.post('/problems', authenticate, validateProblem, async (req, res) => {
  try {
    const problem = new Problem({
      ...req.body,
      createdBy: req.user._id
    });

    await problem.save();

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      data: {
        problem
      }
    });

  } catch (error) {
    console.error('Create problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/practice/submit
router.post('/submit', authenticate, validateAttempt, async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    // Check if problem exists and is active
    const problem = await Problem.findById(problemId);
    if (!problem || !problem.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Simulate code execution and testing
    // In a real application, you would use a code execution service
    const result = simulateCodeExecution(code, problem.testCases, language);
    
    // Create attempt record
    const attempt = new Attempt({
      userId: req.user._id,
      problemId: problemId,
      code: code,
      language: language,
      result: result.status,
      score: result.score,
      totalTestCases: problem.testCases.length,
      passedTestCases: result.passedTestCases,
      executionTime: result.executionTime,
      memoryUsage: result.memoryUsage,
      errorDetails: result.errorDetails,
      isBestAttempt: false // Will be updated later if it's the best
    });

    await attempt.save();

    // Update best attempt status
    await updateBestAttempt(req.user._id, problemId);

    res.json({
      success: true,
      message: 'Code submitted successfully',
      data: {
        attempt: {
          ...attempt.toObject(),
          problemTitle: problem.title
        }
      }
    });

  } catch (error) {
    console.error('Submit code error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/practice/attempts
router.get('/attempts', authenticate, async (req, res) => {
  try {
    const { problemId, limit = 20, skip = 0 } = req.query;
    
    const query = { userId: req.user._id };
    
    if (problemId) {
      query.problemId = problemId;
    }

    const attempts = await Attempt.find(query)
      .populate('problemId', 'title difficulty topic')
      .sort({ submittedAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Attempt.countDocuments(query);

    res.json({
      success: true,
      data: {
        attempts,
        total,
        hasMore: skip + limit < total
      }
    });

  } catch (error) {
    console.error('Get attempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/practice/attempts/:id
router.get('/attempts/:id', authenticate, async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate('problemId', 'title difficulty topic');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found'
      });
    }

    // Users can only access their own attempts
    if (attempt.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        attempt
      }
    });

  } catch (error) {
    console.error('Get attempt error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Helper function to simulate code execution
function simulateCodeExecution(code, testCases, language) {
  // This is a simplified simulation
  // In a real application, you would use a code execution service like:
  // - Docker containers
  // - AWS Lambda
  // - Google Cloud Functions
  // - Third-party services like Judge0, CodeSandbox, etc.
  
  const passedTestCases = Math.floor(Math.random() * (testCases.length + 1));
  const totalTestCases = testCases.length;
  const score = Math.round((passedTestCases / totalTestCases) * 100);
  const executionTime = Math.floor(Math.random() * 2000) + 100; // 100ms to 2100ms
  const memoryUsage = Math.floor(Math.random() * 200) + 50; // 50KB to 250KB
  
  let status = 'failed';
  if (passedTestCases === totalTestCases) {
    status = 'passed';
  } else if (passedTestCases > 0) {
    status = 'failed';
  }

  return {
    status,
    score,
    passedTestCases,
    totalTestCases,
    executionTime,
    memoryUsage,
    errorDetails: passedTestCases < totalTestCases ? 'Test case failed' : null
  };
}

// Helper function to update best attempt
async function updateBestAttempt(userId, problemId) {
  try {
    const bestAttempt = await Attempt.getBestAttempt(userId, problemId);
    
    if (bestAttempt) {
      // Reset all attempts for this problem to not be the best
      await Attempt.updateMany(
        { userId, problemId, _id: { $ne: bestAttempt._id } },
        { isBestAttempt: false }
      );
      
      // Set the best attempt
      await Attempt.findByIdAndUpdate(bestAttempt._id, { isBestAttempt: true });
    }
  } catch (error) {
    console.error('Update best attempt error:', error);
  }
}

module.exports = router;