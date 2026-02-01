// Manual Skills Management Module
// Handles the manual skill input feature for the dashboard

document.addEventListener('DOMContentLoaded', () => {
    console.log('Manual Skills Module loaded');

    // DOM Elements
    const addSkillsBtn = document.getElementById('add-skills-btn');
    const manualSkillsModal = document.getElementById('manual-skills-modal');
    const closeModalBtn = document.getElementById('close-manual-skills-modal');
    const skillSearchInput = document.getElementById('skill-search');
    const selectedSkillsContainer = document.getElementById('selected-skills');
    const saveSkillsBtn = document.getElementById('save-manual-skills');
    const clearSkillsBtn = document.getElementById('clear-manual-skills');
    const skillLibraryContainer = document.getElementById('skill-library');
    
    // State
    let skillLibrary = {};
    let selectedSkills = new Set();
    let filteredSkills = [];
    let currentUserId = 'default_user'; // In production, get from session/auth

    // Initialize manual skills module
    if (addSkillsBtn && manualSkillsModal) {
        initializeManualSkills();
    } else {
        console.warn('Manual skills elements not found:', {
            addSkillsBtn: !!addSkillsBtn,
            manualSkillsModal: !!manualSkillsModal
        });
        
        // Fallback: create modal if it doesn't exist
        if (!manualSkillsModal) {
            createManualSkillsModal();
        }
    }

    async function initializeManualSkills() {
        try {
            // Load skill library with static data (no backend dependency)
            loadStaticSkillLibrary();
            
            // Load existing manual skills from localStorage
            loadExistingManualSkills();
            
            // Setup event listeners
            setupEventListeners();
            
            // Render initial UI
            renderSkillLibrary();
            renderSelectedSkills();
            
            // Update dashboard display with current skills
            updateDashboardManualSkillsDisplay();
            
        } catch (error) {
            console.error('Error initializing manual skills:', error);
            showNotification('Error loading skill library. Please try again.', 'error');
        }
    }

    function loadStaticSkillLibrary() {
        // Static skill library data (no backend dependency)
        skillLibrary = {
            "Programming Languages": [
                "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go", "Rust", 
                "Ruby", "PHP", "Swift", "Kotlin", "R", "MATLAB", "Scala", "Perl"
            ],
            "Web Technologies": [
                "HTML", "CSS", "Sass", "Less", "Bootstrap", "Tailwind CSS", "jQuery", 
                "React", "Vue.js", "Angular", "Svelte", "Next.js", "Nuxt.js"
            ],
            "Backend Technologies": [
                "Node.js", "Express", "Django", "Flask", "Spring Boot", "ASP.NET", 
                "Ruby on Rails", "Laravel", "FastAPI", "GraphQL", "REST APIs"
            ],
            "Databases": [
                "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", 
                "Microsoft SQL Server", "Cassandra", "Neo4j", "Elasticsearch"
            ],
            "Cloud & DevOps": [
                "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform", 
                "Jenkins", "GitLab CI", "GitHub Actions", "Ansible", "Puppet", "Chef"
            ],
            "Tools & Platforms": [
                "Git", "GitHub", "GitLab", "VS Code", "IntelliJ IDEA", "Eclipse", 
                "Postman", "Figma", "Sketch", "Adobe XD", "Jira", "Trello"
            ],
            "Data Science": [
                "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "Keras", 
                "Jupyter", "Matplotlib", "Seaborn", "Plotly", "R Shiny", "Tableau"
            ],
            "Mobile Development": [
                "React Native", "Flutter", "Swift", "Kotlin", "Android", "iOS", 
                "Xamarin", "Ionic", "Cordova", "Unity"
            ]
        };
        
        console.log(`Loaded ${Object.values(skillLibrary).flat().length} skills in ${Object.keys(skillLibrary).length} categories`);
    }

    function loadExistingManualSkills() {
        try {
            const savedSkills = localStorage.getItem('manual_skills');
            if (savedSkills) {
                const skillsArray = JSON.parse(savedSkills);
                selectedSkills = new Set(skillsArray);
                console.log(`Loaded ${skillsArray.length} existing manual skills from localStorage`);
            } else {
                console.log('No existing manual skills found in localStorage');
            }
        } catch (error) {
            console.error('Error loading existing manual skills:', error);
            // Continue without existing skills
        }
    }

    function setupEventListeners() {
        // Modal triggers
        if (addSkillsBtn) {
            addSkillsBtn.addEventListener('click', openManualSkillsModal);
        }
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeManualSkillsModal);
        }
        
        // Close modal when clicking outside
        if (manualSkillsModal) {
            manualSkillsModal.addEventListener('click', (e) => {
                if (e.target === manualSkillsModal) {
                    closeManualSkillsModal();
                }
            });
        }

        // Search functionality
        if (skillSearchInput) {
            skillSearchInput.addEventListener('input', handleSkillSearch);
        }
        
        // Buttons
        if (saveSkillsBtn) {
            saveSkillsBtn.addEventListener('click', saveManualSkills);
        }
        if (clearSkillsBtn) {
            clearSkillsBtn.addEventListener('click', clearSelectedSkills);
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && manualSkillsModal && manualSkillsModal.classList.contains('show')) {
                closeManualSkillsModal();
            }
        });
    }

    function openManualSkillsModal() {
        manualSkillsModal.classList.add('show');
        manualSkillsModal.setAttribute('aria-hidden', 'false');
        
        // Focus search input
        setTimeout(() => {
            skillSearchInput.focus();
        }, 100);
    }

    function closeManualSkillsModal() {
        manualSkillsModal.classList.remove('show');
        manualSkillsModal.setAttribute('aria-hidden', 'true');
    }

    function handleSkillSearch() {
        const query = skillSearchInput.value.trim().toLowerCase();
        
        if (!query) {
            filteredSkills = [];
            renderSkillLibrary();
            return;
        }

        // Search skills
        const searchResults = [];
        Object.entries(skillLibrary).forEach(([category, skills]) => {
            const matchingSkills = skills.filter(skill => 
                skill.toLowerCase().includes(query)
            );
            
            if (matchingSkills.length > 0) {
                searchResults.push({
                    category: category,
                    skills: matchingSkills
                });
            }
        });

        filteredSkills = searchResults;
        renderSkillLibrary();
    }

    function renderSkillLibrary() {
        skillLibraryContainer.innerHTML = '';
        
        const categoriesToRender = filteredSkills.length > 0 ? filteredSkills : 
            Object.entries(skillLibrary).map(([category, skills]) => ({ category, skills }));

        if (categoriesToRender.length === 0) {
            skillLibraryContainer.innerHTML = `
                <div class="no-skills-found">
                    <p>No skills found matching your search.</p>
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('skill-search').value=''; handleSkillSearch()">
                        Clear Search
                    </button>
                </div>
            `;
            return;
        }

        categoriesToRender.forEach(categoryData => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skill-category';
            
            const categoryHeader = document.createElement('h4');
            categoryHeader.className = 'skill-category-header';
            categoryHeader.textContent = categoryData.category;
            categoryDiv.appendChild(categoryHeader);

            const skillsGrid = document.createElement('div');
            skillsGrid.className = 'skills-grid';

            categoryData.skills.forEach(skill => {
                const skillChip = createSkillChip(skill, selectedSkills.has(skill));
                skillsGrid.appendChild(skillChip);
            });

            categoryDiv.appendChild(skillsGrid);
            skillLibraryContainer.appendChild(categoryDiv);
        });
    }

    function createSkillChip(skillName, isSelected) {
        const chip = document.createElement('div');
        chip.className = `skill-chip ${isSelected ? 'selected' : ''}`;
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
        updateSaveButtonState();
    }

    function renderSelectedSkills() {
        selectedSkillsContainer.innerHTML = '';
        
        if (selectedSkills.size === 0) {
            selectedSkillsContainer.innerHTML = `
                <div class="empty-selected">
                    <p>No skills selected yet.</p>
                    <p class="hint">Search for skills above and click to add them.</p>
                </div>
            `;
            updateSaveButtonState();
            return;
        }

        const skillsList = document.createElement('div');
        skillsList.className = 'selected-skills-list';

        Array.from(selectedSkills).sort().forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'selected-skill-tag';
            skillTag.innerHTML = `
                <span class="skill-name">${skill}</span>
                <button type="button" class="remove-skill-btn" aria-label="Remove ${skill}">
                    ×
                </button>
            `;
            
            skillTag.querySelector('.remove-skill-btn').addEventListener('click', () => {
                selectedSkills.delete(skill);
                renderSkillLibrary(); // Re-render to update selection state
                renderSelectedSkills();
                updateSaveButtonState();
            });

            skillsList.appendChild(skillTag);
        });

        selectedSkillsContainer.appendChild(skillsList);
        updateSaveButtonState();
    }

    function updateSaveButtonState() {
        const hasChanges = selectedSkills.size > 0;
        saveSkillsBtn.disabled = !hasChanges;
        
        const countText = selectedSkills.size > 0 ? ` (${selectedSkills.size})` : '';
        saveSkillsBtn.innerHTML = `Save Skills${countText}`;
    }

    async function saveManualSkills() {
        if (selectedSkills.size === 0) {
            showNotification('Please select at least one skill to save.', 'warning');
            return;
        }

        try {
            saveSkillsBtn.disabled = true;
            saveSkillsBtn.textContent = 'Saving...';

            // Save to localStorage (no backend dependency)
            localStorage.setItem('manual_skills', JSON.stringify(Array.from(selectedSkills)));
            
            // Update dashboard display
            updateDashboardManualSkillsDisplay();
            
            showNotification(`Successfully saved ${selectedSkills.size} skills!`, 'success');
            closeManualSkillsModal();
                
        } catch (error) {
            console.error('Error saving manual skills:', error);
            showNotification('Error saving skills. Please try again.', 'error');
        } finally {
            saveSkillsBtn.disabled = false;
            saveSkillsBtn.textContent = 'Save Skills';
        }
    }

    function clearSelectedSkills() {
        if (selectedSkills.size === 0) {
            showNotification('No skills to clear.', 'info');
            return;
        }

        if (confirm('Are you sure you want to clear all selected skills?')) {
            selectedSkills.clear();
            renderSkillLibrary();
            renderSelectedSkills();
            updateSaveButtonState();
            showNotification('All selected skills cleared.', 'info');
        }
    }

    function updateDashboardManualSkillsDisplay() {
        // Update the dashboard to show manual skills
        const manualSkillsSection = document.getElementById('manual-skills-section');
        const skillsCount = document.getElementById('skills-count');
        
        if (skillsCount) {
            const count = selectedSkills.size;
            skillsCount.textContent = `${count} skill${count !== 1 ? 's' : ''} added`;
        }
        
        if (manualSkillsSection) {
            if (selectedSkills.size === 0) {
                manualSkillsSection.innerHTML = `
                    <div class="manual-skills-display">
                        <p class="no-manual-skills">No manual skills added yet.</p>
                    </div>
                `;
            } else {
                manualSkillsSection.innerHTML = `
                    <div class="manual-skills-display">
                        <h4>Manually Added Skills</h4>
                        <div class="manual-skills-list">
                            ${Array.from(selectedSkills).sort().map(skill => 
                                `<span class="manual-skill-badge">${skill}</span>`
                            ).join('')}
                        </div>
                    </div>
                `;
            }
        }
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

    // Expose functions globally for inline event handlers
    window.handleSkillSearch = handleSkillSearch;

    // Create modal if it doesn't exist
    function createManualSkillsModal() {
        const modal = document.createElement('div');
        modal.id = 'manual-skills-modal';
        modal.className = 'manual-skills-modal';
        modal.innerHTML = `
            <div class="manual-skills-modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-plus-circle"></i> Add Skills Manually</h3>
                    <button type="button" class="close-manual-skills-modal" id="close-manual-skills-modal" aria-label="Close">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <div class="skill-library">
                        <div class="searchable-dropdown">
                            <input type="text" id="skill-search" placeholder="Search skills...">
                            <div class="dropdown-results" id="skill-search-results"></div>
                        </div>
                        <div id="skill-library" class="skills-container">
                            <!-- Skills will be loaded here -->
                        </div>
                    </div>
                    <div class="selected-skills-panel">
                        <h4 class="selected-skills-header">Selected Skills</h4>
                        <div id="selected-skills" class="selected-skills-list">
                            <!-- Selected skills will be shown here -->
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="clear-manual-skills">
                        Clear All
                    </button>
                    <button type="button" class="btn btn-primary" id="save-manual-skills">
                        Save Skills
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Re-initialize with new modal
        const newModal = document.getElementById('manual-skills-modal');
        if (newModal) {
            initializeManualSkills();
        }
    }

    console.log('Manual Skills Module initialized successfully');
});
