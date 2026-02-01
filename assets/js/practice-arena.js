/**
 * Practice Arena Section - JavaScript
 * Modern ES6+ implementation for the coding challenge platform
 */

/**
 * Practice Arena Class
 * Modern class-based approach for the Practice Arena functionality
 */
class PracticeArena {
    constructor() {
        // DOM Elements
        this.statsGrid = document.getElementById('stats-grid');
        this.searchInput = document.getElementById('search-input');
        this.difficultyFilters = document.querySelectorAll('.difficulty-filter');
        this.skillTags = document.querySelectorAll('.skill-tag');
        this.tableBody = document.querySelector('.table-body');
        this.timerElement = document.getElementById('timer-value');
        this.startBtn = document.getElementById('start-btn');
        
        // State Management
        this.userStats = {
            solved: 4,
            total: 8,
            easy: 2,
            medium: 1,
            hard: 1,
            credits: 2450
        };
        
        this.solvedProblems = ['two-sum', 'valid-parentheses'];
        
        this.currentFilters = {
            difficulty: 'all',
            skill: 'all',
            search: ''
        };
        
        // Initialize
        this.init();
    }

    /**
     * Initialize the Practice Arena
     */
    init() {
        if (!this.validateDOMElements()) {
            console.warn('Practice Arena elements not found. Waiting for DOM...');
            this.waitForDOM().then(() => this.init());
            return;
        }
        
        console.log('Practice Arena elements found, initializing...');
        this.renderStats();
        this.renderProblems();
        this.setupEventListeners();
        this.startTimer();
    }

    /**
     * Validate DOM elements exist
     */
    validateDOMElements() {
        return this.statsGrid && this.searchInput && this.tableBody && 
               this.timerElement && this.startBtn;
    }

    /**
     * Wait for DOM to be ready
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Render statistics cards
     */
    renderStats() {
        const stats = [
            {
                label: 'Problems Solved',
                value: `${this.userStats.solved}/${this.userStats.total}`,
                icon: 'fa-check-circle'
            },
            {
                label: 'Easy',
                value: this.userStats.easy,
                icon: 'fa-circle'
            },
            {
                label: 'Medium',
                value: this.userStats.medium,
                icon: 'fa-circle'
            },
            {
                label: 'Hard',
                value: this.userStats.hard,
                icon: 'fa-circle'
            },
            {
                label: 'Total Credits',
                value: this.userStats.credits.toLocaleString(),
                icon: 'fa-trophy'
            }
        ];

        this.statsGrid.innerHTML = stats.map(stat => `
            <div class="stat-card">
                <div class="stat-value">${stat.value}</div>
                <div class="stat-label">${stat.label}</div>
                <i class="fas ${stat.icon} stat-icon"></i>
            </div>
        `).join('');
    }

    /**
     * Render problems table
     */
    renderProblems() {
        const filteredProblems = this.getFilteredProblems();
        
        if (filteredProblems.length === 0) {
            this.tableBody.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    No problems found matching your criteria.
                </div>
            `;
            return;
        }

        this.tableBody.innerHTML = filteredProblems.map(problem => `
            <div class="problem-row ${this.solvedProblems.includes(problem.id) ? 'solved' : ''}">
                <div class="status-cell">
                    <div class="status-icon ${this.solvedProblems.includes(problem.id) ? 'solved' : ''}">
                        ${this.solvedProblems.includes(problem.id) ? '<i class="fas fa-check"></i>' : ''}
                    </div>
                </div>
                <div>
                    <div class="problem-name">${problem.name}</div>
                    <div class="problem-desc">${problem.description}</div>
                </div>
                <div>
                    <span class="skill-badge">${problem.skill}</span>
                </div>
                <div>
                    <span class="difficulty-badge difficulty-${problem.difficulty}">${problem.difficulty}</span>
                </div>
                <div class="credits-cell">
                    <i class="fas fa-trophy credits-icon"></i>
                    ${problem.credits}
                </div>
            </div>
        `).join('');
    }

    /**
     * Get filtered problems based on current filters
     */
    getFilteredProblems() {
        return problemsData.filter(problem => {
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search.toLowerCase();
                const matchesSearch = problem.name.toLowerCase().includes(searchTerm) ||
                                    problem.description.toLowerCase().includes(searchTerm) ||
                                    problem.skill.toLowerCase().includes(searchTerm);
                if (!matchesSearch) return false;
            }

            // Difficulty filter
            if (this.currentFilters.difficulty !== 'all') {
                if (problem.difficulty !== this.currentFilters.difficulty) return false;
            }

            // Skill filter
            if (this.currentFilters.skill !== 'all') {
                if (problem.skill.toLowerCase() !== this.currentFilters.skill.toLowerCase()) return false;
            }

            return true;
        });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search input
        this.searchInput.addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value;
            this.renderProblems();
        });

        // Difficulty filters
        this.difficultyFilters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                // Remove active class from all filters
                this.difficultyFilters.forEach(f => f.classList.remove('active'));
                
                // Add active class to clicked filter
                e.target.classList.add('active');
                
                // Update filter
                this.currentFilters.difficulty = e.target.dataset.difficulty;
                this.renderProblems();
            });
        });

        // Skill tags
        this.skillTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                // Remove active class from all tags
                this.skillTags.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tag
                e.target.classList.add('active');
                
                // Update filter
                this.currentFilters.skill = e.target.dataset.skill;
                this.renderProblems();
            });
        });

        // Start button
        this.startBtn.addEventListener('click', () => {
            this.startDailyChallenge();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.resetFilters();
            }
        });
    }

    /**
     * Start daily challenge
     */
    startDailyChallenge() {
        // Show confirmation dialog
        const confirmed = confirm('Start today\'s daily challenge? You will earn 2x credits for solving it!');
        
        if (confirmed) {
            // Simulate challenge start
            this.startBtn.textContent = 'Challenge Started!';
            this.startBtn.style.background = 'rgba(34, 197, 94, 0.2)';
            this.startBtn.style.borderColor = 'rgba(34, 197, 94, 0.3)';
            this.startBtn.style.color = '#16a34a';
            this.startBtn.disabled = true;
            
            // Add success animation
            this.startBtn.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.startBtn.style.transform = 'scale(1)';
            }, 200);
            
            // Show success message
            this.showNotification('Daily challenge started! Good luck!', 'success');
        }
    }

    /**
     * Start countdown timer
     */
    startTimer() {
        const endTime = new Date();
        endTime.setHours(23, 59, 59); // End of day
        
        const updateTimer = () => {
            const now = new Date();
            const diff = endTime - now;
            
            if (diff <= 0) {
                this.timerElement.textContent = '00:00:00';
                return;
            }
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            this.timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };
        
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    /**
     * Reset all filters
     */
    resetFilters() {
        this.currentFilters = {
            difficulty: 'all',
            skill: 'all',
            search: ''
        };
        
        // Reset UI
        this.searchInput.value = '';
        this.difficultyFilters.forEach(f => f.classList.remove('active'));
        this.skillTags.forEach(t => t.classList.remove('active'));
        
        // Set default active states
        this.difficultyFilters[0].classList.add('active'); // All
        this.skillTags[0].classList.add('active'); // All
        
        this.renderProblems();
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Mark problem as solved (for demo purposes)
     */
    markProblemSolved(problemId) {
        if (!this.solvedProblems.includes(problemId)) {
            this.solvedProblems.push(problemId);
            this.userStats.solved++;
            
            // Update credits (example: +100 credits per problem)
            this.userStats.credits += 100;
            
            this.renderStats();
            this.renderProblems();
            
            this.showNotification('Problem solved! +100 credits earned.', 'success');
        }
    }

    /**
     * Get user progress percentage
     */
    getProgressPercentage() {
        return Math.round((this.userStats.solved / this.userStats.total) * 100);
    }
}

// Practice Arena Data
const problemsData = [
    {
        id: 'two-sum',
        name: 'Two Sum',
        description: 'Find two numbers that add up to a target value',
        skill: 'JavaScript',
        difficulty: 'easy',
        credits: 100
    },
    {
        id: 'valid-parentheses',
        name: 'Valid Parentheses',
        description: 'Check if parentheses are properly balanced',
        skill: 'JavaScript',
        difficulty: 'easy',
        credits: 100
    },
    {
        id: 'reverse-linked-list',
        name: 'Reverse Linked List',
        description: 'Reverse a singly linked list',
        skill: 'JavaScript',
        difficulty: 'medium',
        credits: 200
    },
    {
        id: 'merge-k-sorted-lists',
        name: 'Merge K Sorted Lists',
        description: 'Merge k sorted linked lists into one sorted list',
        skill: 'JavaScript',
        difficulty: 'hard',
        credits: 300
    },
    {
        id: 'longest-substring-without-repeating-characters',
        name: 'Longest Substring Without Repeating Characters',
        description: 'Find the length of the longest substring without repeating characters',
        skill: 'TypeScript',
        difficulty: 'medium',
        credits: 200
    },
    {
        id: 'binary-tree-level-order-traversal',
        name: 'Binary Tree Level Order Traversal',
        description: 'Return the level order traversal of a binary tree',
        skill: 'JavaScript',
        difficulty: 'medium',
        credits: 200
    },
    {
        id: 'container-with-most-water',
        name: 'Container With Most Water',
        description: 'Find two lines that together with the x-axis form a container',
        skill: 'TypeScript',
        difficulty: 'medium',
        credits: 200
    },
    {
        id: 'trapping-rain-water',
        name: 'Trapping Rain Water',
        description: 'Calculate how much water can be trapped',
        skill: 'JavaScript',
        difficulty: 'hard',
        credits: 300
    },
    {
        id: 'react-component-lifecycle',
        name: 'React Component Lifecycle',
        description: 'Understand and implement React component lifecycle methods',
        skill: 'React',
        difficulty: 'medium',
        credits: 250
    },
    {
        id: 'system-design-twitter',
        name: 'System Design: Twitter',
        description: 'Design a scalable microblogging platform',
        skill: 'System Design',
        difficulty: 'hard',
        credits: 500
    }
];

// Initialize Practice Arena when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PracticeArena();
});

// Export for external use
window.PracticeArenaModule = {
    getProblems: () => problemsData,
    getSolvedProblems: () => new PracticeArena().solvedProblems,
    getStats: () => new PracticeArena().userStats
};