const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [200, 'Lesson title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(v);
      },
      message: 'Please provide a valid YouTube URL'
    }
  },
  duration: {
    type: Number, // duration in minutes
    min: 1,
    max: 240
  },
  order: {
    type: Number,
    required: [true, 'Lesson order is required'],
    min: 1
  }
});

const courseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Course category is required'],
    trim: true,
    maxlength: [100, 'Category cannot exceed 100 characters']
  },
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Course title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  skillsCovered: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  estimatedDuration: {
    type: Number, // total duration in hours
    min: 1,
    max: 500
  },
  lessons: [lessonSchema],
  thumbnail: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  },
  isActive: {
    type: Boolean,
    default: true
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
courseSchema.index({ category: 1, difficulty: 1 });
courseSchema.index({ skillsCovered: 1 });
courseSchema.index({ isActive: 1, createdAt: -1 });

// Pre-save middleware to update updatedAt
courseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to find courses by skills
courseSchema.statics.findBySkills = function(skills, options = {}) {
  const { difficulty, limit = 10, skip = 0 } = options;
  
  const query = {
    isActive: true,
    skillsCovered: { $in: skills }
  };
  
  if (difficulty) {
    query.difficulty = difficulty;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Instance method to get course progress for a user
courseSchema.methods.getUserProgress = async function(userId) {
  const Progress = mongoose.model('Progress');
  
  const progress = await Progress.findOne({
    userId: userId,
    courseId: this._id
  });
  
  if (!progress) {
    return {
      courseId: this._id,
      completedLessons: [],
      progressPercent: 0,
      isCompleted: false,
      lastAccessed: null
    };
  }
  
  const totalLessons = this.lessons.length;
  const completedCount = progress.completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  
  return {
    courseId: this._id,
    completedLessons: progress.completedLessons,
    progressPercent: progressPercent,
    isCompleted: progressPercent === 100,
    lastAccessed: progress.updatedAt
  };
};

module.exports = mongoose.model('Course', courseSchema);