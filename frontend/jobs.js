// Job Vacancies functionality
let currentJobs = [];
let currentFilters = {};

// DOM elements
const jobsList = document.getElementById('jobs-list');
const jobDetails = document.getElementById('job-details');
const savedJobsList = document.getElementById('saved-jobs-list');
const skillMatchesList = document.getElementById('skill-matches-list');
const searchInput = document.getElementById('job-search');
const filterType = document.getElementById('filter-type');
const filterLocation = document.getElementById('filter-location');
const filterSkills = document.getElementById('filter-skills');
const clearFiltersBtn = document.getElementById('clear-filters');

// Initialize jobs page
function initJobs() {
  if (!checkAuth(true)) return;
  
  loadJobs();
  setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
  }
  
  if (filterType) {
    filterType.addEventListener('change', handleFilterChange);
  }
  
  if (filterLocation) {
    filterLocation.addEventListener('input', debounce(handleFilterChange, 300));
  }
  
  if (filterSkills) {
    filterSkills.addEventListener('input', debounce(handleFilterChange, 300));
  }
  
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', handleClearFilters);
  }
  
  // Load tabs content
  loadSavedJobs();
  loadSkillMatches();
}

// Load jobs from API
async function loadJobs(filters = {}) {
  try {
    showLoading(jobsList);
    
    const response = await api.jobs.getJobs(filters);
    currentJobs = response.data.jobs;
    currentFilters = filters;
    
    displayJobs(currentJobs);
    
  } catch (error) {
    showMessage('Failed to load jobs: ' + error.message, 'error');
  } finally {
    hideLoading(jobsList);
  }
}

// Display jobs in list
function displayJobs(jobs) {
  if (!jobsList) return;
  
  if (jobs.length === 0) {
    jobsList.innerHTML = `
      <div class="no-data">
        <h3>No jobs found</h3>
        <p>Try adjusting your search criteria or check back later for new opportunities.</p>
      </div>
    `;
    return;
  }
  
  jobsList.innerHTML = jobs.map(job => `
    <div class="job-card">
      <div class="job-header">
        <div class="job-title">
          <h3>${job.title}</h3>
          <span class="company">${job.company}</span>
        </div>
        <div class="job-meta">
          <span class="location">${job.location}</span>
          <span class="type ${job.type.toLowerCase().replace(' ', '-')}">${job.type}</span>
          <span class="experience">${job.experienceLevel}</span>
        </div>
      </div>
      
      <div class="job-body">
        <p class="job-desc">${truncateText(job.description, 200)}</p>
        
        <div class="job-skills">
          <strong>Required Skills:</strong>
          <div class="skills-list">
            ${job.requiredSkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </div>
        
        ${job.salary ? `
          <div class="job-salary">
            <strong>Salary:</strong> $${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()} ${job.salary.currency}
          </div>
        ` : ''}
        
        <div class="job-match">
          <div class="match-bar">
            <div class="match-fill" style="width: ${job.matchPercentage}%"></div>
          </div>
          <span class="match-text">Skill Match: ${job.matchPercentage}%</span>
        </div>
      </div>
      
      <div class="job-actions">
        <button class="btn btn-primary" onclick="viewJobDetails('${job._id}')">View Details</button>
        ${job.isSaved ? 
          `<button class="btn btn-outline" onclick="removeSavedJob('${job._id}')">Remove from Saved</button>` :
          `<button class="btn btn-secondary" onclick="saveJob('${job._id}')">Save Job</button>`
        }
        ${job.externalUrl ? 
          `<a href="${job.externalUrl}" target="_blank" class="btn btn-outline">Apply Now</a>` :
          `<button class="btn btn-success" onclick="applyToJob('${job._id}')">Apply Here</button>`
        }
      </div>
    </div>
  `).join('');
}

// View job details
async function viewJobDetails(jobId) {
  try {
    showLoading(jobDetails);
    
    const response = await api.jobs.getJob(jobId);
    const job = response.data.job;
    
    displayJobDetails(job);
    
    // Show job details section
    if (jobDetails) {
      jobDetails.style.display = 'block';
      window.scrollTo({ top: jobDetails.offsetTop - 20, behavior: 'smooth' });
    }
    
  } catch (error) {
    showMessage('Failed to load job details: ' + error.message, 'error');
  } finally {
    hideLoading(jobDetails);
  }
}

// Display job details
function displayJobDetails(job) {
  if (!jobDetails) return;
  
  jobDetails.innerHTML = `
    <div class="job-details-content">
      <div class="job-details-header">
        <h2>${job.title}</h2>
        <div class="job-details-meta">
          <span class="company">${job.company}</span>
          <span class="location">${job.location}</span>
          <span class="type ${job.type.toLowerCase().replace(' ', '-')}">${job.type}</span>
          <span class="experience">${job.experienceLevel}</span>
        </div>
        ${job.salary ? `
          <div class="job-salary-large">
            <strong>Salary:</strong> $${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()} ${job.salary.currency}
          </div>
        ` : ''}
      </div>
      
      <div class="job-details-body">
        <div class="job-description">
          <h3>Job Description</h3>
          <p>${job.description}</p>
        </div>
        
        <div class="job-requirements">
          <h3>Required Skills</h3>
          <div class="skills-grid">
            ${job.requiredSkills.map(skill => `
              <div class="skill-item">
                <span class="skill-name">${skill}</span>
                <span class="skill-match">${getUserSkillLevel(skill)}%</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="job-match-details">
          <h3>Your Match</h3>
          <div class="match-circle">
            <svg width="120" height="120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#e0e0e0" stroke-width="8"/>
              <circle cx="60" cy="60" r="54" fill="none" stroke="#4CAF50" stroke-width="8" 
                      stroke-dasharray="${job.matchPercentage * 3.39}" stroke-dashoffset="0" 
                      transform="rotate(-90 60 60)"/>
            </svg>
            <div class="match-percent">${job.matchPercentage}%</div>
          </div>
          <p class="match-text">You match ${job.matchPercentage}% of the required skills</p>
        </div>
      </div>
      
      <div class="job-actions job-details-actions">
        ${job.isSaved ? 
          `<button class="btn btn-outline" onclick="removeSavedJob('${job._id}')">Remove from Saved</button>` :
          `<button class="btn btn-secondary" onclick="saveJob('${job._id}')">Save Job</button>`
        }
        ${job.externalUrl ? 
          `<a href="${job.externalUrl}" target="_blank" class="btn btn-primary">Apply on Company Site</a>` :
          `<button class="btn btn-success" onclick="applyToJob('${job._id}')">Apply Here</button>`
        }
        <button class="btn btn-outline" onclick="closeJobDetails()">Close</button>
      </div>
    </div>
  `;
}

// Save job
async function saveJob(jobId) {
  try {
    const response = await api.jobs.saveJob(jobId);
    showMessage('Job saved successfully!', 'success');
    loadJobs(currentFilters);
    loadSavedJobs();
  } catch (error) {
    showMessage('Failed to save job: ' + error.message, 'error');
  }
}

// Remove saved job
async function removeSavedJob(jobId) {
  try {
    await api.jobs.removeSavedJob(jobId);
    showMessage('Job removed from saved list', 'success');
    loadJobs(currentFilters);
    loadSavedJobs();
  } catch (error) {
    showMessage('Failed to remove job: ' + error.message, 'error');
  }
}

// Apply to job
async function applyToJob(jobId) {
  const notes = prompt('Add any notes for your application (optional):');
  
  try {
    await api.jobs.applyToJob(jobId, notes);
    showMessage('Application submitted successfully!', 'success');
    loadSavedJobs();
  } catch (error) {
    showMessage('Failed to submit application: ' + error.message, 'error');
  }
}

// Close job details
function closeJobDetails() {
  if (jobDetails) {
    jobDetails.style.display = 'none';
  }
}

// Load saved jobs
async function loadSavedJobs() {
  try {
    const response = await api.jobs.getSavedJobs();
    displaySavedJobs(response.data.savedJobs);
  } catch (error) {
    console.error('Failed to load saved jobs:', error);
  }
}

// Display saved jobs
function displaySavedJobs(savedJobs) {
  if (!savedJobsList) return;
  
  if (savedJobs.length === 0) {
    savedJobsList.innerHTML = `
      <div class="no-data">
        <h3>No saved jobs</h3>
        <p>Save jobs you're interested in to track them here.</p>
      </div>
    `;
    return;
  }
  
  savedJobsList.innerHTML = savedJobs.map(savedJob => `
    <div class="saved-job-card">
      <div class="saved-job-header">
        <h4>${savedJob.job.title}</h4>
        <span class="company">${savedJob.job.company}</span>
      </div>
      <div class="saved-job-body">
        <p class="location">${savedJob.job.location}</p>
        <div class="saved-job-meta">
          <span class="match">Match: ${savedJob.matchPercentage}%</span>
          <span class="status ${savedJob.isApplied ? 'applied' : 'saved'}">
            ${savedJob.isApplied ? 'Applied' : 'Saved'}
          </span>
        </div>
        <div class="saved-job-actions">
          <button class="btn btn-primary" onclick="viewJobDetails('${savedJob.job._id}')">View Details</button>
          <button class="btn btn-outline" onclick="removeSavedJob('${savedJob.job._id}')">Remove</button>
          ${savedJob.job.externalUrl ? 
            `<a href="${savedJob.job.externalUrl}" target="_blank" class="btn btn-secondary">Apply</a>` :
            `<button class="btn btn-success" onclick="applyToJob('${savedJob.job._id}')">Apply Here</button>`
          }
        </div>
      </div>
    </div>
  `).join('');
}

// Load skill matches
async function loadSkillMatches() {
  try {
    const response = await api.jobs.getSkillMatches({ minMatchPercentage: 60 });
    displaySkillMatches(response.data.jobs);
  } catch (error) {
    console.error('Failed to load skill matches:', error);
  }
}

// Display skill matches
function displaySkillMatches(jobs) {
  if (!skillMatchesList) return;
  
  if (jobs.length === 0) {
    skillMatchesList.innerHTML = `
      <div class="no-data">
        <h3>No strong matches found</h3>
        <p>Try updating your skills or check back for new opportunities.</p>
      </div>
    `;
    return;
  }
  
  skillMatchesList.innerHTML = jobs.map(job => `
    <div class="match-card">
      <div class="match-header">
        <h4>${job.title}</h4>
        <span class="company">${job.company}</span>
      </div>
      <div class="match-body">
        <p class="location">${job.location}</p>
        <div class="match-score">
          <div class="score-bar">
            <div class="score-fill" style="width: ${job.matchPercentage}%"></div>
          </div>
          <span class="score-text">${job.matchPercentage}% Match</span>
        </div>
        <div class="match-actions">
          <button class="btn btn-primary" onclick="viewJobDetails('${job._id}')">View Job</button>
          <button class="btn btn-secondary" onclick="saveJob('${job._id}')">Save</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Handle search
function handleSearch() {
  const query = searchInput.value.trim();
  const filters = { ...currentFilters };
  
  if (query) {
    filters.skills = query;
  } else {
    delete filters.skills;
  }
  
  loadJobs(filters);
}

// Handle filter change
function handleFilterChange() {
  const filters = {
    type: filterType?.value || '',
    location: filterLocation?.value || '',
    skills: filterSkills?.value || ''
  };
  
  // Remove empty filters
  Object.keys(filters).forEach(key => {
    if (!filters[key]) delete filters[key];
  });
  
  loadJobs(filters);
}

// Handle clear filters
function handleClearFilters() {
  if (searchInput) searchInput.value = '';
  if (filterType) filterType.value = '';
  if (filterLocation) filterLocation.value = '';
  if (filterSkills) filterSkills.value = '';
  
  loadJobs({});
}

// Utility functions
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function getUserSkillLevel(skill) {
  // This would ideally come from user profile
  // For now, return a mock percentage
  return Math.floor(Math.random() * 100);
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
  // Add loading class or spinner
  element.classList.add('loading');
}

function hideLoading(element) {
  if (!element) return;
  element.classList.remove('loading');
}

// Expose functions globally
window.viewJobDetails = viewJobDetails;
window.saveJob = saveJob;
window.removeSavedJob = removeSavedJob;
window.applyToJob = applyToJob;
window.closeJobDetails = closeJobDetails;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('jobs-container')) {
    initJobs();
  }
});