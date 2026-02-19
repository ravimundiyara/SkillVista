const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Job title cannot exceed 200 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  salary: {
    min: {
      type: Number,
      min: 0
    },
    max: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      maxlength: 3
    }
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
    default: 'Full-time'
  },
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior', 'Lead', 'Manager'],
    default: 'Entry'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  externalUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days from now
    }
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
jobSchema.index({ isActive: 1, postedAt: -1 });
jobSchema.index({ title: 'text', company: 'text', description: 'text' });
jobSchema.index({ requiredSkills: 1 });
jobSchema.index({ type: 1, experienceLevel: 1 });

// Static method to find jobs by skill match
jobSchema.statics.findBySkillMatch = function(userSkills, limit = 10) {
  return this.find({
    isActive: true,
    requiredSkills: { $in: userSkills }
  })
  .sort({ postedAt: -1 })
  .limit(limit);
};

// Instance method to calculate skill match percentage
jobSchema.methods.calculateSkillMatch = function(userSkills) {
  if (!userSkills || userSkills.length === 0) return 0;
  
  const requiredSkills = this.requiredSkills || [];
  const matchedSkills = requiredSkills.filter(skill => 
    userSkills.some(userSkill => 
      userSkill.toLowerCase() === skill.toLowerCase()
    )
  );
  
  return Math.round((matchedSkills.length / requiredSkills.length) * 100);
};

module.exports = mongoose.model('Job', jobSchema);