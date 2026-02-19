# SkillVista - Full-Stack Web Application

A comprehensive career development and learning platform that helps users improve their skills, find jobs, and track their progress.

## 🎯 Overview

SkillVista is a full-stack web application built with:
- **Frontend**: HTML, CSS, JavaScript (No frameworks)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)

## 🚀 Features

### 🎯 Practice Arena
- **Coding Problems**: Solve problems categorized by difficulty and topic
- **Code Submission**: Submit solutions in multiple programming languages
- **Performance Tracking**: Track attempts, scores, and progress
- **Test Cases**: Automatic testing with detailed feedback

### 💼 Job Vacancies
- **Job Listings**: Browse and search job opportunities
- **Skill Matching**: Automatic skill compatibility analysis
- **Application Tracking**: Save jobs and track applications
- **External Integration**: Links to external job boards

### 📊 Skill Analysis
- **Role Analysis**: Compare skills against target job roles
- **Gap Detection**: Identify missing skills with recommendations
- **Job Comparison**: Analyze multiple job requirements
- **Personalized Paths**: Custom learning recommendations

### 📚 Learning Management
- **Course Catalog**: Structured learning paths with video lessons
- **Progress Tracking**: Monitor course and lesson completion
- **YouTube Integration**: Direct video lesson access
- **Skill-Based Recommendations**: Personalized course suggestions

### 📈 Dashboard & Analytics
- **Progress Overview**: Comprehensive statistics across all features
- **Recent Activity**: Timeline of user accomplishments
- **Quick Actions**: Fast access to key functionality
- **Performance Metrics**: Detailed progress visualization

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Document Mapper)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **JavaScript ES6+** - Modern JavaScript features
- **Fetch API** - HTTP requests
- **LocalStorage** - Client-side storage

## 📁 Project Structure

```
SkillVista/
├── backend/                    # Backend API server
│   ├── models/                 # MongoDB schemas
│   │   ├── User.js            # User management
│   │   ├── Problem.js         # Coding problems
│   │   ├── Attempt.js         # Solution attempts
│   │   ├── Job.js             # Job listings
│   │   ├── SavedJob.js        # Job applications
│   │   ├── Course.js          # Learning courses
│   │   └── Progress.js        # Learning progress
│   ├── routes/                 # API route handlers
│   │   ├── auth.js            # Authentication routes
│   │   ├── users.js           # User management routes
│   │   ├── practice.js        # Practice arena routes
│   │   ├── vacancies.js       # Job vacancy routes
│   │   ├── skillAnalysis.js   # Skill analysis routes
│   │   └── courses.js         # Learning routes
│   ├── middleware/             # Custom middleware
│   │   ├── auth.js            # Authentication middleware
│   │   └── validation.js      # Input validation middleware
│   ├── seeders/                # Database seeding
│   │   └── demoData.js        # Sample data
│   ├── server.js              # Main server file
│   ├── package.json           # Dependencies
│   ├── .env.example           # Environment variables template
│   └── README.md              # Backend documentation
├── frontend/                   # Frontend JavaScript modules
│   ├── api.js                 # API client
│   ├── auth.js                # Authentication management
│   ├── practice.js            # Practice functionality
│   ├── jobs.js                # Job management
│   ├── skill-analysis.js      # Skill analysis
│   ├── courses.js             # Learning management
│   ├── dashboard.js           # Dashboard functionality
│   └── README.md              # Frontend documentation
├── assets/                     # Static assets
│   ├── css/                   # Stylesheets
│   ├── js/                    # Original JavaScript files
│   └── img/                   # Images
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SkillVista
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Frontend Setup**
   - The frontend uses static files and can be served with any web server
   - No build process required

4. **Start the Application**
   ```bash
   # Start backend
   npm run dev
   
   # Serve frontend (using any static file server)
   # Example with Python: python -m http.server 8000
   # Example with Node.js: npx serve -s .
   ```

5. **Access the Application**
   - Frontend: `http://localhost:8000` (or your chosen port)
   - Backend API: `http://localhost:5000/api`
   - Health Check: `http://localhost:5000/api/health`

### Environment Configuration

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillvista
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:8000
```

### Database Seeding

Seed the database with demo data:

```bash
cd backend
node seeders/demoData.js
```

## 🔐 Authentication

The application uses JWT-based authentication:

1. **Registration**: Users can register with email and password
2. **Login**: Users receive a JWT token upon successful login
3. **Protected Routes**: All user-specific endpoints require authentication
4. **Token Storage**: Tokens are stored in localStorage on the frontend

### Demo Credentials
After seeding the database, use these credentials:

- **Email**: `john@example.com`
- **Password**: `password123`

## 📊 Database Models

### User
- Basic user information and authentication
- Skills array for tracking competencies
- Account status and activity tracking

### Problem
- Coding challenges with difficulty levels
- Test cases and expected outputs
- Solution templates and constraints

### Attempt
- User code submissions and results
- Performance metrics (time, memory, score)
- Best attempt tracking per problem

### Job
- Job listings with requirements
- Salary ranges and employment types
- External job board integration

### Course
- Learning content with video lessons
- Progress tracking and completion status
- Skill-based course recommendations

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Token verification
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Deactivate user account
- `GET /api/users/:id/stats` - Get user statistics

### Practice Arena
- `GET /api/practice/problems` - Get coding problems
- `GET /api/practice/problems/:id` - Get specific problem
- `POST /api/practice/problems` - Create new problem
- `POST /api/practice/submit` - Submit code solution
- `GET /api/practice/attempts` - Get user attempts

### Job Vacancies
- `GET /api/vacancies/jobs` - Get job listings
- `GET /api/vacancies/jobs/:id` - Get specific job
- `POST /api/vacancies/jobs` - Post new job
- `POST /api/vacancies/jobs/:id/save` - Save job
- `POST /api/vacancies/jobs/:id/apply` - Apply to job
- `GET /api/vacancies/matches` - Get skill matches

### Skill Analysis
- `POST /api/skill-analysis/analyze` - Analyze skills vs target role
- `GET /api/skill-analysis/roles` - Get available roles
- `POST /api/skill-analysis/compare` - Compare skills with jobs

### Learning
- `GET /api/courses` - Get courses
- `GET /api/courses/:id` - Get specific course
- `POST /api/courses` - Create new course
- `POST /api/courses/:id/progress` - Update course progress
- `GET /api/courses/dashboard` - Get learning dashboard

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Cross-origin resource sharing control
- **Helmet**: Security headers middleware

## 🧪 Testing

The application includes comprehensive error handling and validation:

1. **Input Validation**: All endpoints validate input data
2. **Authentication**: Protected routes require valid JWT tokens
3. **Error Handling**: Consistent error response format
4. **Rate Limiting**: Protection against excessive requests

## 🚀 Deployment

### Production Build
```bash
# Backend
npm run build
npm start

# Frontend
# Serve static files through CDN or web server
```

### Docker Support (Future)
- Dockerfile configuration
- Docker Compose for development
- Production container deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the code examples in the seeders

## 🎉 Future Enhancements

- **Real-time Code Execution**: Integrate with code execution services
- **Advanced Analytics**: More detailed progress tracking
- **Social Features**: User profiles and community features
- **Mobile App**: Native mobile applications
- **AI Integration**: AI-powered skill recommendations
- **Gamification**: Badges, leaderboards, and achievements

---

**Note**: This is a complete full-stack application with both backend API and frontend JavaScript modules. The frontend is designed to work with the backend API and provides a complete user experience for skill development and career advancement.