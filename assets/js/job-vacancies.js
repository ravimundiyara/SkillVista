// Job & Internship Vacancies JavaScript
// Handles search, filters, skill matching, and modal interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize job vacancies section
    initJobVacancies();
});

// Mock data for jobs and user skills
const jobData = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "TechCorp Solutions",
        type: "full-time",
        location: "Remote",
        experience: "2-4 years",
        salary: "$70,000 - $90,000",
        posted: "2 days ago",
        description: "We are looking for a talented Frontend Developer to join our growing team. You will be responsible for building user-facing features using modern JavaScript frameworks.",
        requiredSkills: ["JavaScript", "React", "CSS", "HTML", "Git"],
        niceToHaveSkills: ["TypeScript", "Redux", "Node.js"],
        matchPercentage: 0 // Will be calculated dynamically
    },
    {
        id: 2,
        title: "Backend Developer Intern",
        company: "StartupXYZ",
        type: "internship",
        location: "New York, NY",
        experience: "0-1 years",
        salary: "$15/hr",
        posted: "1 day ago",
        description: "Join our backend team as an intern and work with Node.js, Express, and MongoDB. Great opportunity to learn and grow in a fast-paced environment.",
        requiredSkills: ["Node.js", "Express", "MongoDB", "JavaScript"],
        niceToHaveSkills: ["React", "Docker", "AWS"],
        matchPercentage: 0
    },
    {
        id: 3,
        title: "DevOps Engineer",
        company: "CloudTech",
        type: "full-time",
        location: "San Francisco, CA",
        experience: "3-5 years",
        salary: "$120,000 - $150,000",
        posted: "5 days ago",
        description: "We need a DevOps Engineer to help us scale our infrastructure. Experience with AWS, Docker, and Kubernetes required.",
        requiredSkills: ["AWS", "Docker", "Kubernetes", "Linux", "Git"],
        niceToHaveSkills: ["Terraform", "Jenkins", "Monitoring"],
        matchPercentage: 0
    },
    {
        id: 4,
        title: "Data Scientist",
        company: "DataAnalytics Inc",
        type: "full-time",
        location: "Chicago, IL",
        experience: "4+ years",
        salary: "$90,000 - $120,000",
        posted: "3 days ago",
        description: "Join our data science team to build machine learning models and analyze large datasets. Python and SQL expertise required.",
        requiredSkills: ["Python", "SQL", "Machine Learning", "Statistics"],
        niceToHaveSkills: ["TensorFlow", "Tableau", "Big Data"],
        matchPercentage: 0
    },
    {
        id: 5,
        title: "Mobile App Developer",
        company: "AppMasters",
        type: "contract",
        location: "Remote",
        experience: "2+ years",
        salary: "$50/hr",
        posted: "1 week ago",
        description: "We are looking for a Mobile App Developer to build cross-platform mobile applications using React Native.",
        requiredSkills: ["React Native", "JavaScript", "iOS", "Android"],
        niceToHaveSkills: ["TypeScript", "Redux", "Firebase"],
        matchPercentage: 0
    },
    {
        id: 6,
        title: "Cybersecurity Analyst",
        company: "SecureNet",
        type: "full-time",
        location: "Washington, DC",
        experience: "3+ years",
        salary: "$80,000 - $110,000",
        posted: "4 days ago",
        description: "Protect our systems and data from cyber threats. Experience with security tools and incident response required.",
        requiredSkills: ["Security", "Incident Response", "Network Security", "Risk Assessment"],
        niceToHaveSkills: ["CISSP", "Forensics", "Compliance"],
        matchPercentage: 0
    }
];

// User skills (can be loaded from user profile)
const userSkills = [
    "JavaScript", "React", "Node.js", "CSS", "HTML", "Git", "MongoDB", 
    "AWS", "Docker", "Python", "SQL", "TypeScript"
];

// Filter state
let currentFilters = {
    search: '',
    category: 'all',
    type: 'all'
};

// Initialize the job vacancies section
function initJobVacancies() {
    // Set up event listeners
    setupEventListeners();
    
    // Calculate match percentages
    calculateAllMatches();
    
    // Render initial state
    renderJobs();
    updateStats();
}

// Set up event listeners for filters and interactions
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('job-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentFilters.search = e.target.value.toLowerCase();
            renderJobs();
            updateStats();
        });
    }
    
    // Category filter
    const categorySelect = document.getElementById('category-filter');
    if (categorySelect) {
        categorySelect.addEventListener('change', function(e) {
            currentFilters.category = e.target.value;
            renderJobs();
            updateStats();
        });
    }
    
    // Job type filter
    const typeSelect = document.getElementById('type-filter');
    if (typeSelect) {
        typeSelect.addEventListener('change', function(e) {
            currentFilters.type = e.target.value;
            renderJobs();
            updateStats();
        });
    }
    
    // Close modal on overlay click
    const modal = document.getElementById('skill-gap-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Add event listeners for modal buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-full-job-btn')) {
            console.log('View Full Job clicked');
            const jobTitle = document.getElementById('modal-job-title').textContent;
            const jobCompany = document.getElementById('modal-company').textContent;
            // Open in new tab with job details
            window.open(`https://example.com/job/${encodeURIComponent(jobTitle)}-${encodeURIComponent(jobCompany)}`, '_blank');
        }
        
        if (e.target.closest('.start-learning-btn')) {
            console.log('Start Learning clicked');
            navigateToLearning();
        }
    });
}

// Calculate match percentage for all jobs
function calculateAllMatches() {
    jobData.forEach(job => {
        job.matchPercentage = calculateMatchPercentage(job.requiredSkills, userSkills);
    });
}

// Calculate match percentage between job skills and user skills
function calculateMatchPercentage(jobSkills, userSkills) {
    if (jobSkills.length === 0) return 0;
    
    const matchingSkills = jobSkills.filter(skill => 
        userSkills.includes(skill)
    );
    
    return Math.round((matchingSkills.length / jobSkills.length) * 100);
}

// Filter jobs based on current filters
function filterJobs() {
    return jobData.filter(job => {
        // Search filter
        if (currentFilters.search) {
            const searchTerms = currentFilters.search.toLowerCase();
            const searchableText = `${job.title} ${job.company} ${job.description}`.toLowerCase();
            if (!searchableText.includes(searchTerms)) {
                return false;
            }
        }
        
        // Category filter
        if (currentFilters.category !== 'all') {
            const categoryJobs = getCategoryJobs(currentFilters.category);
            if (!categoryJobs.includes(job.id)) {
                return false;
            }
        }
        
        // Type filter
        if (currentFilters.type !== 'all') {
            if (job.type !== currentFilters.type) {
                return false;
            }
        }
        
        return true;
    });
}

// Get jobs by category
function getCategoryJobs(category) {
    const categoryMap = {
        'web-development': [1, 5], // Frontend Developer, Mobile App Developer
        'data-science': [4], // Data Scientist
        'ai-ml': [4], // Data Scientist
        'backend-development': [2, 3], // Backend Developer Intern, DevOps Engineer
        'devops': [3], // DevOps Engineer
        'mobile-development': [5], // Mobile App Developer
        'cybersecurity': [6] // Cybersecurity Analyst
    };
    
    return categoryMap[category] || [];
}

// Render job listings
function renderJobs() {
    const jobsContainer = document.getElementById('jobs-container');
    const filteredJobs = filterJobs();
    
    if (filteredJobs.length === 0) {
        jobsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No jobs found</h3>
                <p>Try adjusting your search criteria or filters</p>
                <button class="btn btn-primary" onclick="resetFilters()">Reset Filters</button>
            </div>
        `;
        return;
    }
    
    jobsContainer.innerHTML = filteredJobs.map(job => createJobCard(job)).join('');
    
// Add event listeners to new cards
    document.querySelectorAll('.match-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const jobId = parseInt(this.dataset.jobId);
            console.log('Match My Skills clicked for job:', jobId);
            openSkillGapModal(jobId);
        });
    });
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const jobId = this.dataset.jobId;
            console.log('View Job clicked for job:', jobId);
            window.open(`https://example.com/job/${jobId}`, '_blank');
        });
    });
    
    // Add event listeners for Start Learning buttons
    document.querySelectorAll('.start-learning-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Start Learning clicked');
            navigateToLearning();
        });
    });
}

// Create HTML for a job card
function createJobCard(job) {
    const matchClass = getMatchClass(job.matchPercentage);
    const matchText = getMatchText(job.matchPercentage);
    
    return `
        <article class="vacancy-card" data-job-id="${job.id}">
            <div class="card-header">
                <div>
                    <h3 class="job-title">${job.title}</h3>
                    <span class="job-type-badge ${job.type}">${job.type.replace('-', ' ')}</span>
                </div>
                <span class="match-badge ${matchClass}">${matchText}</span>
            </div>
            
            <div class="meta-info">
                <span class="meta-item">
                    <i class="fas fa-building"></i> ${job.company}
                </span>
                <span class="meta-item">
                    <i class="fas fa-map-marker-alt"></i> ${job.location}
                </span>
                <span class="meta-item">
                    <i class="fas fa-briefcase"></i> ${job.experience}
                </span>
                <span class="meta-item">
                    <i class="fas fa-dollar-sign"></i> ${job.salary}
                </span>
                <span class="meta-item">
                    <i class="fas fa-clock"></i> ${job.posted}
                </span>
            </div>
            
            <div class="job-description">
                ${job.description}
            </div>
            
            <div class="skills-section">
                <span class="skills-label">Required Skills</span>
                <div class="skill-tags">
                    ${job.requiredSkills.slice(0, 4).map(skill => `
                        <span class="skill-tag required">
                            <i class="fas fa-check"></i> ${skill}
                        </span>
                    `).join('')}
                    ${job.requiredSkills.length > 4 ? `
                        <span class="skill-tag">
                            <i class="fas fa-plus"></i> +${job.requiredSkills.length - 4} more
                        </span>
                    ` : ''}
                </div>
            </div>
            
            <div class="card-actions">
                <div>
                    <button class="action-btn primary-btn match-btn" data-job-id="${job.id}">
                        <i class="fas fa-search"></i> Match My Skills
                    </button>
                    <button class="action-btn secondary-btn view-btn" data-job-id="${job.id}">
                        <i class="fas fa-external-link-alt"></i> View Job
                    </button>
                </div>
                <button class="icon-btn bookmark-btn" data-job-id="${job.id}" title="Bookmark">
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
        </article>
    `;
}

// Get CSS class for match badge
function getMatchClass(percentage) {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 50) return 'good';
    return 'poor';
}

// Get text for match badge
function getMatchText(percentage) {
    if (percentage >= 80) return `${percentage}% Match`;
    if (percentage >= 50) return `${percentage}% Match`;
    return `${percentage}% Match`;
}

// Update stats summary
function updateStats() {
    const filteredJobs = filterJobs();
    const totalOpenings = filteredJobs.length;
    const internships = filteredJobs.filter(job => job.type === 'internship').length;
    const goodMatches = filteredJobs.filter(job => job.matchPercentage >= 50).length;
    const yourSkillsCount = userSkills.length;
    
    document.getElementById('total-openings').textContent = totalOpenings;
    document.getElementById('internships').textContent = internships;
    document.getElementById('good-matches').textContent = goodMatches;
    document.getElementById('your-skills').textContent = yourSkillsCount;
}

// Open skill gap modal
function openSkillGapModal(jobId) {
    const job = jobData.find(j => j.id === jobId);
    if (!job) return;
    
    const modal = document.getElementById('skill-gap-modal');
    const modalTitle = document.getElementById('modal-job-title');
    const modalCompany = document.getElementById('modal-company');
    const scoreValue = document.getElementById('score-value');
    const scoreText = document.getElementById('score-text');
    const matchDetails = document.getElementById('match-details');
    const matchingSkillsContainer = document.getElementById('matching-skills');
    const missingSkillsContainer = document.getElementById('missing-skills');
    const niceToHaveSkillsContainer = document.getElementById('nice-to-have-skills');
    
    // Update modal content
    modalTitle.textContent = job.title;
    modalCompany.textContent = job.company;
    scoreValue.textContent = job.matchPercentage + '%';
    scoreText.textContent = 'Match Score';
    
    const matchingSkills = job.requiredSkills.filter(skill => userSkills.includes(skill));
    const missingSkills = job.requiredSkills.filter(skill => !userSkills.includes(skill));
    
    matchDetails.textContent = `You have ${matchingSkills.length} of ${job.requiredSkills.length} required skills`;
    
    // Update skill sections
    matchingSkillsContainer.innerHTML = matchingSkills.length > 0 
        ? matchingSkills.map(skill => `
            <span class="skill-item matching">
                <i class="fas fa-check"></i> ${skill}
            </span>
        `).join('')
        : '<span class="skill-item matching"><i class="fas fa-check"></i> No matching skills</span>';
    
    missingSkillsContainer.innerHTML = missingSkills.length > 0
        ? missingSkills.map(skill => `
            <span class="skill-item missing">
                <i class="fas fa-times"></i> ${skill}
            </span>
        `).join('')
        : '<span class="skill-item missing"><i class="fas fa-times"></i> No missing skills</span>';
    
    niceToHaveSkillsContainer.innerHTML = job.niceToHaveSkills.length > 0
        ? job.niceToHaveSkills.map(skill => `
            <span class="skill-item nice-to-have">
                <i class="fas fa-star"></i> ${skill}
            </span>
        `).join('')
        : '<span class="skill-item nice-to-have"><i class="fas fa-star"></i> No nice-to-have skills</span>';
    
    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close skill gap modal
function closeModal() {
    const modal = document.getElementById('skill-gap-modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// Reset all filters
function resetFilters() {
    currentFilters = {
        search: '',
        category: 'all',
        type: 'all'
    };
    
    // Reset form elements
    const searchInput = document.getElementById('job-search');
    const categorySelect = document.getElementById('category-filter');
    const typeSelect = document.getElementById('type-filter');
    
    if (searchInput) searchInput.value = '';
    if (categorySelect) categorySelect.value = 'all';
    if (typeSelect) typeSelect.value = 'all';
    
    // Re-render
    renderJobs();
    updateStats();
}

// Utility function to format salary
function formatSalary(salary) {
    if (salary.includes('/hr')) {
        return salary;
    }
    return salary.replace(/\d+/g, match => match.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
}

// Navigate to Learning section
function navigateToLearning() {
    console.log('Navigating to Learning section');
    // Scroll to the course-learning-section
    const learningSection = document.querySelector('.course-learning-section');
    if (learningSection) {
        learningSection.scrollIntoView({ behavior: 'smooth' });
        // Optionally highlight the section
        learningSection.style.backgroundColor = 'rgba(0, 123, 255, 0.05)';
        setTimeout(() => {
            learningSection.style.backgroundColor = '';
        }, 2000);
    } else {
        // Fallback: navigate to dashboard with hash
        window.location.href = 'dashboard.html#course-learning-section';
    }
}

// Export functions for global access
window.resetFilters = resetFilters;
window.openSkillGapModal = openSkillGapModal;
window.closeModal = closeModal;
window.navigateToLearning = navigateToLearning;
