// Authentication state management
let currentUser = null;

// DOM elements
const authModal = document.getElementById('auth-modal');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const switchAuthBtn = document.getElementById('switch-auth');
const closeAuthBtn = document.getElementById('close-auth');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

// Initialize authentication
function initAuth() {
  // Check if user is already logged in
  if (tokenManager.isAuthenticated()) {
    verifyToken();
  } else {
    showAuthRequired();
  }

  // Event listeners
  if (switchAuthBtn) {
    switchAuthBtn.addEventListener('click', toggleAuthMode);
  }
  
  if (closeAuthBtn) {
    closeAuthBtn.addEventListener('click', closeAuthModal);
  }
  
  if (authForm) {
    authForm.addEventListener('submit', handleAuthSubmit);
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Close modal when clicking outside
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) {
        closeAuthModal();
      }
    });
  }
}

// Show authentication modal
function showAuthModal(mode = 'login') {
  if (!authModal) return;
  
  authModal.style.display = 'flex';
  setAuthMode(mode);
}

// Close authentication modal
function closeAuthModal() {
  if (!authModal) return;
  
  authModal.style.display = 'none';
  authForm.reset();
}

// Set authentication mode (login/register)
function setAuthMode(mode) {
  if (!authForm || !authTitle || !switchAuthBtn) return;
  
  if (mode === 'register') {
    authTitle.textContent = 'Create Account';
    switchAuthBtn.textContent = 'Already have an account? Login';
    switchAuthBtn.dataset.mode = 'login';
    authForm.dataset.mode = 'register';
  } else {
    authTitle.textContent = 'Login to Your Account';
    switchAuthBtn.textContent = 'Don\'t have an account? Register';
    switchAuthBtn.dataset.mode = 'register';
    authForm.dataset.mode = 'login';
  }
}

// Toggle authentication mode
function toggleAuthMode() {
  const currentMode = authForm.dataset.mode;
  setAuthMode(currentMode === 'login' ? 'register' : 'login');
}

// Handle authentication form submission
async function handleAuthSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(authForm);
  const data = Object.fromEntries(formData);
  
  const mode = authForm.dataset.mode;
  
  try {
    showLoading(authForm);
    
    let response;
    if (mode === 'register') {
      response = await api.auth.register(data);
    } else {
      response = await api.auth.login(data);
    }
    
    // Store token and user data
    tokenManager.setToken(response.data.token);
    currentUser = response.data.user;
    
    // Update UI
    updateAuthUI();
    closeAuthModal();
    
    // Show success message
    showMessage('Authentication successful!', 'success');
    
    // Redirect to dashboard if on login page
    if (window.location.pathname.includes('login.html')) {
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    }
    
  } catch (error) {
    showMessage(error.message || 'Authentication failed', 'error');
  } finally {
    hideLoading(authForm);
  }
}

// Handle logout
async function handleLogout() {
  try {
    await api.auth.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local state
    tokenManager.removeToken();
    currentUser = null;
    updateAuthUI();
    showMessage('Logged out successfully', 'success');
  }
}

// Verify token and get user data
async function verifyToken() {
  try {
    const response = await api.auth.verifyToken();
    currentUser = response.data.user;
    updateAuthUI();
  } catch (error) {
    console.error('Token verification failed:', error);
    tokenManager.removeToken();
    showAuthRequired();
  }
}

// Update UI based on authentication state
function updateAuthUI() {
  const isAuthRequired = !currentUser;
  
  // Update navigation
  const authElements = document.querySelectorAll('[data-auth-required]');
  const guestElements = document.querySelectorAll('[data-guest-only]');
  
  if (authElements) {
    authElements.forEach(el => {
      el.style.display = isAuthRequired ? 'none' : 'block';
    });
  }
  
  if (guestElements) {
    guestElements.forEach(el => {
      el.style.display = isAuthRequired ? 'block' : 'none';
    });
  }
  
  // Update user info
  const userInfo = document.querySelector('.user-info');
  if (userInfo && currentUser) {
    userInfo.innerHTML = `
      <span class="username">${currentUser.name}</span>
      <span class="user-email">${currentUser.email}</span>
    `;
  }
  
  // Update dashboard stats if available
  if (window.updateDashboardStats && currentUser) {
    updateDashboardStats();
  }
}

// Show auth required state
function showAuthRequired() {
  updateAuthUI();
  
  // Show message for protected pages
  const protectedContent = document.querySelector('.protected-content');
  if (protectedContent) {
    protectedContent.innerHTML = `
      <div class="auth-required">
        <h2>Authentication Required</h2>
        <p>Please login to access this content.</p>
        <button class="btn btn-primary" onclick="showAuthModal('login')">Login Now</button>
      </div>
    `;
  }
}

// Check authentication for protected pages
function checkAuth(required = true) {
  const isAuthenticated = tokenManager.isAuthenticated();
  
  if (required && !isAuthenticated) {
    showAuthRequired();
    return false;
  } else if (!required && isAuthenticated) {
    // Redirect authenticated users away from login page
    if (window.location.pathname.includes('login.html')) {
      window.location.href = 'index.html';
    }
    return true;
  }
  
  return true;
}

// Utility functions for loading states
function showLoading(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';
  }
}

function hideLoading(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = authForm.dataset.mode === 'register' ? 'Register' : 'Login';
  }
}

// Utility function to show messages
function showMessage(message, type = 'info') {
  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = `message message-${type}`;
  messageEl.textContent = message;
  
  // Add to page
  const container = document.querySelector('.container') || document.body;
  container.appendChild(messageEl);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    messageEl.remove();
  }, 3000);
}

// Expose functions globally for HTML onclick handlers
window.showAuthModal = showAuthModal;
window.closeAuthModal = closeAuthModal;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);