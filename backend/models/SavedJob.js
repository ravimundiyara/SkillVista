const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required']
  },
  matchPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isApplied: {
    type: Boolean,
    default: false
  },
  appliedAt: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });
savedJobSchema.index({ userId: 1, isApplied: 1 });
savedJobSchema.index({ userId: 1, createdAt: -1 });

// Static method to get user's saved jobs with match percentages
savedJobSchema.statics.getUserSavedJobs = function(userId, options = {}) {
  const { includeApplied = true, sortBy = 'createdAt', sortOrder = -1 } = options;
  
  const matchStage = {
    $match: {
      userId: userId,
      ...(includeApplied ? {} : { isApplied: false })
    }
  };

  const sortStage = {
    $sort: { [sortBy]: sortOrder }
  };

  return this.aggregate([
    matchStage,
    {
      $lookup: {
        from: 'jobs',
        localField: 'jobId',
        foreignField: '_id',
        as: 'job'
      }
    },
    {
      $unwind: '$job'
    },
    {
      $project: {
        _id: 1,
        matchPercentage: 1,
        isApplied: 1,
        appliedAt: 1,
        notes: 1,
        createdAt: 1,
        updatedAt: 1,
        job: {
          _id: '$job._id',
          title: '$job.title',
          company: '$job.company',
          location: '$job.location',
          description: '$job.description',
          requiredSkills: '$job.requiredSkills',
          salary: '$job.salary',
          type: '$job.type',
          experienceLevel: '$job.experienceLevel',
          postedAt: '$job.postedAt',
          isActive: '$job.isActive'
        }
      }
    },
    sortStage
  ]);
};

// Static method to get user's job application statistics
savedJobSchema.statics.getUserJobStats = function(userId) {
  return this.aggregate([
    { $match: { userId: userId } },
    {
      $group: {
        _id: null,
        totalSaved: { $sum: 1 },
        totalApplied: { 
          $sum: { $cond: ['$isApplied', 1, 0] } 
        },
        averageMatchPercentage: { $avg: '$matchPercentage' },
        bestMatch: { $max: '$matchPercentage' }
      }
    }
  ]);
};

module.exports = mongoose.model('SavedJob', savedJobSchema);