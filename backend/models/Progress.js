const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  completedLessons: [{
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course.lessons'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  progressPercent: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
progressSchema.index({ userId: 1, isCompleted: 1 });
progressSchema.index({ courseId: 1, progressPercent: -1 });

// Pre-save middleware to update progress
progressSchema.pre('save', function(next) {
  const totalLessons = this._courseLessonsCount || 0;
  const completedCount = this.completedLessons.length;
  
  this.progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  this.isCompleted = this.progressPercent === 100;
  this.updatedAt = new Date();
  
  next();
});

// Static method to get user's learning dashboard
progressSchema.statics.getUserDashboard = function(userId) {
  return this.aggregate([
    { $match: { userId: userId } },
    {
      $lookup: {
        from: 'courses',
        localField: 'courseId',
        foreignField: '_id',
        as: 'course'
      }
    },
    { $unwind: '$course' },
    {
      $group: {
        _id: null,
        totalCourses: { $sum: 1 },
        totalCompleted: { 
          $sum: { $cond: ['$isCompleted', 1, 0] } 
        },
        totalInProgress: { 
          $sum: { $cond: [{ $and: [{ $ne: ['$isCompleted', true] }, { $gt: ['$progressPercent', 0] }] }, 1, 0] } 
        },
        averageProgress: { $avg: '$progressPercent' },
        courses: {
          $push: {
            courseId: '$courseId',
            title: '$course.title',
            category: '$course.category',
            difficulty: '$course.difficulty',
            progressPercent: '$progressPercent',
            isCompleted: '$isCompleted',
            lastAccessed: '$lastAccessed',
            skillsCovered: '$course.skillsCovered'
          }
        }
      }
    }
  ]);
};

// Static method to get user's completed courses
progressSchema.statics.getUserCompletedCourses = function(userId) {
  return this.find({
    userId: userId,
    isCompleted: true
  })
  .populate('courseId', 'title category difficulty skillsCovered')
  .sort({ updatedAt: -1 });
};

// Instance method to mark lesson as completed
progressSchema.methods.markLessonCompleted = function(lessonId, score = null) {
  const existingCompletion = this.completedLessons.find(
    completion => completion.lessonId.toString() === lessonId.toString()
  );
  
  if (!existingCompletion) {
    this.completedLessons.push({
      lessonId: lessonId,
      score: score
    });
  }
  
  this.lastAccessed = new Date();
  return this.save();
};

// Instance method to update lesson score
progressSchema.methods.updateLessonScore = function(lessonId, score) {
  const completion = this.completedLessons.find(
    completion => completion.lessonId.toString() === lessonId.toString()
  );
  
  if (completion) {
    completion.score = score;
    completion.completedAt = new Date();
    this.lastAccessed = new Date();
    return this.save();
  }
  
  return Promise.reject(new Error('Lesson not found in completed lessons'));
};

module.exports = mongoose.model('Progress', progressSchema);