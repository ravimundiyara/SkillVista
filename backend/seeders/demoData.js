const mongoose = require('mongoose');
const User = require('../models/User');
const Problem = require('../models/Problem');
const Job = require('../models/Job');
const Course = require('../models/Course');

async function seedDatabase() {
  try {
    console.log('Seeding database with demo data...');

    // Clear existing data
    await User.deleteMany({});
    await Problem.deleteMany({});
    await Job.deleteMany({});
    await Course.deleteMany({});

    // Create demo users
    const users = [
      {
        name: 'John Developer',
        email: 'john@example.com',
        password: 'password123',
        skills: ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS']
      },
      {
        name: 'Jane Designer',
        email: 'jane@example.com',
        password: 'password123',
        skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'HTML', 'CSS', 'JavaScript']
      },
      {
        name: 'Bob Data Analyst',
        email: 'bob@example.com',
        password: 'password123',
        skills: ['Python', 'SQL', 'Data Analysis', 'Machine Learning', 'Excel']
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.name}`);
    }

    // Create demo problems
    const problems = [
      {
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'Easy',
        topic: 'Arrays',
        solution: 'Use a hash map to store values and their indices while iterating through the array.',
        testCases: [
          { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
          { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
          { input: '[3,3], 6', expectedOutput: '[0,1]' }
        ],
        constraints: '2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9'
      },
      {
        title: 'Valid Parentheses',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        difficulty: 'Easy',
        topic: 'Stacks',
        solution: 'Use a stack to track opening brackets and match them with closing brackets.',
        testCases: [
          { input: '()[]{}', expectedOutput: 'true' },
          { input: '([{}])', expectedOutput: 'true' },
          { input: '(]', expectedOutput: 'false' }
        ],
        constraints: '1 <= s.length <= 10^4'
      },
      {
        title: 'Merge Two Sorted Lists',
        description: 'Merge two sorted linked lists and return it as a sorted list.',
        difficulty: 'Medium',
        topic: 'Linked Lists',
        solution: 'Compare nodes from both lists and link them in sorted order.',
        testCases: [
          { input: '[1,2,4], [1,3,4]', expectedOutput: '[1,1,2,3,4,4]' },
          { input: '[], []', expectedOutput: '[]' },
          { input: '[1], []', expectedOutput: '[1]' }
        ]
      },
      {
        title: 'Binary Tree Maximum Path Sum',
        description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them.',
        difficulty: 'Hard',
        topic: 'Trees',
        solution: 'Use post-order traversal to calculate maximum path sum for each node.',
        testCases: [
          { input: '[1,2,3]', expectedOutput: '6' },
          { input: '[-10,9,20,null,null,15,7]', expectedOutput: '42' }
        ]
      }
    ];

    for (const problemData of problems) {
      const problem = new Problem(problemData);
      await problem.save();
      console.log(`Created problem: ${problem.title}`);
    }

    // Create demo jobs
    const jobs = [
      {
        title: 'Frontend Developer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        description: 'We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user-facing features using modern web technologies.',
        requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'TypeScript'],
        salary: { min: 80000, max: 120000, currency: 'USD' },
        type: 'Full-time',
        experienceLevel: 'Mid',
        externalUrl: 'https://techcorp.com/careers/frontend-developer'
      },
      {
        title: 'Backend Developer',
        company: 'Data Systems Inc',
        location: 'New York, NY',
        description: 'Join our backend team to build scalable APIs and services that power our applications.',
        requiredSkills: ['Node.js', 'Python', 'Database Design', 'API Development', 'AWS'],
        salary: { min: 90000, max: 140000, currency: 'USD' },
        type: 'Full-time',
        experienceLevel: 'Senior',
        externalUrl: 'https://datasystems.com/careers/backend-developer'
      },
      {
        title: 'UI/UX Designer',
        company: 'Creative Agency',
        location: 'Los Angeles, CA',
        description: 'Create beautiful and intuitive user experiences for our clients. Work on web and mobile applications.',
        requiredSkills: ['UI/UX Design', 'Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        salary: { min: 60000, max: 90000, currency: 'USD' },
        type: 'Contract',
        experienceLevel: 'Mid',
        externalUrl: 'https://creativeagency.com/careers/ui-ux-designer'
      },
      {
        title: 'Data Scientist',
        company: 'Analytics Pro',
        location: 'Remote',
        description: 'Analyze complex datasets to extract insights and build predictive models.',
        requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization'],
        salary: { min: 100000, max: 150000, currency: 'USD' },
        type: 'Full-time',
        experienceLevel: 'Senior',
        externalUrl: 'https://analyticspro.com/careers/data-scientist'
      }
    ];

    for (const jobData of jobs) {
      const job = new Job(jobData);
      await job.save();
      console.log(`Created job: ${job.title} at ${job.company}`);
    }

    // Create demo courses
    const courses = [
      {
        category: 'Web Development',
        title: 'Complete JavaScript Course',
        description: 'Master JavaScript from basics to advanced concepts including ES6+, async programming, and modern frameworks.',
        skillsCovered: ['JavaScript', 'ES6+', 'Async Programming', 'DOM Manipulation'],
        difficulty: 'Beginner',
        estimatedDuration: 40,
        lessons: [
          {
            title: 'JavaScript Basics',
            description: 'Learn the fundamentals of JavaScript programming.',
            videoUrl: 'https://www.youtube.com/watch?v=hdI2bqA1PbI',
            duration: 60,
            order: 1
          },
          {
            title: 'Functions and Scope',
            description: 'Understand functions, closures, and scope in JavaScript.',
            videoUrl: 'https://www.youtube.com/watch?v=H4awPsyugS0',
            duration: 45,
            order: 2
          },
          {
            title: 'Async JavaScript',
            description: 'Learn about promises, async/await, and handling asynchronous operations.',
            videoUrl: 'https://www.youtube.com/watch?v=PoRJizFvM7s',
            duration: 50,
            order: 3
          }
        ],
        thumbnail: 'https://example.com/js-course-thumb.jpg'
      },
      {
        category: 'Web Development',
        title: 'React - The Complete Guide',
        description: 'Learn React.js from scratch and build modern, reactive user interfaces.',
        skillsCovered: ['React', 'Hooks', 'State Management', 'Component Architecture'],
        difficulty: 'Intermediate',
        estimatedDuration: 60,
        lessons: [
          {
            title: 'React Fundamentals',
            description: 'Get started with React components and JSX.',
            videoUrl: 'https://www.youtube.com/watch?v=DLX62G4lc44',
            duration: 90,
            order: 1
          },
          {
            title: 'State and Props',
            description: 'Master state management and component communication.',
            videoUrl: 'https://www.youtube.com/watch?v=O6P86uwfdR0',
            duration: 60,
            order: 2
          },
          {
            title: 'React Hooks',
            description: 'Learn modern React with hooks like useState and useEffect.',
            videoUrl: 'https://www.youtube.com/watch?v=LlvBzyy-558',
            duration: 75,
            order: 3
          }
        ]
      },
      {
        category: 'Data Science',
        title: 'Python for Data Analysis',
        description: 'Learn Python programming for data analysis and visualization.',
        skillsCovered: ['Python', 'Pandas', 'NumPy', 'Data Visualization', 'Matplotlib'],
        difficulty: 'Beginner',
        estimatedDuration: 50,
        lessons: [
          {
            title: 'Python Basics for Data Science',
            description: 'Python fundamentals tailored for data analysis.',
            videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
            duration: 80,
            order: 1
          },
          {
            title: 'Working with Pandas',
            description: 'Master data manipulation with Pandas library.',
            videoUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg',
            duration: 70,
            order: 2
          },
          {
            title: 'Data Visualization',
            description: 'Create beautiful visualizations with Matplotlib and Seaborn.',
            videoUrl: 'https://www.youtube.com/watch?v=GZfZv1eVT2Q',
            duration: 60,
            order: 3
          }
        ]
      }
    ];

    for (const courseData of courses) {
      const course = new Course(courseData);
      await course.save();
      console.log(`Created course: ${course.title}`);
    }

    console.log('Database seeding completed successfully!');
    console.log(`Created ${createdUsers.length} users, ${problems.length} problems, ${jobs.length} jobs, and ${courses.length} courses.`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillvista')
    .then(() => seedDatabase())
    .catch(err => console.error('Database connection error:', err));
}

module.exports = seedDatabase;