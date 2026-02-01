// Job Roles Data Source
// Centralized job roles list for autocomplete functionality

const JOB_ROLES = [
    // Technical Roles
    "Software Engineer",
    "Frontend Developer", 
    "Backend Developer",
    "Full Stack Developer",
    "Web Developer",
    "Mobile Developer",
    "iOS Developer",
    "Android Developer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Data Scientist",
    "Data Analyst",
    "Data Engineer",
    "Machine Learning Engineer",
    "AI Engineer",
    "Cybersecurity Engineer",
    "Security Analyst",
    "Network Engineer",
    "System Administrator",
    "Database Administrator",
    "QA Engineer",
    "Test Engineer",
    "Automation Engineer",
    "Site Reliability Engineer",
    "Technical Lead",
    "Engineering Manager",
    
    // Non-Technical Roles
    "Product Manager",
    "Project Manager",
    "Business Analyst",
    "HR Manager",
    "HR Specialist",
    "Marketing Manager",
    "Digital Marketing Specialist",
    "Content Manager",
    "Sales Manager",
    "Account Manager",
    "Customer Success Manager",
    "Operations Manager",
    "Finance Manager",
    "Financial Analyst",
    "Business Development Manager",
    "Consultant",
    "Recruiter",
    "Talent Acquisition Specialist",
    "UX Designer",
    "UI Designer",
    "Graphic Designer",
    "Creative Director"
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { JOB_ROLES };
} else {
    window.JOB_ROLES = JOB_ROLES;
}