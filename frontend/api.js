// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const TOKEN_KEY = 'skillvista_token';

// Utility functions
const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
};

// Authentication API
const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  verifyToken: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// User API
const userAPI = {
  getProfile: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  updateProfile: async (userId, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  getStats: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/stats`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Practice API
const practiceAPI = {
  getProblems: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/practice/problems?${params}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getProblem: async (problemId) => {
    const response = await fetch(`${API_BASE_URL}/practice/problems/${problemId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  submitSolution: async (problemId, code, language) => {
    const response = await fetch(`${API_BASE_URL}/practice/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        problemId,
        code,
        language
      })
    });
    return handleResponse(response);
  },

  getAttempts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/practice/attempts?${params}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Jobs API
const jobsAPI = {
  getJobs: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/vacancies/jobs?${params}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getJob: async (jobId) => {
    const response = await fetch(`${API_BASE_URL}/vacancies/jobs/${jobId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  saveJob: async (jobId) => {
    const response = await fetch(`${API_BASE_URL}/vacancies/jobs/${jobId}/save`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  removeSavedJob: async (jobId) => {
    const response = await fetch(`${API_BASE_URL}/vacancies/jobs/${jobId}/save`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  applyToJob: async (jobId, notes) => {
    const response = await fetch(`${API_BASE_URL}/vacancies/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ notes })
    });
    return handleResponse(response);
  },

  getSavedJobs: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/vacancies/saved?${params}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getSkillMatches: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/vacancies/matches?${params}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Skill Analysis API
const skillAnalysisAPI = {
  analyzeSkills: async (targetRole, currentSkills) => {
    const response = await fetch(`${API_BASE_URL}/skill-analysis/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ targetRole, currentSkills })
    });
    return handleResponse(response);
  },

  getAvailableRoles: async () => {
    const response = await fetch(`${API_BASE_URL}/skill-analysis/roles`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  compareWithJobs: async (jobIds) => {
    const response = await fetch(`${API_BASE_URL}/skill-analysis/compare`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ jobIds })
    });
    return handleResponse(response);
  }
};

// Courses API
const coursesAPI = {
  getCourses: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/courses?${params}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getCourse: async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getCourseProgress: async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/progress`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  updateProgress: async (courseId, completedLessons) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/progress`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ completedLessons })
    });
    return handleResponse(response);
  },

  completeLesson: async (courseId, lessonId, score) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ score })
    });
    return handleResponse(response);
  },

  getLearningDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/courses/dashboard`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getRecommendedCourses: async (limit = 5) => {
    const response = await fetch(`${API_BASE_URL}/courses/recommended?limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Export all APIs
const api = {
  auth: authAPI,
  user: userAPI,
  practice: practiceAPI,
  jobs: jobsAPI,
  skillAnalysis: skillAnalysisAPI,
  courses: coursesAPI
};

// Token management
const tokenManager = {
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};

// Export token manager
window.tokenManager = tokenManager;

// Export API
window.api = api;

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { api, tokenManager };
}