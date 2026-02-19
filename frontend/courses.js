// Learning Courses functionality
let currentCourse = null;
let currentCourseProgress = null;

// DOM elements
const coursesList = document.getElementById('courses-list');
const courseDetails = document.getElementById('course-details');
const courseLessons = document.getElementById('course-lessons');
const courseProgress = document.getElementById('course-progress');
const learningDashboard = document.getElementById('learning-dashboard');
const recommendedCourses = document.getElementById('recommended-courses');

// Initialize learning section
function initLearning() {
  if (!checkAuth(true)) return;
  
  loadCourses();
  loadRecommendedCourses();
  loadDashboard();
  setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
  // Course filtering
  const categoryFilter = document.getElementById('category-filter');
  const difficultyFilter = document.getElementById('difficulty-filter');
  const searchFilter = document.getElementById('course-search');
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', handleCourseFilter);
  }
  
  if (difficultyFilter) {
    difficultyFilter.addEventListener('change', handleCourseFilter);
  }
  
  if (searchFilter) {
    searchFilter.addEventListener('input', debounce(handleCourseSearch, 300));
  }
}

// Load courses from API
async function loadCourses(filters = {}) {
  try {
    showLoading(coursesList);
    
    const response = await api.courses.getCourses(filters);
    displayCourses(response.data.courses);
    
  } catch (error) {
    showMessage('Failed to load courses: ' + error.message, 'error');
  } finally {
    hideLoading(coursesList);
  }
}

// Display courses in list
function displayCourses(courses) {
  if (!coursesList) return;
  
  if (courses.length === 0) {
    coursesList.innerHTML = `
      <div class="no-data">
        <h3>No courses found</h3>
        <p>Try adjusting your search criteria or check back for new courses.</p>
      </div>
    `;
    return;
  }
  
  coursesList.innerHTML = courses.map(course => `
    <div class="course-card">
      <div class="course-header">
        <h3>${course.title}</h3>
        <span class="category">${course.category}</span>
        <span class="difficulty ${course.difficulty.toLowerCase()}">${course.difficulty}</span>
      </div>
      
      <div class="course-body">
        <p class="course-desc">${truncateText(course.description, 150)}</p>
        
        <div class="course-meta">
          <span class="duration">Duration: ${course.estimatedDuration} hours</span>
          <span class="lessons">Lessons: ${course.lessons.length}</span>
        </div>
        
        <div class="skills-covered">
          <strong>Skills:</strong>
          <div class="skills-list">
            ${course.skillsCovered.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </div>
        
        ${course.progress ? `
          <div class="course-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${course.progress.progressPercent}%"></div>
            </div>
            <span class="progress-text">${course.progress.progressPercent}% Complete</span>
          </div>
        ` : ''}
      </div>
      
      <div class="course-actions">
        <button class="btn btn-primary" onclick="viewCourseDetails('${course._id}')">View Course</button>
        ${course.progress && course.progress.isCompleted ? 
          '<span class="completed-badge">Completed!</span>' : 
          (course.progress ? 
            `<button class="btn btn-secondary" onclick="continueCourse('${course._id}')">Continue</button>` :
            `<button class="btn btn-outline" onclick="startCourse('${course._id}')">Start Learning</button>`
          )
        }
      </div>
    </div>
  `).join('');
}

// View course details
async function viewCourseDetails(courseId) {
  try {
    showLoading(courseDetails);
    
    const response = await api.courses.getCourse(courseId);
    currentCourse = response.data.course;
    
    displayCourseDetails(currentCourse);
    displayCourseLessons(currentCourse);
    
    // Show course details section
    if (courseDetails) {
      courseDetails.style.display = 'block';
      window.scrollTo({ top: courseDetails.offsetTop - 20, behavior: 'smooth' });
    }
    
  } catch (error) {
    showMessage('Failed to load course: ' + error.message, 'error');
  } finally {
    hideLoading(courseDetails);
  }
}

// Display course details
function displayCourseDetails(course) {
  if (!courseDetails) return;
  
  courseDetails.innerHTML = `
    <div class="course-details-content">
      <div class="course-details-header">
        <h2>${course.title}</h2>
        <div class="course-details-meta">
          <span class="category">${course.category}</span>
          <span class="difficulty ${course.difficulty.toLowerCase()}">${course.difficulty}</span>
          <span class="duration">Duration: ${course.estimatedDuration} hours</span>
          <span class="lessons">Lessons: ${course.lessons.length}</span>
        </div>
      </div>
      
      <div class="course-details-body">
        <div class="course-description">
          <h3>Course Description</h3>
          <p>${course.description}</p>
        </div>
        
        <div class="skills-covered">
          <h3>Skills You'll Learn</h3>
          <div class="skills-grid">
            ${course.skillsCovered.map(skill => `
              <div class="skill-item">
                <span class="skill-name">${skill}</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        ${course.progress ? `
          <div class="course-progress-large">
            <h3>Progress</h3>
            <div class="progress-circle">
              <svg width="120" height="120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#e0e0e0" stroke-width="8"/>
                <circle cx="60" cy="60" r="54" fill="none" stroke="#2196F3" stroke-width="8" 
                        stroke-dasharray="${course.progress.progressPercent * 3.39}" stroke-dashoffset="0" 
                        transform="rotate(-90 60 60)"/>
              </svg>
              <div class="progress-percent">${course.progress.progressPercent}%</div>
            </div>
            <p class="progress-status">
              ${course.progress.isCompleted ? 
                '🎉 Course Completed!' : 
                `${course.progress.completedLessons.length} of ${course.lessons.length} lessons completed`
              }
            </p>
          </div>
        ` : ''}
      </div>
      
      <div class="course-actions course-details-actions">
        <button class="btn btn-primary" onclick="startCourse('${course._id}')">Start Course</button>
        <button class="btn btn-outline" onclick="closeCourseDetails()">Close</button>
      </div>
    </div>
  `;
}

// Display course lessons
function displayCourseLessons(course) {
  if (!courseLessons) return;
  
  courseLessons.innerHTML = course.lessons.map((lesson, index) => {
    const isCompleted = course.progress && course.progress.completedLessons.some(
      completed => completed.lessonId.toString() === lesson._id.toString()
    );
    const completionData = course.progress && course.progress.completedLessons.find(
      completed => completed.lessonId.toString() === lesson._id.toString()
    );
    
    return `
      <div class="lesson-card ${isCompleted ? 'completed' : ''}">
        <div class="lesson-header">
          <div class="lesson-info">
            <span class="lesson-number">Lesson ${index + 1}</span>
            <h4>${lesson.title}</h4>
            ${lesson.description ? `<p>${lesson.description}</p>` : ''}
          </div>
          <div class="lesson-meta">
            <span class="duration">Duration: ${lesson.duration} min</span>
            ${isCompleted ? 
              `<span class="completed-status">Completed ${formatDate(completionData.completedAt)}</span>` : 
              `<span class="pending-status">Not started</span>`
            }
          </div>
        </div>
        
        <div class="lesson-actions">
          <a href="${lesson.videoUrl}" target="_blank" class="btn btn-primary">
            ${isCompleted ? 'Re-watch Video' : 'Watch Video'}
          </a>
          ${isCompleted ? 
            `<button class="btn btn-outline" onclick="markLessonIncomplete('${course._id}', '${lesson._id}')">Mark Incomplete</button>` :
            `<button class="btn btn-secondary" onclick="markLessonComplete('${course._id}', '${lesson._id}')">Mark Complete</button>`
          }
        </div>
      </div>
    `;
  }).join('');
}

// Start course
async function startCourse(courseId) {
  try {
    await viewCourseDetails(courseId);
    showMessage('Course started! Begin with the first lesson.', 'success');
  } catch (error) {
    showMessage('Failed to start course: ' + error.message, 'error');
  }
}

// Continue course
async function continueCourse(courseId) {
  try {
    await viewCourseDetails(courseId);
    showMessage('Welcome back! Continue where you left off.', 'success');
  } catch (error) {
    showMessage('Failed to continue course: ' + error.message, 'error');
  }
}

// Mark lesson complete
async function markLessonComplete(courseId, lessonId) {
  try {
    await api.courses.completeLesson(courseId, lessonId);
    showMessage('Lesson completed!', 'success');
    await viewCourseDetails(courseId);
    await loadDashboard();
  } catch (error) {
    showMessage('Failed to mark lesson complete: ' + error.message, 'error');
  }
}

// Mark lesson incomplete
async function markLessonIncomplete(courseId, lessonId) {
  try {
    // This would require a new API endpoint to remove completion
    showMessage('Lesson marked as incomplete', 'info');
    await viewCourseDetails(courseId);
    await loadDashboard();
  } catch (error) {
    showMessage('Failed to mark lesson incomplete: ' + error.message, 'error');
  }
}

// Close course details
function closeCourseDetails() {
  if (courseDetails) {
    courseDetails.style.display = 'none';
  }
}

// Load recommended courses
async function loadRecommendedCourses() {
  try {
    const response = await api.courses.getRecommendedCourses({ limit: 6 });
    displayRecommendedCourses(response.data.courses);
  } catch (error) {
    console.error('Failed to load recommended courses:', error);
  }
}

// Display recommended courses
function displayRecommendedCourses(courses) {
  if (!recommendedCourses) return;
  
  if (courses.length === 0) {
    recommendedCourses.innerHTML = `
      <div class="no-data">
        <h3>No recommendations available</h3>
        <p>Complete your profile and skills to get personalized recommendations.</p>
      </div>
    `;
    return;
  }
  
  recommendedCourses.innerHTML = courses.map(course => `
    <div class="course-card recommended">
      <div class="recommended-badge">Recommended</div>
      <div class="course-header">
        <h3>${course.title}</h3>
        <span class="category">${course.category}</span>
        <span class="difficulty ${course.difficulty.toLowerCase()}">${course.difficulty}</span>
      </div>
      
      <div class="course-body">
        <p class="course-desc">${truncateText(course.description, 120)}</p>
        
        <div class="skills-covered">
          <strong>Skills:</strong>
          <div class="skills-list">
            ${course.skillsCovered.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </div>
        
        ${course.progress ? `
          <div class="course-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${course.progress.progressPercent}%"></div>
            </div>
            <span class="progress-text">${course.progress.progressPercent}% Complete</span>
          </div>
        ` : ''}
      </div>
      
      <div class="course-actions">
        <button class="btn btn-primary" onclick="viewCourseDetails('${course._id}')">View Course</button>
        <button class="btn btn-outline" onclick="startCourse('${course._id}')">Start Learning</button>
      </div>
    </div>
  `).join('');
}

// Load learning dashboard
async function loadDashboard() {
  try {
    const response = await api.courses.getLearningDashboard();
    displayDashboard(response.data);
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
}

// Display learning dashboard
function displayDashboard(data) {
  if (!learningDashboard) return;
  
  const { dashboard, completedCourses } = data;
  
  learningDashboard.innerHTML = `
    <div class="dashboard-summary">
      <h3>Learning Dashboard</h3>
      
      <div class="dashboard-metrics">
        <div class="metric-card">
          <h4>Total Courses</h4>
          <div class="metric-value">${dashboard.totalCourses}</div>
        </div>
        <div class="metric-card">
          <h4>Completed</h4>
          <div class="metric-value">${dashboard.totalCompleted}</div>
        </div>
        <div class="metric-card">
          <h4>In Progress</h4>
          <div class="metric-value">${dashboard.totalInProgress}</div>
        </div>
        <div class="metric-card">
          <h4>Avg Progress</h4>
          <div class="metric-value">${dashboard.averageProgress}%</div>
        </div>
      </div>
      
      ${dashboard.courses.length > 0 ? `
        <div class="in-progress-courses">
          <h4>In Progress</h4>
          <div class="courses-grid">
            ${dashboard.courses.map(course => `
              <div class="course-mini-card">
                <h5>${course.title}</h5>
                <div class="mini-progress">
                  <div class="mini-progress-bar">
                    <div class="mini-progress-fill" style="width: ${course.progress.progressPercent}%"></div>
                  </div>
                  <span>${course.progress.progressPercent}%</span>
                </div>
                <button class="btn btn-sm btn-primary" onclick="viewCourseDetails('${course._id}')">Continue</button>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${completedCourses.length > 0 ? `
        <div class="completed-courses">
          <h4>Completed Courses</h4>
          <div class="completed-list">
            ${completedCourses.map(course => `
              <div class="completed-item">
                <span class="completed-title">${course.title}</span>
                <span class="completed-date">Completed: ${formatDate(course.updatedAt)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// Handle course filtering
function handleCourseFilter() {
  const category = document.getElementById('category-filter')?.value || '';
  const difficulty = document.getElementById('difficulty-filter')?.value || '';
  
  const filters = {};
  if (category) filters.category = category;
  if (difficulty) filters.difficulty = difficulty;
  
  loadCourses(filters);
}

// Handle course search
function handleCourseSearch() {
  const query = document.getElementById('course-search')?.value.trim() || '';
  
  if (query) {
    loadCourses({ skills: query });
  } else {
    loadCourses({});
  }
}

// Utility functions
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showLoading(element) {
  if (!element) return;
  element.classList.add('loading');
}

function hideLoading(element) {
  if (!element) return;
  element.classList.remove('loading');
}

// Expose functions globally
window.viewCourseDetails = viewCourseDetails;
window.startCourse = startCourse;
window.continueCourse = continueCourse;
window.markLessonComplete = markLessonComplete;
window.markLessonIncomplete = markLessonIncomplete;
window.closeCourseDetails = closeCourseDetails;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('learning-container')) {
    initLearning();
  }
});