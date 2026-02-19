// Practice Arena functionality
let currentProblem = null;
let editor = null;

// DOM elements
const problemList = document.getElementById('problem-list');
const problemDetails = document.getElementById('problem-details');
const codeEditor = document.getElementById('code-editor');
const submitBtn = document.getElementById('submit-code');
const runBtn = document.getElementById('run-code');
const resetBtn = document.getElementById('reset-code');
const problemTitle = document.getElementById('problem-title');
const problemDescription = document.getElementById('problem-description');
const problemDifficulty = document.getElementById('problem-difficulty');
const problemTopic = document.getElementById('problem-topic');
const problemConstraints = document.getElementById('problem-constraints');
const attemptsList = document.getElementById('attempts-list');
const bestScore = document.getElementById('best-score');

// Initialize practice arena
function initPractice() {
  if (!checkAuth(true)) return;
  
  loadProblems();
  setupCodeEditor();
  setupEventListeners();
}

// Setup code editor (using basic textarea for now)
function setupCodeEditor() {
  if (!codeEditor) return;
  
  // Set default code template
  const defaultCode = `// Your solution here
function solve(input) {
  // Implement your solution
  return result;
}

// Example usage:
// console.log(solve([2,7,11,15], 9)); // Should return [0,1]`;
  
  codeEditor.value = defaultCode;
}

// Setup event listeners
function setupEventListeners() {
  if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmitSolution);
  }
  
  if (runBtn) {
    runBtn.addEventListener('click', handleRunCode);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', handleResetCode);
  }
}

// Load problems from API
async function loadProblems(filters = {}) {
  try {
    showLoading(problemList);
    
    const response = await api.practice.getProblems(filters);
    displayProblems(response.data.problems);
    
  } catch (error) {
    showMessage('Failed to load problems: ' + error.message, 'error');
  } finally {
    hideLoading(problemList);
  }
}

// Display problems in list
function displayProblems(problems) {
  if (!problemList) return;
  
  problemList.innerHTML = problems.map(problem => `
    <div class="problem-card" onclick="loadProblemDetails('${problem._id}')">
      <div class="problem-header">
        <h3>${problem.title}</h3>
        <span class="difficulty ${problem.difficulty.toLowerCase()}">${problem.difficulty}</span>
      </div>
      <p class="problem-topic">Topic: ${problem.topic}</p>
      <p class="problem-desc">${truncateText(problem.description, 100)}</p>
      <div class="problem-actions">
        <button class="btn btn-outline">View Details</button>
      </div>
    </div>
  `).join('');
}

// Load problem details
async function loadProblemDetails(problemId) {
  try {
    showLoading(problemDetails);
    
    const response = await api.practice.getProblem(problemId);
    currentProblem = response.data.problem;
    
    displayProblemDetails(currentProblem);
    loadUserAttempts(problemId);
    
    // Show problem details section
    if (problemDetails) {
      problemDetails.style.display = 'block';
      window.scrollTo({ top: problemDetails.offsetTop - 20, behavior: 'smooth' });
    }
    
  } catch (error) {
    showMessage('Failed to load problem: ' + error.message, 'error');
  } finally {
    hideLoading(problemDetails);
  }
}

// Display problem details
function displayProblemDetails(problem) {
  if (!problemTitle || !problemDescription || !problemDifficulty || !problemTopic) return;
  
  problemTitle.textContent = problem.title;
  problemDescription.textContent = problem.description;
  problemDifficulty.textContent = problem.difficulty;
  problemDifficulty.className = `difficulty ${problem.difficulty.toLowerCase()}`;
  problemTopic.textContent = `Topic: ${problem.topic}`;
  
  if (problemConstraints && problem.constraints) {
    problemConstraints.innerHTML = `<strong>Constraints:</strong><br>${problem.constraints}`;
    problemConstraints.style.display = 'block';
  } else {
    problemConstraints.style.display = 'none';
  }
  
  // Display best attempt if available
  if (problem.bestAttempt) {
    displayBestAttempt(problem.bestAttempt);
  }
}

// Display best attempt
function displayBestAttempt(attempt) {
  if (!bestScore) return;
  
  bestScore.innerHTML = `
    <div class="best-attempt">
      <h4>Best Attempt</h4>
      <p>Score: <strong>${attempt.score}%</strong></p>
      <p>Status: <span class="status ${attempt.result}">${attempt.result}</span></p>
      <p>Submitted: ${formatDate(attempt.submittedAt)}</p>
    </div>
  `;
  bestScore.style.display = 'block';
}

// Load user attempts for current problem
async function loadUserAttempts(problemId) {
  try {
    const response = await api.practice.getAttempts({ problemId });
    displayAttempts(response.data.attempts);
  } catch (error) {
    console.error('Failed to load attempts:', error);
  }
}

// Display attempts list
function displayAttempts(attempts) {
  if (!attemptsList) return;
  
  if (attempts.length === 0) {
    attemptsList.innerHTML = '<p class="no-data">No attempts yet. Start coding!</p>';
    return;
  }
  
  attemptsList.innerHTML = attempts.map(attempt => `
    <div class="attempt-item">
      <div class="attempt-header">
        <span class="attempt-score">Score: ${attempt.score}%</span>
        <span class="attempt-status ${attempt.result}">${attempt.result}</span>
        <span class="attempt-date">${formatDate(attempt.submittedAt)}</span>
      </div>
      <div class="attempt-details">
        <span>Language: ${attempt.language}</span>
        <span>Time: ${attempt.executionTime}ms</span>
        <span>Memory: ${attempt.memoryUsage}KB</span>
      </div>
    </div>
  `).join('');
}

// Handle submit solution
async function handleSubmitSolution() {
  if (!currentProblem || !codeEditor) return;
  
  const code = codeEditor.value.trim();
  const language = document.getElementById('language-select')?.value || 'javascript';
  
  if (!code) {
    showMessage('Please write some code before submitting', 'warning');
    return;
  }
  
  try {
    showLoading(submitBtn);
    
    const response = await api.practice.submitSolution(currentProblem._id, code, language);
    
    showMessage('Solution submitted successfully!', 'success');
    displaySubmissionResult(response.data.attempt);
    loadUserAttempts(currentProblem._id);
    
  } catch (error) {
    showMessage('Submission failed: ' + error.message, 'error');
  } finally {
    hideLoading(submitBtn);
  }
}

// Handle run code (simulation)
function handleRunCode() {
  if (!codeEditor) return;
  
  const code = codeEditor.value.trim();
  if (!code) {
    showMessage('Please write some code first', 'warning');
    return;
  }
  
  // Simulate code execution (in a real app, this would use a code execution service)
  showMessage('Code execution simulated. In a real implementation, this would run your code against test cases.', 'info');
}

// Handle reset code
function handleResetCode() {
  if (!codeEditor) return;
  
  const defaultCode = `// Your solution here
function solve(input) {
  // Implement your solution
  return result;
}

// Example usage:
// console.log(solve([2,7,11,15], 9)); // Should return [0,1]`;
  
  codeEditor.value = defaultCode;
  showMessage('Code reset to default template', 'info');
}

// Utility functions
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

function showLoading(element) {
  if (!element) return;
  element.disabled = true;
  if (element.tagName === 'BUTTON') {
    element.innerHTML = '<span class="loading-spinner"></span> Processing...';
  }
}

function hideLoading(element) {
  if (!element) return;
  element.disabled = false;
  if (element.tagName === 'BUTTON') {
    if (element.id === 'submit-code') {
      element.textContent = 'Submit Solution';
    } else if (element.id === 'run-code') {
      element.textContent = 'Run Code';
    } else if (element.id === 'reset-code') {
      element.textContent = 'Reset Code';
    }
  }
}

// Expose functions globally
window.loadProblemDetails = loadProblemDetails;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('practice-arena')) {
    initPractice();
  }
});