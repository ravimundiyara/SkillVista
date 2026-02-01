// Job Role Autocomplete Module
// Handles searchable dropdown for target role selection

document.addEventListener('DOMContentLoaded', () => {
    console.log('Job Role Autocomplete Module loaded');

    // DOM Elements
    const targetRoleSearch = document.getElementById('target-role-search');
    const roleSearchResults = document.getElementById('role-search-results');
    const targetRoleInput = document.getElementById('target-role');
    const analyzeResumeBtn = document.getElementById('analyze-resume-btn');
    const analyzeManualBtn = document.getElementById('analyze-manual-skills-btn');

    // State
    let selectedTargetRole = '';
    let isRoleSelected = false;

    // Initialize if elements exist
    if (targetRoleSearch && roleSearchResults) {
        initializeJobRoleAutocomplete();
    }

    function initializeJobRoleAutocomplete() {
        // Load job roles
        loadJobRoles();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initial state
        updateAnalysisButtons();
    }

    function loadJobRoles() {
        // Job roles are loaded from job-roles.js
        if (typeof JOB_ROLES === 'undefined') {
            console.warn('JOB_ROLES not loaded, using fallback roles');
            window.JOB_ROLES = [
                "Software Engineer", "Frontend Developer", "Backend Developer", 
                "Full Stack Developer", "Web Developer", "Data Scientist", 
                "Product Manager", "Project Manager", "Business Analyst"
            ];
        }
    }

    function setupEventListeners() {
        // Search input events
        if (targetRoleSearch) {
            targetRoleSearch.addEventListener('input', handleRoleSearch);
            targetRoleSearch.addEventListener('focus', handleRoleSearch);
            targetRoleSearch.addEventListener('blur', () => {
                // Hide results after small delay to allow click
                setTimeout(() => {
                    if (roleSearchResults) {
                        roleSearchResults.style.display = 'none';
                    }
                }, 200);
            });
            
            // Keyboard navigation
            targetRoleSearch.addEventListener('keydown', handleKeyDown);
        }

        // Analyze buttons
        if (analyzeResumeBtn) {
            analyzeResumeBtn.addEventListener('click', validateAndAnalyze);
        }
        if (analyzeManualBtn) {
            analyzeManualBtn.addEventListener('click', validateAndAnalyze);
        }

        // Click outside to close dropdown
        document.addEventListener('click', (e) => {
            if (targetRoleSearch && !targetRoleSearch.contains(e.target) && 
                roleSearchResults && !roleSearchResults.contains(e.target)) {
                if (roleSearchResults) {
                    roleSearchResults.style.display = 'none';
                }
            }
        });
    }

    function handleRoleSearch(e) {
        const query = e.target.value.trim().toLowerCase();
        
        if (!query) {
            hideRoleResults();
            return;
        }

        const matchingRoles = JOB_ROLES.filter(role => 
            role.toLowerCase().includes(query)
        );

        if (matchingRoles.length > 0) {
            showRoleResults(matchingRoles, query);
        } else {
            showNoResults();
        }
    }

    function showRoleResults(roles, query) {
        if (!roleSearchResults) return;

        roleSearchResults.innerHTML = '';
        roleSearchResults.style.display = 'block';

        roles.forEach(role => {
            const roleItem = document.createElement('div');
            roleItem.className = 'dropdown-item';
            roleItem.innerHTML = highlightMatch(role, query);
            roleItem.addEventListener('click', () => selectRole(role));
            roleSearchResults.appendChild(roleItem);
        });
    }

    function showNoResults() {
        if (!roleSearchResults) return;

        roleSearchResults.innerHTML = `
            <div class="dropdown-item">
                <span class="role-category">No matching roles found</span>
            </div>
        `;
        roleSearchResults.style.display = 'block';
    }

    function hideRoleResults() {
        if (roleSearchResults) {
            roleSearchResults.style.display = 'none';
        }
    }

    function highlightMatch(role, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return role.replace(regex, '<strong>$1</strong>');
    }

    function selectRole(role) {
        selectedTargetRole = role;
        isRoleSelected = true;
        
        if (targetRoleSearch) {
            targetRoleSearch.value = role;
        }
        if (targetRoleInput) {
            targetRoleInput.value = role;
        }
        
        hideRoleResults();
        updateAnalysisButtons();
        
        console.log('Job Role Selected:', role);
        
        // Show success feedback
        showRoleSelectionFeedback(role);
    }

    function handleKeyDown(e) {
        if (!roleSearchResults || roleSearchResults.style.display !== 'block') {
            return;
        }

        const items = roleSearchResults.querySelectorAll('.dropdown-item:not(:empty)');
        
        if (items.length === 0) return;

        let currentIndex = Array.from(items).findIndex(item => 
            item.classList.contains('selected')
        );

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = (currentIndex + 1) % items.length;
                updateSelection(items, currentIndex);
                break;
            case 'ArrowUp':
                e.preventDefault();
                currentIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
                updateSelection(items, currentIndex);
                break;
            case 'Enter':
                e.preventDefault();
                if (currentIndex >= 0) {
                    const selectedRole = items[currentIndex].textContent;
                    selectRole(selectedRole);
                }
                break;
            case 'Escape':
                hideRoleResults();
                break;
        }
    }

    function updateSelection(items, index) {
        items.forEach(item => item.classList.remove('selected'));
        if (items[index]) {
            items[index].classList.add('selected');
        }
    }

    function validateAndAnalyze(e) {
        // Check if role is selected
        if (!isRoleSelected && !selectedTargetRole) {
            e.preventDefault();
            showValidationError('Please select a target role from the suggestions list.');
            return false;
        }

        console.log('Analysis Triggered with Role:', selectedTargetRole);
        
        // Role is valid, allow analysis to proceed
        return true;
    }

    function showValidationError(message) {
        // Remove existing error if any
        const existingError = document.querySelector('.role-validation-error');
        if (existingError) {
            existingError.remove();
        }

        // Create error element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'role-validation-error';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.style.fontWeight = '600';
        errorDiv.textContent = message;

        // Add to form
        const formGroup = targetRoleSearch ? targetRoleSearch.closest('.form-group') : null;
        if (formGroup) {
            formGroup.appendChild(errorDiv);
        }

        console.log('Validation Error:', message);
    }

    function showRoleSelectionFeedback(role) {
        // Remove existing feedback
        const existingFeedback = document.querySelector('.role-selection-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Create feedback element
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'role-selection-feedback';
        feedbackDiv.style.color = '#28a745';
        feedbackDiv.style.fontSize = '0.85rem';
        feedbackDiv.style.marginTop = '5px';
        feedbackDiv.style.fontWeight = '600';
        feedbackDiv.innerHTML = `<i class="fas fa-check-circle"></i> Role selected: ${role}`;

        // Add to form
        const formGroup = targetRoleSearch ? targetRoleSearch.closest('.form-group') : null;
        if (formGroup) {
            formGroup.appendChild(feedbackDiv);
        }

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (feedbackDiv.parentNode) {
                feedbackDiv.remove();
            }
        }, 3000);
    }

    function updateAnalysisButtons() {
        const canAnalyze = isRoleSelected || selectedTargetRole;
        
        if (analyzeResumeBtn) {
            analyzeResumeBtn.disabled = !canAnalyze;
            if (!canAnalyze) {
                analyzeResumeBtn.style.opacity = '0.5';
            } else {
                analyzeResumeBtn.style.opacity = '1';
            }
        }
        
        if (analyzeManualBtn) {
            analyzeManualBtn.disabled = !canAnalyze;
            if (!canAnalyze) {
                analyzeManualBtn.style.opacity = '0.5';
            } else {
                analyzeManualBtn.style.opacity = '1';
            }
        }
    }

    // Expose functions globally for other modules
    window.JobRoleAutocomplete = {
        selectRole: selectRole,
        getSelectedRole: () => selectedTargetRole,
        isRoleSelected: () => isRoleSelected,
        clearSelection: () => {
            selectedTargetRole = '';
            isRoleSelected = false;
            if (targetRoleSearch) targetRoleSearch.value = '';
            if (targetRoleInput) targetRoleInput.value = '';
            updateAnalysisButtons();
        }
    };

    console.log('Job Role Autocomplete Module initialized successfully');
});