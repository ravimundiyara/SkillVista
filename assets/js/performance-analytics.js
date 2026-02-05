// Performance Analytics JavaScript
// Handles chart initialization, animations, and interactive features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts when the page loads
    initCharts();
    
    // Add animations to metric cards
    animateMetricCards();
    
    // Add hover effects to charts
    addChartInteractions();
});

// Mock data for analytics
const analyticsData = {
    weeklyActivity: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [8, 5, 12, 6, 15, 10, 7]
    },
    readinessScore: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [45, 52, 58, 65, 72, 80]
    },
    problemDistribution: {
        labels: ['Easy', 'Medium', 'Hard'],
        data: [65, 25, 10],
        colors: ['#28a745', '#17a2b8', '#ffc107']
    },
    skills: [
        { name: 'JavaScript', accuracy: 92, attempts: 156, level: 'strong' },
        { name: 'TypeScript', accuracy: 78, attempts: 89, level: 'good' },
        { name: 'React', accuracy: 85, attempts: 123, level: 'good' },
        { name: 'System Design', accuracy: 65, attempts: 45, level: 'improving' },
        { name: 'Git', accuracy: 95, attempts: 67, level: 'strong' }
    ]
};

// Chart configurations
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            cornerRadius: 6,
            padding: 10
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
                color: '#6c757d'
            }
        },
        x: {
            grid: {
                display: false
            },
            ticks: {
                color: '#6c757d'
            }
        }
    }
};

const areaChartOptions = {
    ...chartOptions,
    elements: {
        point: {
            radius: 0,
            hoverRadius: 4
        }
    }
};

const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            cornerRadius: 6,
            padding: 10
        }
    }
};

// Initialize all charts
function initCharts() {
    // Weekly Activity Bar Chart
    const weeklyCtx = document.getElementById('weeklyActivityChart');
    if (weeklyCtx) {
        new Chart(weeklyCtx, {
            type: 'bar',
            data: {
                labels: analyticsData.weeklyActivity.labels,
                datasets: [{
                    label: 'Problems Solved',
                    data: analyticsData.weeklyActivity.data,
                    backgroundColor: 'rgba(0, 123, 255, 0.8)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                ...chartOptions,
                plugins: {
                    ...chartOptions.plugins,
                    tooltip: {
                        ...chartOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y} problems solved`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Readiness Score Area Chart
    const readinessCtx = document.getElementById('readinessScoreChart');
    if (readinessCtx) {
        new Chart(readinessCtx, {
            type: 'line',
            data: {
                labels: analyticsData.readinessScore.labels,
                datasets: [{
                    label: 'Readiness Score',
                    data: analyticsData.readinessScore.data,
                    borderColor: 'rgba(40, 167, 69, 1)',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(40, 167, 69, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                ...areaChartOptions,
                scales: {
                    ...areaChartOptions.scales,
                    y: {
                        ...areaChartOptions.scales.y,
                        max: 100,
                        ticks: {
                            ...areaChartOptions.scales.y.ticks,
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    ...areaChartOptions.plugins,
                    tooltip: {
                        ...areaChartOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                return `Readiness Score: ${context.parsed.y}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Problem Distribution Donut Chart
    const distributionCtx = document.getElementById('problemDistributionChart');
    if (distributionCtx) {
        new Chart(distributionCtx, {
            type: 'doughnut',
            data: {
                labels: analyticsData.problemDistribution.labels,
                datasets: [{
                    data: analyticsData.problemDistribution.data,
                    backgroundColor: analyticsData.problemDistribution.colors,
                    borderWidth: 2,
                    borderColor: '#fff',
                    hoverBorderWidth: 4
                }]
            },
            options: {
                ...donutChartOptions,
                cutout: '60%',
                plugins: {
                    ...donutChartOptions.plugins,
                    tooltip: {
                        ...donutChartOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed} %`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Animate metric cards on scroll
function animateMetricCards() {
    const metricCards = document.querySelectorAll('.metric-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease-out';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100 * Array.from(metricCards).indexOf(entry.target));
            }
        });
    }, { threshold: 0.1 });

    metricCards.forEach(card => observer.observe(card));
}

// Add interactive effects to charts
function addChartInteractions() {
    // Add hover effects to metric cards
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
        });
    });

    // Add click effects to analytics cards
    const analyticsCards = document.querySelectorAll('.analytics-card');
    analyticsCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
        });
    });
}

// Utility function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Utility function to get skill level class
function getSkillLevelClass(accuracy) {
    if (accuracy >= 90) return 'strong';
    if (accuracy >= 75) return 'good';
    if (accuracy >= 60) return 'improving';
    return 'weak';
}

// Initialize progress bar animations
function initProgressBarAnimations() {
    const progressBars = document.querySelectorAll('.skill-progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.style.getPropertyValue('--target-width');
                progressBar.style.width = targetWidth;
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => observer.observe(bar));
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', initProgressBarAnimations);