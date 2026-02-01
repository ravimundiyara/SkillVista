// Skill Analysis Module
// Handles skill analysis for both resume-based and manual skill input

document.addEventListener('DOMContentLoaded', () => {
    console.log('Skill Analysis Module loaded');

    // DOM Elements
    const analyzeResumeBtn = document.getElementById('analyze-resume-btn');
    const analyzeManualBtn = document.getElementById('analyze-manual-skills-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    
    const analysisFormContainer = document.getElementById('analysis-form-container');
    const analysisResultsContainer = document.getElementById('analysis-results-container');
    const analysisMessage = document.getElementById('analysis-message');
    
    const resumeScore = document.getElementById('resume-score');
    const resumeLevel = document.getElementById('resume-level');
    const targetRoleDisplay = document.getElementById('target-role-display');
    const matchedSkillsList = document.getElementById('matched-skills');
    const missingSkillsList = document.getElementById('missing-skills');

    // State
    let analysisData = null;

    // Initialize if elements exist
    if (analyzeResumeBtn || analyzeManualBtn || analyzeBtn) {
        initializeSkillAnalysis();
    }

    function initializeSkillAnalysis() {
        // Setup event listeners
        setupEventListeners();
        
        console.log('Skill Analysis Module initialized successfully');
    }

    function setupEventListeners() {
        // Dashboard analyze buttons
        if (analyzeResumeBtn) {
            analyzeResumeBtn.addEventListener('click', handleResumeAnalysis);
        }
        
        if (analyzeManualBtn) {
            analyzeManualBtn.addEventListener('click', handleManualSkillsAnalysis);
        }

        // Resume Manager analyze button
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', handleResumeManagerAnalysis);
        }
    }

    function handleResumeAnalysis(e) {
        e.preventDefault();
        
        console.log('Resume Analysis Triggered');
        
        // Check if role is selected
        if (!window.JobRoleAutocomplete || !window.JobRoleAutocomplete.isRoleSelected()) {
            showValidationError('Please select a target role from the suggestions list.');
            return;
        }

        const selectedRole = window.JobRoleAutocomplete.getSelectedRole();
        
        // Simulate resume analysis (since we don't have backend)
        simulateResumeAnalysis(selectedRole);
    }

    function handleManualSkillsAnalysis(e) {
        e.preventDefault();
        
        console.log('Manual Skills Analysis Triggered');
        
        // Check if role is selected
        if (!window.JobRoleAutocomplete || !window.JobRoleAutocomplete.isRoleSelected()) {
            showValidationError('Please select a target role from the suggestions list.');
            return;
        }

        const selectedRole = window.JobRoleAutocomplete.getSelectedRole();
        
        // Get manual skills from localStorage
        const manualSkills = JSON.parse(localStorage.getItem('manual_skills') || '[]');
        
        if (manualSkills.length === 0) {
            showValidationError('Please add some skills manually before analyzing.');
            return;
        }

        simulateManualSkillsAnalysis(selectedRole, manualSkills);
    }

    function handleResumeManagerAnalysis(e) {
        e.preventDefault();
        
        console.log('Resume Manager Analysis Triggered');
        
        // Get data from resume manager
        const resumeManagerData = getResumeManagerData();
        
        if (!resumeManagerData.hasData) {
            showValidationError('Please upload a resume or add some skills before analyzing.');
            return;
        }

        // For now, use a default role if none selected
        const selectedRole = window.JobRoleAutocomplete && window.JobRoleAutocomplete.isRoleSelected() 
            ? window.JobRoleAutocomplete.getSelectedRole() 
            : 'Software Engineer';

        simulateCombinedAnalysis(selectedRole, resumeManagerData);
    }

    function getResumeManagerData() {
        // Get uploaded resume
        const hasResume = window.uploadedResume !== null;
        
        // Get manual skills
        const manualSkills = Array.from(window.selectedSkills || new Set());
        
        return {
            hasData: hasResume || manualSkills.length > 0,
            hasResume: hasResume,
            manualSkills: manualSkills,
            resumeName: hasResume ? window.uploadedResume.name : null
        };
    }

    function simulateResumeAnalysis(targetRole) {
        console.log('Simulating Resume Analysis for:', targetRole);
        
        // Mock analysis data based on target role
        const analysisResult = generateMockAnalysis(targetRole, []);
        
        // Display results
        displayAnalysisResults(targetRole, analysisResult);
        
        // Update UI state
        showAnalysisResults();
    }

    function simulateManualSkillsAnalysis(targetRole, manualSkills) {
        console.log('Simulating Manual Skills Analysis for:', targetRole);
        
        // Mock analysis data based on manual skills
        const analysisResult = generateMockAnalysis(targetRole, manualSkills);
        
        // Display results
        displayAnalysisResults(targetRole, analysisResult);
        
        // Update UI state
        showAnalysisResults();
    }

    function simulateCombinedAnalysis(targetRole, resumeManagerData) {
        console.log('Simulating Combined Analysis for:', targetRole);
        
        // Combine resume and manual skills
        const combinedSkills = resumeManagerData.manualSkills;
        if (resumeManagerData.hasResume) {
            // Add some mock resume skills
            combinedSkills.push('Communication', 'Problem Solving', 'Teamwork');
        }
        
        const analysisResult = generateMockAnalysis(targetRole, combinedSkills);
        
        // Display results
        displayAnalysisResults(targetRole, analysisResult);
        
        // Update UI state
        showAnalysisResults();
    }

    function generateMockAnalysis(targetRole, userSkills) {
        // Define required skills for different roles
        const roleRequirements = {
            'Software Engineer': ['JavaScript', 'Python', 'Git', 'Testing', 'Algorithms', 'Data Structures', 'OOP'],
            'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Git', 'Responsive Design'],
            'Backend Developer': ['Node.js', 'Python', 'Database', 'API', 'Git', 'Testing', 'Security'],
            'Data Scientist': ['Python', 'Statistics', 'Machine Learning', 'SQL', 'Data Analysis', 'Visualization'],
            'Product Manager': ['Project Management', 'Communication', 'Analytics', 'User Research', 'Strategy'],
            'Web Developer': ['HTML', 'CSS', 'JavaScript', 'Git', 'Responsive Design', 'Testing']
        };

        // Get required skills for the target role
        const requiredSkills = roleRequirements[targetRole] || roleRequirements['Software Engineer'];
        
        // Find matching skills
        const matchedSkills = userSkills.filter(skill => 
            requiredSkills.some(reqSkill => 
                reqSkill.toLowerCase() === skill.toLowerCase() ||
                skill.toLowerCase().includes(reqSkill.toLowerCase()) ||
                reqSkill.toLowerCase().includes(skill.toLowerCase())
            )
        );

        // Find missing skills
        const missingSkills = requiredSkills.filter(reqSkill => 
            !userSkills.some(skill => 
                skill.toLowerCase() === reqSkill.toLowerCase() ||
                skill.toLowerCase().includes(reqSkill.toLowerCase()) ||
                reqSkill.toLowerCase().includes(skill.toLowerCase())
            )
        );

        // Calculate score
        const score = Math.round((matchedSkills.length / requiredSkills.length) * 100);
        
        // Determine level
        let level = 'Beginner';
        if (score >= 80) level = 'Advanced';
        else if (score >= 60) level = 'Intermediate';

        return {
            score: score,
            level: level,
            matchedSkills: matchedSkills,
            missingSkills: missingSkills,
            requiredSkills: requiredSkills
        };
    }

    function displayAnalysisResults(targetRole, analysisResult) {
        console.log('Displaying Analysis Results:', analysisResult);
        
        // Update score and level
        if (resumeScore) {
            resumeScore.textContent = `${analysisResult.score}%`;
        }
        
        if (resumeLevel) {
            resumeLevel.textContent = analysisResult.level;
            resumeLevel.className = `level-badge ${analysisResult.level.toLowerCase()}`;
        }
        
        if (targetRoleDisplay) {
            targetRoleDisplay.textContent = `Target Role: ${targetRole}`;
        }

        // Update matched skills
        if (matchedSkillsList) {
            if (analysisResult.matchedSkills.length > 0) {
                matchedSkillsList.innerHTML = analysisResult.matchedSkills.map(skill => 
                    `<span class="skill-badge matched">${skill}</span>`
                ).join('');
            } else {
                matchedSkillsList.innerHTML = '<span class="skill-badge matched">No matching skills found</span>';
            }
        }

        // Update missing skills
        if (missingSkillsList) {
            if (analysisResult.missingSkills.length > 0) {
                missingSkillsList.innerHTML = analysisResult.missingSkills.map(skill => 
                    `<span class="skill-badge missing">${skill}</span>`
                ).join('');
            } else {
                missingSkillsList.innerHTML = '<span class="skill-badge missing">All required skills covered!</span>';
            }
        }

        // Store analysis data
        analysisData = {
            targetRole: targetRole,
            ...analysisResult,
            timestamp: new Date().toISOString()
        };

        // Show success notification
        showNotification(`Analysis complete! You're ${analysisResult.score}% ready for ${targetRole}.`, 'success');
    }

    function showAnalysisResults() {
        if (analysisFormContainer) {
            analysisFormContainer.style.display = 'none';
        }
        
        if (analysisResultsContainer) {
            analysisResultsContainer.style.display = 'block';
        }
        
        if (analysisMessage) {
            analysisMessage.style.display = 'none';
        }
    }

    function showValidationError(message) {
        // Remove existing error if any
        const existingError = document.querySelector('.analysis-validation-error');
        if (existingError) {
            existingError.remove();
        }

        // Create error element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'analysis-validation-error';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '10px';
        errorDiv.style.fontWeight = '600';
        errorDiv.style.textAlign = 'center';
        errorDiv.textContent = message;

        // Add to appropriate container
        const container = analysisFormContainer || document.querySelector('.resume-status-content');
        if (container) {
            container.appendChild(errorDiv);
        }

        console.log('Analysis Validation Error:', message);
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    // Expose functions globally for other modules
    window.SkillAnalysis = {
        analyze: (targetRole, skills) => {
            const analysisResult = generateMockAnalysis(targetRole, skills);
            displayAnalysisResults(targetRole, analysisResult);
            showAnalysisResults();
            return analysisResult;
        },
        getAnalysisData: () => analysisData,
        clearResults: () => {
            if (analysisFormContainer) {
                analysisFormContainer.style.display = 'block';
            }
            if (analysisResultsContainer) {
                analysisResultsContainer.style.display = 'none';
            }
            if (analysisMessage) {
                analysisMessage.style.display = 'block';
            }
        }
    };

    console.log('Skill Analysis Module initialized successfully');
});