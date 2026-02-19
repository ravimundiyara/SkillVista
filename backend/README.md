# SkillVista Backend API

A comprehensive full-stack backend API for the SkillVista learning and career development platform.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Practice Arena**: Coding problems with test cases and submission tracking
- **Job Vacancies**: Job listings with skill matching and application tracking
- **Skill Analysis**: Personalized skill gap analysis and recommendations
- **Learning Management**: Course management with progress tracking
- **Database**: MongoDB with Mongoose ODM for data modeling

## 📋 API Endpoints

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

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, cors, rate limiting
- **Validation**: express-validator
- **Development**: nodemon for hot reload

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SkillVista/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Seed the database with demo data**
   ```bash
   node seeders/demoData.js
   ```

### Environment Configuration

Create a `.env` file with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillvista
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

## 📁 Project Structure

```
backend/
├── models/              # MongoDB schemas
│   ├── User.js
│   ├── Problem.js
│   ├── Attempt.js
│   ├── Job.js
│   ├── SavedJob.js
│   ├── Course.js
│   └── Progress.js
├── routes/              # API route handlers
│   ├── auth.js
│   ├── users.js
│   ├── practice.js
│   ├── vacancies.js
│   ├── skillAnalysis.js
│   └── courses.js
├── middleware/          # Custom middleware
│   ├── auth.js
│   └── validation.js
├── seeders/             # Database seeding scripts
│   └── demoData.js
├── server.js            # Main server file
├── package.json
└── README.md
```

## 🔧 Database Models

### User
- Basic user information and authentication
- Skills array for tracking user competencies
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

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Cross-origin resource sharing control
- **Helmet**: Security headers middleware

## 🧪 Testing

To run tests (when available):
```bash
npm test
```

## 📚 API Documentation

The API follows REST principles with consistent response formats:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if applicable)
  ]
}
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Support (Future)
- Dockerfile configuration
- Docker Compose for development
- Production container deployment

## 🔗 Frontend Integration

The frontend should be configured to:
- Make API calls to `http://localhost:5000/api/`
- Handle JWT tokens for authentication
- Display loading states during API calls
- Show appropriate error messages

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

---

**Note**: This is a backend-only API. The frontend application should be developed separately to consume these endpoints.