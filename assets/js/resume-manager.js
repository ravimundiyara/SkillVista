// Resume & Skills Manager Module
// Handles resume upload and manual skill selection

document.addEventListener('DOMContentLoaded', () => {
    console.log('Resume & Skills Manager loaded');

    // DOM Elements
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    const uploadSuccess = document.getElementById('upload-success');
    const successMessage = document.getElementById('success-message');
    
    const skillsSearch = document.getElementById('skills-search');
    const skillsGrid = document.getElementById('skills-grid');
    const selectedSkillsList = document.getElementById('selected-skills-list');
    const skillsCount = document.getElementById('skills-count');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    
    const resumeManagerLink = document.getElementById('resume-manager-link');

    // State
    let selectedSkills = new Set();
    let uploadedResume = null;
    let skillLibrary = [];

    // Initialize
    initializeResumeManager();
    loadSkillLibrary();
    renderSkills();
    updateSkillsCount();
    updateAnalyzeButton();

    function initializeResumeManager() {
        // Highlight current page in sidebar
        if (resumeManagerLink) {
            resumeManagerLink.classList.add('active');
        }

        // Resume Upload Event Listeners
        setupResumeUpload();
        
        // Skills Event Listeners
        setupSkillsEvents();
    }

    function setupResumeUpload() {
        // Click to upload
        if (browseBtn && fileInput) {
            browseBtn.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', handleFileSelect);
        }

        // Drag and drop functionality
        if (dropArea) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, preventDefaults, false);
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                dropArea.addEventListener(eventName, highlight, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, unhighlight, false);
            });

            dropArea.addEventListener('drop', handleDrop, false);
        }
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        if (dropArea) {
            dropArea.classList.add('active');
        }
    }

    function unhighlight(e) {
        if (dropArea) {
            dropArea.classList.remove('active');
        }
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            
            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                showNotification('Please upload a PDF, DOC, or DOCX file.', 'error');
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('File size must be less than 5MB.', 'error');
                return;
            }

            // Store file reference
            uploadedResume = file;
            
            // Show success state
            showUploadSuccess(file.name);
            
            // Update analyze button
            updateAnalyzeButton();
            
            showNotification('Resume uploaded successfully!', 'success');
        }
    }

    function showUploadSuccess(fileName) {
        if (uploadSuccess && successMessage) {
            successMessage.textContent = `Resume "${fileName}" uploaded successfully!`;
            uploadSuccess.classList.add('show');
        }
    }

    function setupSkillsEvents() {
        // Search functionality
        if (skillsSearch) {
            skillsSearch.addEventListener('input', handleSkillsSearch);
        }

        // Clear all button
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', clearAllSkills);
        }

        // Analyze button
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', handleAnalyze);
        }
    }

    function loadSkillLibrary() {
        // Static skill library data - comprehensive list for search
        skillLibrary = [
            // Programming Languages
            "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go", "Rust",
            "Ruby", "PHP", "Swift", "Kotlin", "R", "MATLAB", "Scala", "Perl",
            
            // Web Technologies
            "HTML", "CSS", "Sass", "Less", "Bootstrap", "Tailwind CSS", "jQuery",
            "React", "Vue.js", "Angular", "Svelte", "Next.js", "Nuxt.js",
            
            // Backend Technologies
            "Node.js", "Express", "Django", "Flask", "Spring Boot", "ASP.NET",
            "Ruby on Rails", "Laravel", "FastAPI", "GraphQL", "REST APIs",
            
            // Databases
            "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle",
            "Microsoft SQL Server", "Cassandra", "Neo4j", "Elasticsearch",
            
            // Cloud & DevOps
            "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform",
            "Jenkins", "GitLab CI", "GitHub Actions", "Ansible", "Puppet", "Chef",
            
            // Tools & Platforms
            "Git", "GitHub", "GitLab", "VS Code", "IntelliJ IDEA", "Eclipse",
            "Postman", "Figma", "Sketch", "Adobe XD", "Jira", "Trello",
            
            // Data Science
            "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "Keras",
            "Jupyter", "Matplotlib", "Seaborn", "Plotly", "R Shiny", "Tableau",
            
            // Mobile Development
            "React Native", "Flutter", "Swift", "Kotlin", "Android", "iOS",
            "Xamarin", "Ionic", "Cordova", "Unity"
        ];
    }

    function renderSkills(searchQuery = '') {
        skillsGrid.innerHTML = '';

        // Show only popular skills when no search query
        const popularSkills = [
            "JavaScript", "HTML", "CSS", "React", "Git", "Python"
        ];

        const skillsToDisplay = searchQuery 
            ? skillLibrary.filter(skill => 
                skill.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : popularSkills;

        if (skillsToDisplay.length === 0) {
            skillsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    No skills found matching your search.
                </div>
            `;
            return;
        }

        skillsToDisplay.forEach(skill => {
            const skillChip = createSkillChip(skill);
            skillsGrid.appendChild(skillChip);
        });

        // Add hint for search when showing popular skills
        if (!searchQuery && skillsToDisplay.length > 0) {
            const hintDiv = document.createElement('div');
            hintDiv.className = 'empty-state';
            hintDiv.style.gridColumn = '1 / -1';
            hintDiv.style.fontSize = '0.85rem';
            hintDiv.style.marginTop = '10px';
            hintDiv.textContent = 'Tip: Start typing in the search box to see more skills';
            skillsGrid.appendChild(hintDiv);
        }
    }

    function createSkillChip(skillName) {
        const chip = document.createElement('div');
        chip.className = `skill-chip ${selectedSkills.has(skillName) ? 'selected' : ''}`;
        chip.textContent = skillName;
        
        chip.addEventListener('click', () => {
            toggleSkillSelection(skillName, chip);
        });

        return chip;
    }

    function toggleSkillSelection(skillName, chipElement) {
        if (selectedSkills.has(skillName)) {
            selectedSkills.delete(skillName);
            chipElement.classList.remove('selected');
        } else {
            // Limit to 50 skills maximum
            if (selectedSkills.size >= 50) {
                showNotification('Maximum 50 skills allowed.', 'warning');
                return;
            }
            
            selectedSkills.add(skillName);
            chipElement.classList.add('selected');
        }

        renderSelectedSkills();
        updateSkillsCount();
        updateAnalyzeButton();
    }

    function renderSelectedSkills() {
        selectedSkillsList.innerHTML = '';

        if (selectedSkills.size === 0) {
            selectedSkillsList.innerHTML = `
                <div class="empty-state">No skills selected yet</div>
            `;
            return;
        }

        Array.from(selectedSkills).sort().forEach(skill => {
            const skillPill = createSelectedSkillPill(skill);
            selectedSkillsList.appendChild(skillPill);
        });
    }

    function createSelectedSkillPill(skillName) {
        const pill = document.createElement('div');
        pill.className = 'selected-skill-pill';
        pill.innerHTML = `
            <span class="skill-name">${skillName}</span>
            <button type="button" class="remove-skill-btn" aria-label="Remove ${skillName}">
                ×
            </button>
        `;
        
        pill.querySelector('.remove-skill-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            selectedSkills.delete(skillName);
            
            // Update chip in grid
            const chips = skillsGrid.querySelectorAll('.skill-chip');
            chips.forEach(chip => {
                if (chip.textContent === skillName) {
                    chip.classList.remove('selected');
                }
            });
            
            renderSelectedSkills();
            updateSkillsCount();
            updateAnalyzeButton();
        });

        return pill;
    }

    function handleSkillsSearch(e) {
        const query = e.target.value.trim();
        renderSkills(query);
        
        // Update chip selection states based on current search
        const chips = skillsGrid.querySelectorAll('.skill-chip');
        chips.forEach(chip => {
            const skillName = chip.textContent;
            if (selectedSkills.has(skillName)) {
                chip.classList.add('selected');
            } else {
                chip.classList.remove('selected');
            }
        });
    }

    function clearAllSkills() {
        if (selectedSkills.size === 0) {
            showNotification('No skills to clear.', 'info');
            return;
        }

        if (confirm('Are you sure you want to clear all selected skills?')) {
            selectedSkills.clear();
            
            // Update all chips
            const chips = skillsGrid.querySelectorAll('.skill-chip');
            chips.forEach(chip => {
                chip.classList.remove('selected');
            });
            
            renderSelectedSkills();
            updateSkillsCount();
            updateAnalyzeButton();
            showNotification('All selected skills cleared.', 'info');
        }
    }

    function updateSkillsCount() {
        const count = selectedSkills.size;
        if (skillsCount) {
            skillsCount.textContent = `Your Skills (${count})`;
        }
    }

    function updateAnalyzeButton() {
        const hasSkills = selectedSkills.size > 0;
        const hasResume = uploadedResume !== null;
        
        if (analyzeBtn) {
            analyzeBtn.disabled = !(hasSkills || hasResume);
            
            const totalItems = selectedSkills.size + (hasResume ? 1 : 0);
            const buttonText = hasSkills || hasResume 
                ? `Analyze My Skills (${totalItems} selected)`
                : 'Analyze My Skills (0 selected)';
            
            analyzeBtn.innerHTML = `
                <i class="fas fa-sparkles analyze-icon"></i>
                ${buttonText}
            `;
        }
    }

    function handleAnalyze() {
        // Collect data for analysis
        const analysisData = {
            resume: uploadedResume,
            manualSkills: Array.from(selectedSkills),
            timestamp: new Date().toISOString()
        };

        console.log('Analysis Data:', analysisData);

        // Show processing state
        if (analyzeBtn) {
            const originalText = analyzeBtn.innerHTML;
            analyzeBtn.innerHTML = `
                <i class="fas fa-spinner fa-spin analyze-icon"></i>
                Analyzing...
            `;
            analyzeBtn.disabled = true;
        }

        // Simulate analysis processing
        setTimeout(() => {
            showNotification('Analysis complete! Redirecting to results...', 'success');
            
            // In a real application, this would redirect to analysis results
            // For now, we'll just reset the button state
            if (analyzeBtn) {
                analyzeBtn.innerHTML = `
                    <i class="fas fa-sparkles analyze-icon"></i>
                    Analyze My Skills (${selectedSkills.size + (uploadedResume ? 1 : 0)} selected)
                `;
                analyzeBtn.disabled = !(selectedSkills.size > 0 || uploadedResume !== null);
            }
        }, 2000);
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    console.log('Resume & Skills Manager initialized successfully');
});