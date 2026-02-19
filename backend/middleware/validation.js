const { body, validationResult } = require('express-validator');

// Validation middleware to check for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// User registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('skills')
    .optional()
    .isArray({ min: 0, max: 20 })
    .withMessage('Skills must be an array with maximum 20 items'),
  
  body('skills.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each skill must be between 2 and 50 characters'),
  
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// User update validation
const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('skills')
    .optional()
    .isArray({ min: 0, max: 20 })
    .withMessage('Skills must be an array with maximum 20 items'),
  
  body('skills.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each skill must be between 2 and 50 characters'),
  
  handleValidationErrors
];

// Problem validation
const validateProblem = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('difficulty')
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Difficulty must be Easy, Medium, or Hard'),
  
  body('topic')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Topic must be between 2 and 100 characters'),
  
  body('solution')
    .trim()
    .notEmpty()
    .withMessage('Solution is required'),
  
  body('testCases')
    .isArray({ min: 1 })
    .withMessage('At least one test case is required'),
  
  body('testCases.*.input')
    .notEmpty()
    .withMessage('Test case input is required'),
  
  body('testCases.*.expectedOutput')
    .notEmpty()
    .withMessage('Test case expected output is required'),
  
  body('timeLimit')
    .optional()
    .isInt({ min: 100, max: 10000 })
    .withMessage('Time limit must be between 100ms and 10000ms'),
  
  body('memoryLimit')
    .optional()
    .isInt({ min: 64, max: 1024 })
    .withMessage('Memory limit must be between 64MB and 1024MB'),
  
  handleValidationErrors
];

// Attempt validation
const validateAttempt = [
  body('problemId')
    .isMongoId()
    .withMessage('Invalid problem ID'),
  
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Code submission is required'),
  
  body('language')
    .isIn(['javascript', 'python', 'java', 'c++', 'c'])
    .withMessage('Invalid programming language'),
  
  handleValidationErrors
];

// Job validation
const validateJob = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Job title must be between 5 and 200 characters'),
  
  body('company')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  
  body('location')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('requiredSkills')
    .isArray({ min: 1 })
    .withMessage('At least one required skill is needed'),
  
  body('requiredSkills.*')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each skill must be between 2 and 50 characters'),
  
  body('salary.min')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum salary must be a positive number'),
  
  body('salary.max')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Maximum salary must be a positive number'),
  
  body('salary.currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .isUppercase()
    .withMessage('Currency must be a 3-letter uppercase code'),
  
  body('type')
    .isIn(['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'])
    .withMessage('Invalid job type'),
  
  body('experienceLevel')
    .isIn(['Entry', 'Mid', 'Senior', 'Lead', 'Manager'])
    .withMessage('Invalid experience level'),
  
  body('externalUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL'),
  
  handleValidationErrors
];

// Course validation
const validateCourse = [
  body('category')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category must be between 2 and 100 characters'),
  
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Course title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('skillsCovered')
    .isArray({ min: 1 })
    .withMessage('At least one skill must be covered'),
  
  body('skillsCovered.*')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each skill must be between 2 and 50 characters'),
  
  body('difficulty')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Difficulty must be Beginner, Intermediate, or Advanced'),
  
  body('estimatedDuration')
    .optional()
    .isInt({ min: 1, max: 500 })
    .withMessage('Estimated duration must be between 1 and 500 hours'),
  
  body('lessons')
    .isArray({ min: 1 })
    .withMessage('At least one lesson is required'),
  
  body('lessons.*.title')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Lesson title must be between 2 and 200 characters'),
  
  body('lessons.*.videoUrl')
    .isURL()
    .withMessage('Please provide a valid YouTube URL'),
  
  body('lessons.*.duration')
    .optional()
    .isInt({ min: 1, max: 240 })
    .withMessage('Lesson duration must be between 1 and 240 minutes'),
  
  body('lessons.*.order')
    .isInt({ min: 1 })
    .withMessage('Lesson order must be a positive number'),
  
  handleValidationErrors
];

// Progress validation
const validateProgress = [
  body('courseId')
    .isMongoId()
    .withMessage('Invalid course ID'),
  
  body('completedLessons')
    .optional()
    .isArray()
    .withMessage('Completed lessons must be an array'),
  
  body('completedLessons.*.lessonId')
    .isMongoId()
    .withMessage('Invalid lesson ID'),
  
  body('completedLessons.*.score')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateProblem,
  validateAttempt,
  validateJob,
  validateCourse,
  validateProgress
};