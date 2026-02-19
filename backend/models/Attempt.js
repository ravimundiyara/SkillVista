const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: [true, 'Problem ID is required']
  },
  code: {
    type: String,
    required: [true, 'Code submission is required']
  },
  language: {
    type: String,
    required: [true, 'Programming language is required'],
    enum: ['javascript', 'python', 'java', 'c++', 'c'],
    default: 'javascript'
  },
  result: {
    type: String,
    enum: ['pending', 'passed', 'failed', 'time_limit_exceeded', 'memory_limit_exceeded', 'runtime_error', 'compilation_error'],
    default: 'pending'
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  totalTestCases: {
    type: Number,
    default: 0
  },
  passedTestCases: {
    type: Number,
    default: 0
  },
  executionTime: {
    type: Number, // milliseconds
    min: 0
  },
  memoryUsage: {
    type: Number, // KB
    min: 0
  },
  errorDetails: {
    type: String
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  isBestAttempt: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
attemptSchema.index({ userId: 1, problemId: 1 });
attemptSchema.index({ userId: 1, submittedAt: -1 });
attemptSchema.index({ problemId: 1, result: 1 });

// Static method to get user's best attempt for a problem
attemptSchema.statics.getBestAttempt = function(userId, problemId) {
  return this.findOne({ userId, problemId })
    .sort({ score: -1, executionTime: 1 })
    .limit(1);
};

// Static method to get user's attempt statistics
attemptSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId: userId } },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        totalPassed: { 
          $sum: { $cond: [{ $eq: ['$result', 'passed'] }, 1, 0] } 
        },
        totalFailed: { 
          $sum: { $cond: [{ $in: ['$result', ['failed', 'time_limit_exceeded', 'memory_limit_exceeded', 'runtime_error', 'compilation_error']] }, 1, 0] } 
        },
        averageScore: { $avg: '$score' },
        bestScore: { $max: '$score' }
      }
    }
  ]);
};

module.exports = mongoose.model('Attempt', attemptSchema);