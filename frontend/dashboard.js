// Dashboard functionality
let dashboardData = null;

// DOM elements
const statsContainer = document.getElementById('stats-container');
const recentActivity = document.getElementById('recent-activity');
const quickActions = document.getElementById('quick-actions');

// Initialize dashboard
function initDashboard() {
  if (!checkAuth(true)) return;
  
  loadDashboardData();
  setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
  // Quick action buttons
  const quickActionButtons = document.querySelectorAll('.quick-action-btn');
  quickActionButtons.forEach(btn => {
    btn.addEventListener('click', handleQuickAction);
  });
}

// Load dashboard data
async function loadDashboardData() {
  try {
    showLoading(statsContainer);
    
    // Load user stats
    const userResponse = await api.user.getStats(currentUser._id);
    const practiceStats = userResponse.data.practice;
    const jobStats = userResponse.data.jobs;
    const learningStats = userResponse.data.learning;
    
    // Load recent activity (mock data for now)
    const recentActivityData = await getRecentActivity();
    
    dashboardData = {
      practice: practiceStats,
      jobs: jobStats,
      learning: learningStats,
      recentActivity: recentActivityData
    };
    
    displayDashboardData(dashboardData);
    
  } catch (error) {
    showMessage('Failed to load dashboard: ' + error.message, 'error');
  } finally {
    hideLoading(statsContainer);
  }
}

// Display dashboard data
function displayDashboardData(data) {
  if (!statsContainer) return;
  
  // Display practice stats
  const practiceStats = data.practice;
  const practiceContainer = document.getElementById('practice-stats');
  if (practiceContainer) {
    practiceContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-header">
          <h4>Practice Arena</h4>
          <span class="stat-icon">🎯</span>
        </div>
        <div class="stat-content">
          <div class="stat-item">
            <span class="stat-label">Total Attempts</span>
            <span class="stat-value">${practiceStats.totalAttempts}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Passed</span>
            <span class="stat-value success">${practiceStats.totalPassed}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Failed</span>
            <span class="stat-value error">${practiceStats.totalFailed}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Avg Score</span>
            <span class="stat-value">${practiceStats.averageScore}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Best Score</span>
            <span class="stat-value">${practiceStats.bestScore}%</span>
          </div>
        </div>
      </div>
    `;
  }
  
  // Display job stats
  const jobStats = data.jobs;
  const jobContainer = document.getElementById('job-stats');
  if (jobContainer) {
    jobContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-header">
          <h4>Job Applications</h4>
          <span class="stat-icon">💼</span>
        </div>
        <div class="stat-content">
          <div class="stat-item">
            <span class="stat-label">Saved Jobs</span>
            <span class="stat-value">${jobStats.totalSaved}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Applied</span>
            <span class="stat-value">${jobStats.totalApplied}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Avg Match</span>
            <span class="stat-value">${jobStats.averageMatchPercentage}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Best Match</span>
            <span class="stat-value">${jobStats.bestMatch}%</span>
          </div>
        </div>
      </div>
    `;
  }
  
  // Display learning stats
  const learningStats = data.learning;
  const learningContainer = document.getElementById('learning-stats');
  if (learningContainer) {
    learningContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-header">
          <h4>Learning Progress</h4>
          <span class="stat-icon">📚</span>
        </div>
        <div class="stat-content">
          <div class="stat-item">
            <span class="stat-label">Total Courses</span>
            <span class="stat-value">${learningStats.totalCourses}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Completed</span>
            <span class="stat-value success">${learningStats.totalCompleted}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">In Progress</span>
            <span class="stat-value">${learningStats.totalInProgress}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Avg Progress</span>
            <span class="stat-value">${learningStats.averageProgress}%</span>
          </div>
        </div>
      </div>
    `;
  }
  
  // Display recent activity
  displayRecentActivity(data.recentActivity);
  
  // Display quick actions
  displayQuickActions();
}

// Display recent activity
function displayRecentActivity(activity) {
  if (!recentActivity) return;
  
  if (activity.length === 0) {
    recentActivity.innerHTML = `
      <div class="no-activity">
        <h4>No recent activity</h4>
        <p>Start using SkillVista to see your progress here!</p>
      </div>
    `;
    return;
  }
  
  recentActivity.innerHTML = `
    <div class="activity-list">
      <h4>Recent Activity</h4>
      ${activity.map(item => `
        <div class="activity-item">
          <div class="activity-icon">${item.icon}</div>
          <div class="activity-content">
            <h5>${item.title}</h5>
            <p>${item.description}</p>
            <span class="activity-time">${formatRelativeTime(item.timestamp)}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Display quick actions
function displayQuickActions() {
  if (!quickActions) return;
  
  quickActions.innerHTML = `
    <div class="quick-actions-grid">
      <div class="quick-action-card">
        <div class="action-icon">🎯</div>
        <h4>Practice Coding</h4>
        <p>Solve coding problems to improve your skills</p>
        <a href="practice.html" class="btn btn-primary">Start Practicing</a>
      </div>
      
      <div class="quick-action-card">
        <div class="action-icon">💼</div>
        <h4>Find Jobs</h4>
        <p>Explore job opportunities that match your skills</p>
        <a href="vacancies.html" class="btn btn-primary">Browse Jobs</a>
      </div>
      
      <div class="quick-action-card">
        <div class="action-icon">📊</div>
        <h4>Skill Analysis</h4>
        <p>Analyze your skills and get personalized recommendations</p>
        <a href="skill-analysis.html" class="btn btn-primary">Analyze Skills</a>
      </div>
      
      <div class="quick-action-card">
        <div class="action-icon">📚</div>
        <h4>Learn New Skills</h4>
        <p>Take courses to enhance your knowledge</p>
        <a href="learning.html" class="btn btn-primary">Start Learning</a>
      </div>
    </div>
  `;
}

// Handle quick action clicks
function handleQuickAction(e) {
  const action = e.target.dataset.action;
  
  switch (action) {
    case 'practice':
      window.location.href = 'practice.html';
      break;
    case 'jobs':
      window.location.href = 'vacancies.html';
      break;
    case 'analyze':
      window.location.href = 'skill-analysis.html';
      break;
    case 'learn':
      window.location.href = 'learning.html';
      break;
    default:
      showMessage('Action not implemented yet', 'info');
  }
}

// Get mock recent activity data
async function getRecentActivity() {
  // In a real application, this would come from an API
  return [
    {
      icon: '🎯',
      title: 'Completed Coding Problem',
      description: 'Solved "Two Sum" problem with 100% accuracy',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      icon: '💼',
      title: 'Applied to Job',
      description: 'Applied to Frontend Developer position at Tech Corp',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      icon: '📚',
      title: 'Completed Course Lesson',
      description: 'Finished "JavaScript Basics" lesson',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      icon: '📊',
      title: 'Updated Skills',
      description: 'Added React and Node.js to your skill profile',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    }
  ];
}

// Utility functions
function formatRelativeTime(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now - time;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return time.toLocaleDateString();
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
window.handleQuickAction = handleQuickAction;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('dashboard-container')) {
    initDashboard();
  }
});