"""
Skill Keywords for Resume Analysis

This module contains predefined lists of technical and soft skills
used for extracting skills from resume text using NLP.
"""

# Technical Skills
TECHNICAL_SKILLS = {
    # Programming Languages
    "python", "java", "javascript", "typescript", "c++", "c#", "c", "go", "rust", 
    "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "perl", "lua", "dart",
    
    # Web Technologies
    "html", "css", "sass", "less", "react", "angular", "vue", "jquery", "bootstrap",
    "tailwind", "webpack", "vite", "node.js", "express", "django", "flask", "spring",
    "laravel", "ruby on rails", "asp.net",
    
    # Databases
    "mysql", "postgresql", "mongodb", "redis", "sqlite", "oracle", "sql server",
    "cassandra", "elasticsearch", "dynamodb", "firebase", "neo4j",
    
    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "git", "github", "gitlab",
    "bitbucket", "terraform", "ansible", "puppet", "chef", "ci/cd", "devops", "linux",
    "ubuntu", "centos", "redhat", "nginx", "apache", "load balancing",
    
    # Data Science & ML
    "machine learning", "deep learning", "artificial intelligence", "ai", "ml",
    "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy", "matplotlib",
    "seaborn", "jupyter", "data analysis", "data visualization", "statistics", "big data",
    "hadoop", "spark", "hive", "kafka", "tableau", "power bi",
    
    # Mobile Development
    "android", "ios", "flutter", "react native", "swift", "kotlin", "xamarin", "ionic",
    "cordova", "mobile development", "mobile app",
    
    # Game Development
    "unity", "unreal engine", "game development", "c#", "c++", "game design",
    
    # Cybersecurity
    "security", "cybersecurity", "penetration testing", "ethical hacking", "firewall",
    "encryption", "ssl", "tls", "vulnerability assessment", "risk assessment",
    
    # Other Technologies
    "api", "rest", "graphql", "soap", "microservices", "monolith", "architecture",
    "design patterns", "algorithms", "data structures", "version control", "agile",
    "scrum", "kanban", "tdd", "bdd", "testing", "unit testing", "integration testing"
}

# Soft Skills
SOFT_SKILLS = {
    "communication", "teamwork", "leadership", "problem solving", "critical thinking",
    "creativity", "adaptability", "time management", "organization", "collaboration",
    "interpersonal skills", "emotional intelligence", "conflict resolution",
    "negotiation", "public speaking", "presentation", "project management",
    "decision making", "analytical thinking", "attention to detail", "multitasking",
    "work ethic", "professionalism", "reliability", "initiative", "self-motivation",
    "learning agility", "resilience", "stress management", "customer service",
    "sales", "marketing", "business analysis", "strategic thinking", "innovation",
    "coaching", "mentoring", "delegation", "prioritization", "planning", "coordination"
}

# Education Keywords
EDUCATION_KEYWORDS = {
    "bachelor", "master", "phd", "doctorate", "degree", "bs", "ms", "ba", "ma",
    "b.sc", "m.sc", "b.tech", "m.tech", "diploma", "certificate", "course", "training",
    "university", "college", "institute", "school", "faculty", "department",
    "gpa", "cgpa", "grade", "graduated", "graduation", "semester", "year"
}

# Experience Keywords
EXPERIENCE_KEYWORDS = {
    "experience", "work experience", "professional experience", "industry experience",
    "years of experience", "internship", "intern", "co-op", "fresher", "entry level",
    "junior", "senior", "lead", "manager", "director", "vp", "cto", "ceo", "founder",
    "freelance", "contract", "full-time", "part-time", "remote", "onsite", "hybrid"
}

# Project Keywords
PROJECT_KEYWORDS = {
    "project", "projects", "portfolio", "github", "gitlab", "bitbucket", "repository",
    "repo", "code", "implementation", "development", "prototype", "demo", "case study"
}

# Certification Keywords
CERTIFICATION_KEYWORDS = {
    "certification", "certified", "certificate", "cert", "license", "licensing",
    "aws certified", "microsoft certified", "google certified", "oracle certified",
    "cisco certified", "pmp", "scrum master", "six sigma", "toefl", "ielts", "gre",
    "gate", "cat"
}

# Combined skill sets for easier access
ALL_SKILLS = TECHNICAL_SKILLS.union(SOFT_SKILLS)
ALL_KEYWORDS = {
    'skills': ALL_SKILLS,
    'education': EDUCATION_KEYWORDS,
    'experience': EXPERIENCE_KEYWORDS,
    'projects': PROJECT_KEYWORDS,
    'certifications': CERTIFICATION_KEYWORDS
}