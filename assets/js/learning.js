/**
 * Modern Course & Learning Section - JavaScript
 * ES6+ implementation with modern practices for the SkillVista learning platform
 */

// Course Data Structure - Modern ES6+ Object Structure
const courseData = [
    {
        id: 'frontend',
        title: 'Frontend Development',
        description: 'Master modern frontend technologies including HTML, CSS, JavaScript, and popular frameworks.',
        icon: 'fa-code',
        color: '#667eea',
        category: 'Web Development',
        playlist: [
            {
                id: 'html-basics',
                title: 'HTML Basics - Complete Course',
                videoId: 'UB1O30fR-EE',
                duration: '3h 15m'
            },
            {
                id: 'css-grid',
                title: 'CSS Grid - The Complete Guide',
                videoId: 'jV8B24rSN5o',
                duration: '2h 45m'
            },
            {
                id: 'javascript-es6',
                title: 'JavaScript ES6+ Features',
                videoId: 'NCrQwmcJ54E',
                duration: '1h 30m'
            },
            {
                id: 'react-hooks',
                title: 'React Hooks - Complete Tutorial',
                videoId: 'TNhaISOUy6Q',
                duration: '2h 20m'
            },
            {
                id: 'vue3-basics',
                title: 'Vue 3 - The Complete Guide',
                videoId: 'FXpIoQ_rT_c',
                duration: '4h 10m'
            }
        ]
    },
    {
        id: 'backend',
        title: 'Backend Development',
        description: 'Learn server-side programming, databases, APIs, and cloud deployment strategies.',
        icon: 'fa-server',
        color: '#5a6fd8',
        category: 'Web Development',
        playlist: [
            {
                id: 'nodejs-express',
                title: 'Node.js & Express - Complete Course',
                videoId: 'Oe421EPjeBE',
                duration: '4h 30m'
            },
            {
                id: 'python-flask',
                title: 'Python Flask - Full Course',
                videoId: 'Z1RJmh_OqeA',
                duration: '3h 45m'
            },
            {
                id: 'django-rest',
                title: 'Django REST API - Complete Guide',
                videoId: 'b2C9I8HuCe4',
                duration: '3h 20m'
            },
            {
                id: 'mongodb',
                title: 'MongoDB - Database Tutorial',
                videoId: 'ofme2o2myIg',
                duration: '2h 15m'
            },
            {
                id: 'postgresql',
                title: 'PostgreSQL - Complete Tutorial',
                videoId: 'Hx6qkvDQXww',
                duration: '2h 40m'
            }
        ]
    },
    {
        id: 'ai-ml',
        title: 'AI / Machine Learning',
        description: 'Explore artificial intelligence, machine learning algorithms, and data science applications.',
        icon: 'fa-brain',
        color: '#9c88ff',
        category: 'Artificial Intelligence',
        playlist: [
            {
                id: 'python-ml',
                title: 'Python for Machine Learning',
                videoId: 'ua-CiDNNj30',
                duration: '5h 20m'
            },
            {
                id: 'tensorflow',
                title: 'TensorFlow 2.0 - Complete Course',
                videoId: 'tPYj3fFJGjk',
                duration: '6h 15m'
            },
            {
                id: 'neural-networks',
                title: 'Neural Networks - Deep Learning',
                videoId: 'aircAruvnKk',
                duration: '3h 45m'
            },
            {
                id: 'nlp-python',
                title: 'Natural Language Processing with Python',
                videoId: 'fInYh90YMJU',
                duration: '4h 30m'
            },
            {
                id: 'computer-vision',
                title: 'Computer Vision with OpenCV',
                videoId: 'Z78zbnLlPUA',
                duration: '3h 10m'
            }
        ]
    },
    {
        id: 'data-science',
        title: 'Data Science',
        description: 'Learn data analysis, visualization, statistics, and business intelligence tools.',
        icon: 'fa-chart-line',
        color: '#ff6b6b',
        category: 'Data Analysis',
        playlist: [
            {
                id: 'python-pandas',
                title: 'Python Pandas - Complete Tutorial',
                videoId: 'ZyhVh-qRcic',
                duration: '3h 30m'
            },
            {
                id: 'matplotlib',
                title: 'Matplotlib - Data Visualization',
                videoId: 'UO98lJQ3QGI',
                duration: '2h 15m'
            },
            {
                id: 'seaborn',
                title: 'Seaborn - Statistical Visualization',
                videoId: '6GUZXDef2U0',
                duration: '1h 45m'
            },
            {
                id: 'excel-dashboard',
                title: 'Excel Dashboard - Complete Guide',
                videoId: '8tVnV__D4tk',
                duration: '3h 20m'
            },
            {
                id: 'power-bi',
                title: 'Power BI - Complete Tutorial',
                videoId: '7J0Jxu9b57Q',
                duration: '4h 10m'
            }
        ]
    },
    {
        id: 'mobile',
        title: 'Mobile App Development',
        description: 'Build native and cross-platform mobile applications for iOS and Android.',
        icon: 'fa-mobile-alt',
        color: '#4ecdc4',
        category: 'Mobile Development',
        playlist: [
            {
                id: 'react-native',
                title: 'React Native - Complete Course',
                videoId: '0-S5a0eXPoc',
                duration: '5h 45m'
            },
            {
                id: 'flutter',
                title: 'Flutter - Complete Course',
                videoId: '1gDhl4JEgzE',
                duration: '6h 30m'
            },
            {
                id: 'swift-ios',
                title: 'Swift - iOS Development',
                videoId: 'EaRQDwHk79c',
                duration: '7h 15m'
            },
            {
                id: 'kotlin-android',
                title: 'Kotlin - Android Development',
                videoId: 'HXLwdQ0488E',
                duration: '5h 30m'
            },
            {
                id: 'ionic',
                title: 'Ionic Framework - Complete Guide',
                videoId: 'ilLs36FhY1o',
                duration: '4h 20m'
            }
        ]
    },
    {
        id: 'cloud-devops',
        title: 'Cloud & DevOps',
        description: 'Master cloud platforms, containerization, CI/CD, and infrastructure automation.',
        icon: 'fa-cloud',
        color: '#45b7d1',
        category: 'Cloud Computing',
        playlist: [
            {
                id: 'aws-basics',
                title: 'AWS - Complete Course',
                videoId: 'Bd27m37E7BM',
                duration: '8h 30m'
            },
            {
                id: 'docker',
                title: 'Docker - Complete Tutorial',
                videoId: '3c-iBn73dDE',
                duration: '4h 15m'
            },
            {
                id: 'kubernetes',
                title: 'Kubernetes - Complete Guide',
                videoId: 'WwBd10cbf28',
                duration: '6h 45m'
            },
            {
                id: 'jenkins',
                title: 'Jenkins - CI/CD Pipeline',
                videoId: '4tToKcF3E2c',
                duration: '3h 20m'
            },
            {
                id: 'terraform',
                title: 'Terraform - Infrastructure as Code',
                videoId: 'SLB17sAada8',
                duration: '4h 10m'
            }
        ]
    }
];

/**
 * Modern Learning Section Class
 * ES6+ Class-based approach for better organization and maintainability
 */
class LearningSection {
    constructor() {
        this.currentCourse = null;
        this.currentVideo = null;
        this.coursesGrid = document.getElementById('courses-grid');
        this.youtubePlayer = document.getElementById('youtube-player');
        this.videoPlaceholder = document.getElementById('video-placeholder');
        this.currentVideoTitle = document.getElementById('current-video-title');
        this.currentCategory = document.getElementById('current-category');
        
        this.init();
    }

    /**
     * Initialize the learning section with modern async/await patterns
     */
    async init() {
        if (!this.validateDOMElements()) {
            console.warn('Course & Learning section elements not found. Waiting for DOM...');
            await this.waitForDOM();
        }
        
        console.log('Course & Learning section elements found, initializing...');
        this.renderCourses();
        this.setupEventListeners();
        this.setupIntersectionObserver();
    }

    /**
     * Validate DOM elements exist
     */
    validateDOMElements() {
        return this.coursesGrid && this.youtubePlayer && this.videoPlaceholder && 
               this.currentVideoTitle && this.currentCategory;
    }

    /**
     * Wait for DOM to be ready using modern Promise approach
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
     * Render all course cards to the DOM
     */
    renderCourses() {
        this.coursesGrid.innerHTML = '';
        
        courseData.forEach(course => {
            const courseCard = this.createCourseCard(course);
            this.coursesGrid.appendChild(courseCard);
        });
    }

    /**
     * Create a course card element using modern DOM manipulation
     * @param {Object} course - Course data object
     * @returns {HTMLElement} Course card element
     */
    createCourseCard(course) {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.dataset.courseId = course.id;
        
        // Create course header using template literals
        const headerHTML = `
            <div class="course-header">
                <h3 class="course-title">${course.title}</h3>
                <i class="fas ${course.icon}" style="color: ${course.color}"></i>
            </div>
            <p class="course-description">${course.description}</p>
            <button class="expand-btn collapsed">
                <i class="fas fa-chevron-down"></i> View Playlist
            </button>
        `;
        
        card.innerHTML = headerHTML;
        
        // Create playlist dropdown
        const playlistDropdown = document.createElement('div');
        playlistDropdown.className = 'playlist-dropdown';
        
        const playlistList = document.createElement('ul');
        playlistList.className = 'playlist-list';
        
        course.playlist.forEach((video, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'playlist-item';
            listItem.dataset.videoId = video.videoId;
            listItem.dataset.courseId = course.id;
            listItem.dataset.index = index;
            
            listItem.innerHTML = `
                <i class="fas fa-play-circle"></i>
                <span class="playlist-item-title">${video.title}</span>
                <span class="playlist-item-duration">${video.duration}</span>
            `;
            
            playlistList.appendChild(listItem);
        });
        
        playlistDropdown.appendChild(playlistList);
        card.appendChild(playlistDropdown);
        
        return card;
    }

    /**
     * Setup event listeners using modern event delegation
     */
    setupEventListeners() {
        // Course card click event
        this.coursesGrid.addEventListener('click', (e) => {
            const courseCard = e.target.closest('.course-card');
            if (courseCard) {
                this.toggleCoursePlaylist(courseCard);
            }
        });
        
        // Playlist item click event
        this.coursesGrid.addEventListener('click', (e) => {
            const playlistItem = e.target.closest('.playlist-item');
            if (playlistItem) {
                const videoId = playlistItem.dataset.videoId;
                const courseId = playlistItem.dataset.courseId;
                const index = parseInt(playlistItem.dataset.index);
                
                this.playVideo(videoId, courseId, index);
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllPlaylists();
            }
        });
    }

    /**
     * Setup Intersection Observer for performance optimization
     */
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe course cards for smooth entrance animations
        document.querySelectorAll('.course-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    /**
     * Toggle course playlist dropdown with modern animations
     * @param {HTMLElement} courseCard - The course card element
     */
    toggleCoursePlaylist(courseCard) {
        const dropdown = courseCard.querySelector('.playlist-dropdown');
        const expandBtn = courseCard.querySelector('.expand-btn');
        
        // Close other open playlists
        this.closeOtherPlaylists(courseCard);
        
        // Toggle current playlist with smooth animation
        if (dropdown.classList.contains('open')) {
            dropdown.classList.remove('open');
            expandBtn.classList.add('collapsed');
            expandBtn.innerHTML = '<i class="fas fa-chevron-down"></i> View Playlist';
        } else {
            dropdown.classList.add('open');
            expandBtn.classList.remove('collapsed');
            expandBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Playlist';
        }
    }

    /**
     * Close all open playlists except the current one
     * @param {HTMLElement} currentCard - The current course card
     */
    closeOtherPlaylists(currentCard) {
        const allCards = document.querySelectorAll('.course-card');
        
        allCards.forEach(card => {
            if (card !== currentCard) {
                const dropdown = card.querySelector('.playlist-dropdown');
                const expandBtn = card.querySelector('.expand-btn');
                
                if (dropdown && dropdown.classList.contains('open')) {
                    dropdown.classList.remove('open');
                    expandBtn.classList.add('collapsed');
                    expandBtn.innerHTML = '<i class="fas fa-chevron-down"></i> View Playlist';
                }
            }
        });
    }

    /**
     * Close all playlists
     */
    closeAllPlaylists() {
        const allCards = document.querySelectorAll('.course-card');
        
        allCards.forEach(card => {
            const dropdown = card.querySelector('.playlist-dropdown');
            const expandBtn = card.querySelector('.expand-btn');
            
            if (dropdown && dropdown.classList.contains('open')) {
                dropdown.classList.remove('open');
                expandBtn.classList.add('collapsed');
                expandBtn.innerHTML = '<i class="fas fa-chevron-down"></i> View Playlist';
            }
        });
    }

    /**
     * Play a YouTube video with modern async handling
     * @param {string} videoId - YouTube video ID
     * @param {string} courseId - Course ID
     * @param {number} index - Video index in playlist
     */
    async playVideo(videoId, courseId, index) {
        try {
            // Find course and video data
            const course = courseData.find(c => c.id === courseId);
            const video = course.playlist[index];
            
            // Update current state
            this.currentCourse = course;
            this.currentVideo = video;
            
            // Update UI with smooth transitions
            this.updateVideoPlayer(videoId, video.title, course.title);
            this.updatePlaylistSelection(courseId, index);
            
            // Scroll to video player with smooth animation
            this.scrollToVideoPlayer();
            
            // Add analytics tracking (placeholder for future implementation)
            this.trackVideoPlay(videoId, course.title);
            
        } catch (error) {
            console.error('Error playing video:', error);
            this.showError('Failed to load video. Please try again.');
        }
    }

    /**
     * Update the video player with new content
     * @param {string} videoId - YouTube video ID
     * @param {string} title - Video title
     * @param {string} category - Course category
     */
    updateVideoPlayer(videoId, title, category) {
        // Update header with smooth transitions
        this.currentVideoTitle.textContent = title;
        this.currentCategory.textContent = category;
        
        // Update iframe source with proper sanitization
        const embedUrl = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
        this.youtubePlayer.src = embedUrl;
        
        // Show/hide elements with smooth transitions
        this.videoPlaceholder.style.display = 'none';
        this.youtubePlayer.style.display = 'block';
    }

    /**
     * Update playlist item selection highlighting
     * @param {string} courseId - Course ID
     * @param {number} selectedIndex - Index of selected video
     */
    updatePlaylistSelection(courseId, selectedIndex) {
        // Remove all active classes
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to selected item
        const courseCard = document.querySelector(`.course-card[data-course-id="${courseId}"]`);
        if (courseCard) {
            const playlistItems = courseCard.querySelectorAll('.playlist-item');
            if (playlistItems[selectedIndex]) {
                playlistItems[selectedIndex].classList.add('active');
            }
        }
    }

    /**
     * Scroll to the video player section with smooth animation
     */
    scrollToVideoPlayer() {
        const videoSection = document.querySelector('.video-player-section');
        if (videoSection) {
            videoSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    /**
     * Utility function to get course by ID
     * @param {string} courseId - Course ID
     * @returns {Object|null} Course object or null
     */
    getCourseById(courseId) {
        return courseData.find(course => course.id === courseId) || null;
    }

    /**
     * Utility function to get video by ID
     * @param {string} videoId - YouTube video ID
     * @returns {Object|null} Video object or null
     */
    getVideoById(videoId) {
        for (const course of courseData) {
            const video = course.playlist.find(v => v.videoId === videoId);
            if (video) {
                return { video, course };
            }
        }
        return null;
    }

    /**
     * Reset video player to initial state
     */
    resetVideoPlayer() {
        this.currentVideoTitle.textContent = 'Select a course to begin learning';
        this.currentCategory.textContent = 'No course selected';
        this.youtubePlayer.src = '';
        this.videoPlaceholder.style.display = 'flex';
        this.youtubePlayer.style.display = 'none';
        this.currentCourse = null;
        this.currentVideo = null;
    }

    /**
     * Show error message to user
     * @param {string} message - Error message to display
     */
    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'notification notification-error';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            errorDiv.classList.add('fade-out');
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    /**
     * Track video play for analytics (placeholder)
     * @param {string} videoId - YouTube video ID
     * @param {string} courseTitle - Course title
     */
    trackVideoPlay(videoId, courseTitle) {
        // Placeholder for analytics tracking
        console.log(`Video played: ${videoId} from course: ${courseTitle}`);
    }
}

// Initialize the learning section when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LearningSection();
});

// Export for external use
window.LearningModule = {
    getCourseById: (courseId) => new LearningSection().getCourseById(courseId),
    getVideoById: (videoId) => new LearningSection().getVideoById(videoId),
    closeAllPlaylists: () => new LearningSection().closeAllPlaylists()
};
