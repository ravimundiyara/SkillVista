// Skill Analysis functionality
let currentAnalysis = null;

// DOM elements
const rolesList = document.getElementById('roles-list');
const analysisForm = document.getElementById('analysis-form');
const analysisResults = document.getElementById('analysis-results');
const comparisonForm = document.getElementById('comparison-form');
const comparisonResults = document.getElementById('comparison-results');

// Initialize skill analysis
function initSkillAnalysis() {
  if (!checkAuth(true)) return;
  
  loadAvailableRoles();
  setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
  if (analysisForm) {
    analysisForm.addEventListener('submit', handleSkillAnalysis);
  }
  
  if (comparisonForm) {
    comparisonForm.addEventListener('submit', handleSkillComparison);
  }
}

// Load available roles
async function loadAvailableRoles() {
  try {
    const response = await api.skillAnalysis.getAvailableRoles();
    displayRoles(response.data.roles);
  } catch (error) {
    showMessage('Failed to load roles: ' + error.message, 'error');
  }
}

// Display available roles
function displayRoles(roles) {
  if (!rolesList) return;
  
  rolesList.innerHTML = roles.map(role => `
    <div class="role-card" onclick="selectRole('${role}')">
      <h3>${role}</h3>
      <p>Click to analyze your skills for this role</p>
      <div class="role-actions">
        <button class="btn btn-primary">Analyze Skills</button>
      </div>
    </div>
  `).join('');
}

// Select role for analysis
function selectRole(role) {
  const roleInput = document.getElementById('target-role');
  if (roleInput) {
    roleInput.value = role;
  }
  
  // Scroll to analysis form
  const analysisSection = document.getElementById('skill-analysis-section');
  if (analysisSection) {
    analysisSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Handle skill analysis
async function handleSkillAnalysis(e) {
  e.preventDefault();
  
  const targetRole = document.getElementById('target-role')?.value;
  const currentSkills = document.getElementById('current-skills')?.value
    .split(',')
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0);
  
  if (!targetRole) {
    showMessage('Please select a target role', 'warning');
    return;
  }
  
  try {
    showLoading(analysisForm);
    
    const response = await api.skillAnalysis.analyzeSkills(targetRole, currentSkills);
    currentAnalysis = response.data;
    
    displayAnalysisResults(currentAnalysis);
    
  } catch (error) {
    showMessage('Analysis failed: ' + error.message, 'error');
  } finally {
    hideLoading(analysisForm);
  }
}

// Display analysis results
function displayAnalysisResults(analysis) {
  if (!analysisResults) return;
  
  const { targetRole, analysis: skillAnalysis, recommendations } = analysis;
  
  analysisResults.innerHTML = `
    <div class="analysis-summary">
      <h3>Skill Analysis for ${targetRole}</h3>
      <div class="analysis-metrics">
        <div class="metric-card">
          <h4>Match Percentage</h4>
          <div class="metric-value">${skillAnalysis.matchPercentage}%</div>
        </div>
        <div class="metric-card">
          <h4>Skills Matched</h4>
          <div class="metric-value">${skillAnalysis.matchedCount}/${skillAnalysis.totalRequired}</div>
        </div>
        <div class="metric-card">
          <h4>Skills Missing</h4>
          <div class="metric-value">${skillAnalysis.missingCount}</div>
        </div>
      </div>
      
      <div class="analysis-details">
        <div class="matched-skills">
          <h4>Skills You Have ✅</h4>
          <div class="skills-list">
            ${skillAnalysis.matchedSkills.map(skill => `<span class="skill-tag matched">${skill}</span>`).join('')}
          </div>
        </div>
        
        <div class="missing-skills">
          <h4>Skills to Learn ❌</h4>
          <div class="skills-list">
            ${skillAnalysis.missingSkills.map(skill => `<span class="skill-tag missing">${skill}</span>`).join('')}
          </div>
        </div>
      </div>
      
      <div class="recommendations">
        <h4>Learning Recommendations</h4>
        ${recommendations.map(rec => `
          <div class="recommendation-card">
            <div class="rec-header">
              <span class="priority ${rec.priority.toLowerCase()}">${rec.priority}</span>
              <span class="category">${rec.category}</span>
            </div>
            <p>${rec.suggestion}</p>
            <div class="rec-meta">Estimated time: ${rec.estimatedTime}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  analysisResults.style.display = 'block';
}

// Handle skill comparison
async function handleSkillComparison(e) {
  e.preventDefault();
  
  const jobIds = document.getElementById('job-ids')?.value
    .split(',')
    .map(id => id.trim())
    .filter(id => id.length > 0);
  
  if (jobIds.length === 0) {
    showMessage('Please enter job IDs to compare', 'warning');
    return;
  }
  
  try {
    showLoading(comparisonForm);
    
    const response = await api.skillAnalysis.compareWithJobs(jobIds);
    displayComparisonResults(response.data);
    
  } catch (error) {
    showMessage('Comparison failed: ' + error.message, 'error');
  } finally {
    hideLoading(comparisonForm);
  }
}

// Display comparison results
function displayComparisonResults(data) {
  if (!comparisonResults) return;
  
  const { comparisons, userSkills } = data;
  
  comparisonResults.innerHTML = `
    <div class="comparison-summary">
      <h3>Skill Comparison Results</h3>
      <div class="user-skills-display">
        <h4>Your Current Skills</h4>
        <div class="skills-list">
          ${userSkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      </div>
      
      <div class="comparison-list">
        ${comparisons.map(comparison => `
          <div class="comparison-card">
            <div class="comparison-header">
              <h4>${comparison.title}</h4>
              <span class="company">${comparison.company}</span>
              <div class="match-score">
                <div class="score-bar">
                  <div class="score-fill" style="width: ${comparison.matchPercentage}%"></div>
                </div>
                <span class="score-text">${comparison.matchPercentage}% Match</span>
              </div>
            </div>
            
            <div class="comparison-body">
              <div class="required-skills">
                <h5>Required Skills</h5>
                <div class="skills-grid">
                  ${comparison.requiredSkills.map(skill => `
                    <div class="skill-item ${comparison.gaps.includes(skill) ? 'missing' : 'matched'}">
                      <span class="skill-name">${skill}</span>
                      <span class="skill-status">${comparison.gaps.includes(skill) ? 'Missing' : 'Have'}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              <div class="skill-gaps">
                <h5>Skills to Improve</h5>
                ${comparison.gaps.length > 0 ? 
                  `<div class="gaps-list">
                    ${comparison.gaps.map(gap => `<span class="gap-tag">${gap}</span>`).join('')}
                  </div>` :
                  '<p class="no-gaps">Great! You have all the required skills for this position.</p>'
                }
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  comparisonResults.style.display = 'block';
}

// Utility functions
function showLoading(form) {
  if (!form) return;
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';
  }
}

function hideLoading(form) {
  if (!form) return;
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = false;
    if (form.id === 'analysis-form') {
      submitBtn.textContent = 'Analyze Skills';
    } else if (form.id === 'comparison-form') {
      submitBtn.textContent = 'Compare Skills';
    }
  }
}

// Expose functions globally
window.selectRole = selectRole;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('skill-analysis-container')) {
    initSkillAnalysis();
  }
});