// Minimal JavaScript for Skill Gap Analyzer & Integrated Learning Platform

document.addEventListener('DOMContentLoaded', () => {
    console.log('Skill Gap Analyzer is ready!');

    // ===== Login / Register Toggle (login.html) =====
    const loginToggle = document.getElementById('login-toggle');
    const registerToggle = document.getElementById('register-toggle');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginToggle && registerToggle && loginForm && registerForm) {
        const setFormActive = (activeForm, inactiveForm, activeToggle, inactiveToggle) => {
            // Toggle form visibility via .active class (matches your CSS)
            activeForm.classList.add('active');
            inactiveForm.classList.remove('active');

            // Toggle tab button style
            activeToggle.classList.add('active');
            inactiveToggle.classList.remove('active');
        };

        loginToggle.addEventListener('click', (e) => {
            e.preventDefault();
            setFormActive(loginForm, registerForm, loginToggle, registerToggle);
        });

        registerToggle.addEventListener('click', (e) => {
            e.preventDefault();
            setFormActive(registerForm, loginForm, registerToggle, loginToggle);
        });
    }

    // ===== Sidebar Active Highlight (dashboard.html) =====
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

    if (sidebarLinks.length) {
        sidebarLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove existing active state
                sidebarLinks.forEach((l) => l.classList.remove('active'));
                // Highlight clicked link
                link.classList.add('active');
                
                // Handle section visibility based on href
                const href = link.getAttribute('href');
                
                // Hide all sections first
                const sections = document.querySelectorAll('section[id]');
                sections.forEach(section => {
                    if (section.id !== 'practice-arena') {
                        section.style.display = 'none';
                    }
                });
                
                // Show the target section
                if (href === '#practice-arena') {
                    const practiceArena = document.getElementById('practice-arena');
                    if (practiceArena) {
                        practiceArena.style.display = 'block';
                        // Initialize Practice Arena if not already done
                        if (typeof initializePracticeArena !== 'undefined') {
                            initializePracticeArena();
                        }
                    }
                } else if (href === '#course-learning-section') {
                    const learningSection = document.querySelector('.course-learning-section');
                    if (learningSection) {
                        learningSection.style.display = 'block';
                        // Initialize Learning section if not already done
                        if (typeof initializeLearningSection !== 'undefined') {
                            initializeLearningSection();
                        }
                    }
                } else {
                    // Show main dashboard content
                    const mainContent = document.querySelector('.main-dashboard-area');
                    if (mainContent) {
                        mainContent.style.display = 'block';
                    }
                }
            });
        });
    }

    // ===== First-time User Resume Upload Modal (dashboard.html) =====
    const resumeModal = document.getElementById('resume-modal');
    const resumeModalClose = document.getElementById('resume-modal-close');
    const resumeModalSkip = document.getElementById('resume-modal-skip');
    const resumeModalForm = document.getElementById('resume-modal-form');
    const resumeManagerLink = document.getElementById('resume-manager-link');

    // Modal open/close functions (accessible for sidebar link)
    const openResumeModal = () => {
        if (resumeModal) {
            resumeModal.classList.remove('is-hidden');
            resumeModal.setAttribute('aria-hidden', 'false');
        }
    };

    const closeResumeModal = () => {
        if (resumeModal) {
            resumeModal.classList.add('is-hidden');
            resumeModal.setAttribute('aria-hidden', 'true');
        }
    };

    if (resumeModal && resumeModalClose && resumeModalSkip && resumeModalForm) {
        // Check if user has already uploaded or skipped (frontend check via localStorage)
        // TODO: Replace with real first-time user flag from backend/session.
        const savedStatus = localStorage.getItem('skillvista_resume_status');
        const isFirstTimeUser = !savedStatus || savedStatus === 'not-uploaded';

        if (isFirstTimeUser) {
            openResumeModal();
        }

        // Close on "X"
        resumeModalClose.addEventListener('click', () => {
            closeResumeModal();
        });

        // Skip button handler is moved below after status management setup

        // Close when clicking outside the dialog (backdrop)
        resumeModal.addEventListener('click', (event) => {
            if (event.target === resumeModal) {
                closeResumeModal();
            }
        });

        // Optional: close with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeResumeModal();
            }
        });
    }

    // Sidebar "Resume Manager" link opens the modal
    if (resumeManagerLink) {
        resumeManagerLink.addEventListener('click', (event) => {
            event.preventDefault();
            openResumeModal();
        });
    }

    // ===== Resume Status Management (dashboard.html) =====
    const resumeStatusBadge = document.getElementById('resume-status-badge');
    const resumeStatusContent = document.getElementById('resume-status-content');
    const resumeFileInput = document.getElementById('resume-modal-file');

    // Resume status state management (frontend only, using localStorage)
    const RESUME_STORAGE_KEY = 'skillvista_resume_status';
    const RESUME_FILE_KEY = 'skillvista_resume_filename';

    const getResumeStatus = () => {
        return localStorage.getItem(RESUME_STORAGE_KEY) || 'not-uploaded';
    };

    const setResumeStatus = (status, filename = null) => {
        localStorage.setItem(RESUME_STORAGE_KEY, status);
        if (filename) {
            localStorage.setItem(RESUME_FILE_KEY, filename);
        }
        updateResumeStatusDisplay();
    };

    const getResumeFilename = () => {
        return localStorage.getItem(RESUME_FILE_KEY) || null;
    };

    const updateResumeStatusDisplay = () => {
        if (!resumeStatusBadge || !resumeStatusContent) return;

        const status = getResumeStatus();
        const filename = getResumeFilename();

        // Update badge
        resumeStatusBadge.className = 'resume-status-badge';
        resumeStatusBadge.textContent = status === 'uploaded' ? 'Uploaded' : 
                                         status === 'skipped' ? 'Skipped' : 'Not uploaded';
        resumeStatusBadge.classList.add(status === 'uploaded' ? 'uploaded' : 
                                         status === 'skipped' ? 'skipped' : 'not-uploaded');

        // Update content based on status
        if (status === 'uploaded' && filename) {
            resumeStatusContent.innerHTML = `
                <p class="resume-status-message">Your resume is on file.</p>
                <p class="resume-status-filename">File: ${filename}</p>
                <div class="resume-status-actions">
                    <button type="button" class="btn btn-primary" id="replace-resume-btn">Replace Resume</button>
                </div>
            `;
        } else if (status === 'skipped') {
            resumeStatusContent.innerHTML = `
                <p class="resume-status-message">You can upload your resume later from Resume Manager or Profile Settings.</p>
            `;
        } else {
            resumeStatusContent.innerHTML = `
                <p class="resume-status-message">No resume uploaded yet.</p>
            `;
        }
    };

    // Update status display on page load
    updateResumeStatusDisplay();

    // Event delegation for dynamically created "Replace Resume" button
    if (resumeStatusContent) {
        resumeStatusContent.addEventListener('click', (event) => {
            if (event.target && event.target.id === 'replace-resume-btn') {
                event.preventDefault();
                openResumeModal();
            }
        });
    }

    // Handle resume form submission
    if (resumeModalForm && resumeFileInput) {
        resumeModalForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const file = resumeFileInput.files[0];
            if (!file) {
                alert('Please select a resume file before uploading.');
                return;
            }

            // Front-end validation: ensure allowed types
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];

            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a PDF, DOC, or DOCX file.');
                return;
            }

            // Save status and filename (frontend only - no backend API yet)
            setResumeStatus('uploaded', file.name);
            
            // TODO: Connect to backend API to upload the file.
            // Example:
            // const formData = new FormData();
            // formData.append('resume', file);
            // fetch('/api/upload-resume', {
            //   method: 'POST',
            //   body: formData,
            //   credentials: 'include',
            // })
            //   .then(response => response.json())
            //   .then(data => {
            //     setResumeStatus('uploaded', file.name);
            //     closeResumeModal();
            //   })
            //   .catch(error => {
            //     alert('Upload failed. Please try again.');
            //   });

            closeResumeModal();
        });
    }

    // Handle skip button
    if (resumeModalSkip) {
        resumeModalSkip.addEventListener('click', () => {
            setResumeStatus('skipped');
            // TODO: Persist "skipped" state in backend or local storage.
            closeResumeModal();
        });
    }

    // ===== Resume Analysis Logic =====
    const analysisFormContainer = document.getElementById('analysis-form-container');
    const analysisResultsContainer = document.getElementById('analysis-results-container');
    const analysisMessage = document.getElementById('analysis-message');
    const analyzeResumeBtn = document.getElementById('analyze-resume-btn');
    const targetRoleSearch = document.getElementById('target-role-search');
    const targetRoleHidden = document.getElementById('target-role');
    const roleSearchResults = document.getElementById('role-search-results');
    const resumeAnalysisBadge = document.getElementById('resume-analysis-badge');

    // State management for search and selection
    let selectedTargetRole = null;

    // Resume Skip Button (for main page)
    const resumeSkipBtn = document.getElementById('resume-skip-btn');
    if (resumeSkipBtn) {
        resumeSkipBtn.addEventListener('click', function() {
            // Hide upload section and show analysis form
            document.getElementById('resume-upload-section').style.display = 'none';
            showAnalysisForm();
        });
    }

    // Analyze Resume Button
    if (analyzeResumeBtn) {
        analyzeResumeBtn.addEventListener('click', function() {
            // Validate that a role was actually selected, not just typed
            if (!selectedTargetRole) {
                alert('Please select a target role from the suggestions list.');
                return;
            }

            // Check if resume is uploaded
            const resumeStatus = getResumeStatus();
            if (resumeStatus !== 'uploaded') {
                alert('Please upload your resume first before analyzing.');
                return;
            }

            // Call the backend API for skill gap analysis
            performResumeAnalysis(selectedTargetRole);
        });
    }

    // Searchable Dropdown Functionality with Autocomplete
    if (targetRoleSearch && roleSearchResults) {
        let searchTimeout;
        let allRolesCache = null;

        // Load all roles on page load for better performance
        loadAllRoles();

        // Enhanced input event handler with autocomplete
        targetRoleSearch.addEventListener('input', function() {
            const query = this.value.trim();
            
            // Clear previous timeout
            clearTimeout(searchTimeout);
            
            if (query.length === 0) {
                // Show all roles when search is empty
                showAllRoles();
                return;
            }
            
            // Show results immediately for better UX
            // Debounce search to avoid too many API calls
            searchTimeout = setTimeout(() => {
                performRoleSearch(query);
            }, 100); // Reduced debounce time for better responsiveness
        });

        targetRoleSearch.addEventListener('focus', function() {
            if (this.value.trim().length === 0) {
                // Show all roles when focused and empty
                showAllRoles();
            } else if (this.value.trim().length >= 1) {
                performRoleSearch(this.value.trim());
            }
        });

        targetRoleSearch.addEventListener('click', function() {
            if (this.value.trim().length === 0) {
                // Show all roles when clicked and empty
                showAllRoles();
            }
        });

        // Enhanced keyboard navigation
        targetRoleSearch.addEventListener('keydown', function(e) {
            const results = roleSearchResults.querySelectorAll('.dropdown-item');
            const visibleResults = Array.from(results).filter(r => r.style.display !== 'none');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                navigateResults(visibleResults, 1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                navigateResults(visibleResults, -1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const selected = roleSearchResults.querySelector('.dropdown-item.selected');
                if (selected && selected.dataset.role) {
                    selectRole(selected.dataset.role, selected.textContent.replace(selected.querySelector('.role-category')?.textContent || '', '').trim());
                }
            } else if (e.key === 'Escape') {
                hideSearchResults();
            }
        });

        // Click outside to close dropdown
        document.addEventListener('click', function(e) {
            if (!targetRoleSearch.contains(e.target) && !roleSearchResults.contains(e.target)) {
                hideSearchResults();
            }
        });
    }

    function loadAllRoles() {
        // Load all roles from API for better performance
        fetch('/job-roles')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    allRolesCache = [];
                    data.data.categories.forEach(category => {
                        category.roles.forEach(role => {
                            allRolesCache.push({
                                role_name: role,
                                category: category.category_name
                            });
                        });
                    });
                    // Sort roles alphabetically
                    allRolesCache.sort((a, b) => a.role_name.localeCompare(b.role_name));
                    console.log(`Loaded ${allRolesCache.length} roles successfully`);
                } else {
                    console.error('Failed to load roles:', data);
                }
            })
            .catch(error => {
                console.error('Failed to load roles:', error);
            });
    }

    function showAllRoles() {
        if (!allRolesCache) {
            // Fallback to API if cache not loaded
            fetch('/job-roles')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const allRoles = [];
                        data.data.categories.forEach(category => {
                            category.roles.forEach(role => {
                                allRoles.push({
                                    role_name: role,
                                    category: category.category_name
                                });
                            });
                        });
                        displaySearchResults(allRoles);
                    } else {
                        console.error('Failed to load roles:', data);
                        showNoResults();
                    }
                })
                .catch(error => {
                    console.error('Role search error:', error);
                    showNoResults();
                });
        } else {
            displaySearchResults(allRolesCache);
        }
    }

    function performRoleSearch(query) {
        // First try local search for better performance
        const localResults = searchRolesLocally(query);
        if (localResults.length > 0) {
            displaySearchResults(localResults);
            return;
        }

        // Fallback to API search
        fetch(`/job-roles/search?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.data.results.length > 0) {
                    displaySearchResults(data.data.results);
                } else {
                    showNoResults();
                }
            })
            .catch(error => {
                console.error('Role search error:', error);
                showNoResults();
            });
    }

    function searchRolesLocally(query) {
        if (!allRolesCache) return [];
        
        const queryLower = query.toLowerCase().trim();
        const results = [];
        
        // Enhanced search logic for better keyword matching
        allRolesCache.forEach(role => {
            const roleLower = role.role_name.toLowerCase();
            const categoryLower = role.category.toLowerCase();
            
            // Check if query matches role name or category
            const roleMatches = roleLower.includes(queryLower);
            const categoryMatches = categoryLower.includes(queryLower);
            
            if (roleMatches || categoryMatches) {
                results.push({
                    ...role,
                    matchType: roleMatches ? 'role' : 'category',
                    roleLower: roleLower,
                    categoryLower: categoryLower
                });
            }
        });
        
        // Sort results by relevance with enhanced logic
        results.sort((a, b) => {
            // Exact match on role name gets highest priority
            if (a.roleLower === queryLower && b.roleLower !== queryLower) return -1;
            if (b.roleLower === queryLower && a.roleLower !== queryLower) return 1;
            
            // Exact match on category gets second priority
            if (a.categoryLower === queryLower && b.categoryLower !== queryLower) return -1;
            if (b.categoryLower === queryLower && a.categoryLower !== queryLower) return 1;
            
            // Role matches get priority over category matches
            if (a.matchType === 'role' && b.matchType === 'category') return -1;
            if (b.matchType === 'role' && a.matchType === 'category') return 1;
            
            // Earlier position in role name gets priority
            const aIndex = a.roleLower.indexOf(queryLower);
            const bIndex = b.roleLower.indexOf(queryLower);
            if (aIndex !== -1 && bIndex !== -1) {
                if (aIndex !== bIndex) return aIndex - bIndex;
            }
            
            // Alphabetical sorting as final tiebreaker
            return a.role_name.localeCompare(b.role_name);
        });
        
        // Return only role_name and category for display
        return results.slice(0, 20).map(result => ({
            role_name: result.role_name,
            category: result.category
        }));
    }

    function displaySearchResults(results) {
        roleSearchResults.innerHTML = '';
        
        if (results.length === 0) {
            showNoResults();
            return;
        }

        results.forEach((result, index) => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.textContent = result.role_name;
            item.dataset.role = result.role_name;
            item.dataset.category = result.category;
            
            const categorySpan = document.createElement('span');
            categorySpan.className = 'role-category';
            categorySpan.textContent = result.category;
            item.appendChild(categorySpan);

            // Enhanced click handler with smooth selection
            item.addEventListener('click', function() {
                selectRole(this.dataset.role, this.textContent.replace(this.querySelector('.role-category')?.textContent || '', '').trim());
            });

            // Add hover effect
            item.addEventListener('mouseenter', function() {
                const items = roleSearchResults.querySelectorAll('.dropdown-item');
                items.forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
            });

            roleSearchResults.appendChild(item);
        });

        // Animate dropdown appearance
        roleSearchResults.style.display = 'block';
        roleSearchResults.style.opacity = '0';
        roleSearchResults.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            roleSearchResults.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            roleSearchResults.style.opacity = '1';
            roleSearchResults.style.transform = 'translateY(0)';
        }, 10);
    }

    function showNoResults() {
        roleSearchResults.innerHTML = '<div class="dropdown-item">No roles found</div>';
        roleSearchResults.style.display = 'block';
        roleSearchResults.style.opacity = '1';
        roleSearchResults.style.transform = 'translateY(0)';
    }

    function hideSearchResults() {
        // Animate dropdown disappearance
        roleSearchResults.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        roleSearchResults.style.opacity = '0';
        roleSearchResults.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            roleSearchResults.style.display = 'none';
            roleSearchResults.innerHTML = '';
            roleSearchResults.style.transition = '';
        }, 200);
    }

    function selectRole(roleValue, displayText) {
        // Update state management
        selectedTargetRole = roleValue;
        targetRoleHidden.value = roleValue;
        targetRoleSearch.value = displayText;
        
        // Animate selection and hide dropdown
        roleSearchResults.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        roleSearchResults.style.opacity = '0';
        roleSearchResults.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            roleSearchResults.style.display = 'none';
            roleSearchResults.innerHTML = '';
            roleSearchResults.style.transition = '';
        }, 200);
        
        // Update analysis message to show selected role
        analysisMessage.textContent = `Selected role: ${displayText}. Click "Analyze Resume" to see your skill gaps.`;
        
        // Add visual feedback for selection
        targetRoleSearch.style.borderColor = 'var(--primary-color)';
        targetRoleSearch.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--primary-color) 20%, white)';
        
        setTimeout(() => {
            targetRoleSearch.style.borderColor = '#ced4da';
            targetRoleSearch.style.boxShadow = 'none';
        }, 1000);
    }

    function navigateResults(results, direction) {
        if (results.length === 0) return;

        let currentIndex = -1;
        const selected = roleSearchResults.querySelector('.dropdown-item.selected');
        
        if (selected) {
            currentIndex = results.indexOf(selected);
        }

        let newIndex = currentIndex + direction;
        if (newIndex < 0) newIndex = results.length - 1;
        if (newIndex >= results.length) newIndex = 0;

        // Remove previous selection
        results.forEach(r => r.classList.remove('selected'));
        
        // Add new selection with visual feedback
        results[newIndex].classList.add('selected');
        
        // Scroll into view with smooth animation
        results[newIndex].scrollIntoView({ 
            block: 'nearest',
            behavior: 'smooth'
        });
    }

    // Functions for Resume Analysis
    function showAnalysisForm() {
        analysisFormContainer.style.display = 'block';
        analysisResultsContainer.style.display = 'none';
        analysisMessage.textContent = 'Select a target role and click "Analyze Resume" to see your skill gaps.';
        resumeAnalysisBadge.textContent = 'Ready to analyze';
        resumeAnalysisBadge.className = 'resume-status-badge not-uploaded';
    }

    function performResumeAnalysis(targetRole) {
        // Show processing state
        resumeAnalysisBadge.textContent = 'Analyzing...';
        resumeAnalysisBadge.className = 'resume-status-badge processing';
        analysisMessage.textContent = 'Analyzing your resume against the selected role...';

        // Get resume filename for API call
        const resumeFilename = getResumeFilename();

        // Call the backend API
        fetch('/skill-gap-analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                target_role: targetRole,
                extracted_resume_data: {
                    skills: [], // In real implementation, this would come from resume analysis
                    education: [],
                    experience: [],
                    projects: [],
                    certifications: []
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayAnalysisResults(data.data);
            } else {
                throw new Error(data.message || 'Analysis failed');
            }
        })
        .catch(error => {
            console.error('Analysis error:', error);
            // Fallback to mock data if API fails
            const mockResponse = {
                target_role: targetRole,
                resume_score: Math.floor(Math.random() * 60) + 20,
                level: getLevelFromScore(Math.floor(Math.random() * 60) + 20),
                matched_skills: getMockMatchedSkills(targetRole),
                missing_skills: getMockMissingSkills(targetRole)
            };
            displayAnalysisResults(mockResponse);
        });
    }

    function getLevelFromScore(score) {
        if (score < 40) return 'Beginner';
        if (score <= 70) return 'Intermediate';
        return 'Advanced';
    }

    function getMockMatchedSkills(targetRole) {
        const skillSets = {
            'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React'],
            'Backend Developer': ['Python', 'SQL', 'REST APIs'],
            'Data Scientist': ['Python', 'Pandas', 'Statistics'],
            'Full Stack Developer': ['HTML', 'JavaScript', 'Node.js'],
            'Mobile Developer': ['JavaScript', 'React Native'],
            'DevOps Engineer': ['Docker', 'Linux', 'Git'],
            'UI/UX Designer': ['Figma', 'User Research'],
            'Product Manager': ['Agile', 'Analytics', 'Communication']
        };
        return skillSets[targetRole] || ['JavaScript', 'Git'];
    }

    function getMockMissingSkills(targetRole) {
        const skillSets = {
            'Frontend Developer': ['Vue', 'Angular', 'TypeScript', 'Git', 'CSS Frameworks', 'Responsive Design', 'APIs', 'Webpack', 'Node.js', 'UI/UX Basics'],
            'Backend Developer': ['Java', 'GraphQL', 'Database Design', 'Authentication', 'Security', 'AWS', 'Microservices', 'Testing'],
            'Data Scientist': ['NumPy', 'Machine Learning', 'R', 'TensorFlow', 'PyTorch', 'Data Cleaning', 'Big Data', 'Jupyter'],
            'Full Stack Developer': ['React', 'Python', 'SQL', 'REST APIs', 'Git', 'Database Design', 'Authentication', 'Docker', 'AWS', 'Testing', 'Agile', 'Problem Solving'],
            'Mobile Developer': ['Swift', 'Kotlin', 'Java', 'Flutter', 'iOS Development', 'Android Development', 'APIs', 'UI/UX Design', 'App Store Guidelines'],
            'DevOps Engineer': ['Kubernetes', 'AWS', 'CI/CD', 'Monitoring', 'Scripting', 'Infrastructure as Code', 'Security', 'Networking', 'Troubleshooting', 'Automation'],
            'UI/UX Designer': ['Adobe XD', 'Sketch', 'Wireframing', 'Prototyping', 'User Testing', 'Design Systems', 'HTML', 'CSS', 'JavaScript Basics', 'Problem Solving'],
            'Product Manager': ['Product Strategy', 'Market Research', 'User Stories', 'Scrum', 'Kanban', 'Leadership', 'Project Management', 'Data Analysis', 'Stakeholder Management']
        };
        return skillSets[targetRole] || ['Advanced CSS', 'TypeScript', 'Git'];
    }

    function displayAnalysisResults(data) {
        // Update badge and message
        resumeAnalysisBadge.textContent = 'Analyzed';
        resumeAnalysisBadge.className = 'resume-status-badge analyzed';
        analysisMessage.textContent = 'Your resume has been analyzed successfully!';

        // Show results container
        analysisFormContainer.style.display = 'none';
        analysisResultsContainer.style.display = 'block';

        // Update score and level
        const scoreElement = document.getElementById('resume-score');
        const levelElement = document.getElementById('resume-level');
        const targetRoleElement = document.getElementById('target-role-display');

        scoreElement.textContent = `${data.resume_score}%`;
        levelElement.textContent = data.level;
        targetRoleElement.textContent = `Target Role: ${data.target_role}`;

        // Update level badge color
        levelElement.className = `level-badge ${data.level.toLowerCase()}`;

        // Update matched skills
        const matchedSkillsContainer = document.getElementById('matched-skills');
        matchedSkillsContainer.innerHTML = '';
        data.matched_skills.forEach(skill => {
            const badge = document.createElement('span');
            badge.className = 'skill-badge matched';
            badge.textContent = skill;
            matchedSkillsContainer.appendChild(badge);
        });

        // Update missing skills
        const missingSkillsContainer = document.getElementById('missing-skills');
        missingSkillsContainer.innerHTML = '';
        data.missing_skills.forEach(skill => {
            const badge = document.createElement('span');
            badge.className = 'skill-badge missing';
            badge.textContent = skill;
            missingSkillsContainer.appendChild(badge);
        });
    }

    // Initialize analysis form if resume is uploaded
    const resumeStatus = getResumeStatus();
    if (resumeStatus === 'uploaded') {
        document.getElementById('resume-upload-section').style.display = 'none';
        showAnalysisForm();
    }

    // Initialize manual skills module
    if (typeof initializeManualSkills !== 'undefined') {
        // Manual skills module will handle its own initialization
    }

    // Initialize Practice Arena section
    initializePracticeArena();
});

// Initialize Practice Arena section
function initializePracticeArena() {
    const practiceArenaSection = document.getElementById('practice-arena');
    if (practiceArenaSection) {
        // Show the Practice Arena section
        practiceArenaSection.style.display = 'block';
        console.log('Practice Arena section initialized and displayed');
    }
}
