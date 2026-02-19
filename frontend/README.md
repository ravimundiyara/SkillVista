# SkillVista Frontend

Frontend JavaScript files for the SkillVista full-stack web application.

## 📁 Files Structure

```
frontend/
├── api.js              # API client and utilities
├── auth.js             # Authentication management
├── practice.js         # Practice Arena functionality
├── jobs.js             # Job Vacancies functionality
├── skill-analysis.js   # Skill Analysis functionality
├── courses.js          # Learning Courses functionality
├── dashboard.js        # Dashboard functionality
└── README.md           # This file
```

## 🚀 Features

### API Client (`api.js`)
- **REST API Integration**: Complete API client for all backend endpoints
- **Authentication**: JWT token management and automatic header injection
- **Error Handling**: Consistent error handling across all API calls
- **Response Processing**: Unified response format handling

### Authentication (`auth.js`)
- **Token Management**: JWT token storage and validation
- **User State**: Current user tracking and session management
- **Modal System**: Login/registration modal with form validation
- **Protected Routes**: Authentication checks for protected pages
- **Auto Verification**: Automatic token verification on page load

### Practice Arena (`practice.js`)
- **Problem Listing**: Fetch and display coding problems
- **Problem Details**: View individual problem descriptions and constraints
- **Code Submission**: Submit solutions with language selection
- **Attempt Tracking**: View submission history and results
- **Progress Display**: Show best attempts and performance metrics

### Job Vacancies (`jobs.js`)
- **Job Search**: Filter and search job listings
- **Job Details**: View detailed job information with skill matching
- **Application Management**: Save jobs and track applications
- **Skill Matching**: Calculate and display skill match percentages
- **External Integration**: Support for external job board links

### Skill Analysis (`skill-analysis.js`)
- **Role Analysis**: Analyze skills against target job roles
- **Skill Gap Detection**: Identify missing skills and provide recommendations
- **Job Comparison**: Compare skills across multiple job postings
- **Learning Paths**: Generate personalized learning recommendations

### Learning Courses (`courses.js`)
- **Course Catalog**: Browse available learning courses
- **Progress Tracking**: Track course completion and lesson progress
- **Video Integration**: YouTube video lesson support
- **Dashboard Integration**: Learning progress dashboard
- **Personalized Recommendations**: Skill-based course suggestions

### Dashboard (`dashboard.js`)
- **Statistics Overview**: Practice, job, and learning statistics
- **Recent Activity**: Timeline of user activities
- **Quick Actions**: Fast access to key features
- **Progress Visualization**: Charts and progress bars

## 🔧 Usage

### Basic API Usage

```javascript
// Import the API client (automatically available as global)
// All API functions are available through the `api` object

// Authentication
const loginResponse = await api.auth.login({
  email: 'user@example.com',
  password: 'password123'
});

// Store token
tokenManager.setToken(loginResponse.data.token);

// Make authenticated requests
const userStats = await api.user.getStats(userId);
const problems = await api.practice.getProblems({ difficulty: 'Easy' });
```

### Authentication Management

```javascript
// Check if user is authenticated
if (tokenManager.isAuthenticated()) {
  // User is logged in
  const user = await api.auth.verifyToken();
} else {
  // Show login modal
  showAuthModal('login');
}

// Logout
await api.auth.logout();
tokenManager.removeToken();
```

### Practice Arena

```javascript
// Get problems
const problems = await api.practice.getProblems({
  difficulty: 'Medium',
  topic: 'Arrays',
  limit: 10
});

// Submit solution
const result = await api.practice.submitSolution(
  problemId,
  code,
  'javascript'
);
```

### Job Management

```javascript
// Get jobs with filters
const jobs = await api.jobs.getJobs({
  type: 'Full-time',
  location: 'Remote',
  skills: 'JavaScript'
});

// Save a job
await api.jobs.saveJob(jobId);

// Apply to job
await api.jobs.applyToJob(jobId, 'Additional notes');
```

### Skill Analysis

```javascript
// Analyze skills for a role
const analysis = await api.skillAnalysis.analyzeSkills(
  'Frontend Developer',
  ['JavaScript', 'HTML', 'CSS']
);

// Compare with jobs
const comparison = await api.skillAnalysis.compareWithJobs([
  'jobId1', 'jobId2', 'jobId3'
]);
```

### Course Management

```javascript
// Get courses
const courses = await api.courses.getCourses({
  category: 'Web Development',
  difficulty: 'Beginner'
});

// Complete a lesson
await api.courses.completeLesson(courseId, lessonId);

// Get dashboard
const dashboard = await api.courses.getLearningDashboard();
```

## 🎯 Integration with Backend

The frontend is designed to work seamlessly with the SkillVista backend API:

- **Base URL**: `http://localhost:5000/api` (configurable)
- **Authentication**: JWT tokens stored in localStorage
- **CORS**: Backend configured to allow frontend requests
- **Error Handling**: Consistent error format across all endpoints

## 📱 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **ES6+ Features**: Uses modern JavaScript features
- **Fetch API**: Native browser API for HTTP requests
- **LocalStorage**: For token and user data persistence

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Client-side validation before API calls
- **Error Handling**: Graceful error handling without exposing sensitive data
- **Token Expiry**: Automatic handling of expired tokens

## 🚀 Performance Optimizations

- **Debounced Search**: Prevents excessive API calls during typing
- **Lazy Loading**: Load data only when needed
- **Caching**: Smart caching for frequently accessed data
- **Progressive Loading**: Load content incrementally

## 🎨 UI/UX Features

- **Loading States**: Visual feedback during API calls
- **Error Messages**: User-friendly error messages
- **Success Feedback**: Confirmation messages for successful actions
- **Responsive Design**: Works on desktop and mobile devices

## 🔄 Development Workflow

1. **API Integration**: All API calls go through the centralized API client
2. **State Management**: Global state managed through module variables
3. **Event Handling**: DOM events handled with modern event listeners
4. **Error Handling**: Consistent error handling across all modules

## 📚 Dependencies

The frontend uses only native browser APIs:
- **Fetch API**: For HTTP requests
- **LocalStorage API**: For data persistence
- **DOM APIs**: For DOM manipulation
- **Modern JavaScript**: ES6+ features

No external frameworks or libraries required!

## 🧪 Testing

To test the frontend:

1. Start the backend server: `npm run dev` (in backend directory)
2. Serve the frontend files (using any static file server)
3. Open `index.html` in your browser
4. Use the demo credentials:
   - Email: `john@example.com`
   - Password: `password123`

## 🚀 Deployment

For production deployment:

1. **Backend**: Deploy to your preferred hosting (Heroku, AWS, etc.)
2. **Frontend**: Serve static files through CDN or web server
3. **Environment**: Update API base URL in `api.js`
4. **Security**: Configure CORS and security headers

## 🤝 Contributing

1. Follow the existing code patterns
2. Maintain consistent error handling
3. Add JSDoc comments for new functions
4. Test thoroughly with the backend API

## 📄 License

This frontend code is part of the SkillVista project licensed under MIT License.