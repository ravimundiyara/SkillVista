"""
Skill Library Module

This module provides a centralized skill repository grouped by categories.
Skills are organized for manual selection and skill gap analysis.
"""

# Master Skill Library - Centralized skill repository
SKILL_LIBRARY = {
    "Programming Languages": [
        "Python", "Java", "C++", "JavaScript", "TypeScript", "C#", "Go", "Rust", 
        "Ruby", "PHP", "Swift", "Kotlin", "R", "MATLAB", "Scala", "Perl", "Shell"
    ],
    "Web Technologies": [
        "HTML", "CSS", "React", "Angular", "Vue.js", "Node.js", "Express", "Django", 
        "Flask", "ASP.NET", "Spring Boot", "Laravel", "jQuery", "Bootstrap", "Tailwind CSS",
        "Next.js", "Nuxt.js", "Svelte", "Webpack", "Vite"
    ],
    "Databases": [
        "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "SQL Server", 
        "Cassandra", "Neo4j", "Elasticsearch", "DynamoDB", "MariaDB", "InfluxDB", "CouchDB"
    ],
    "Data & AI": [
        "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "Keras", "OpenCV", 
        "NLTK", "spaCy", "Hugging Face", "Jupyter", "Matplotlib", "Seaborn", "Plotly",
        "Apache Spark", "Apache Kafka", "Hadoop", "Airflow", "MLflow", "Data Analysis",
        "Machine Learning", "Deep Learning", "Natural Language Processing", "Computer Vision",
        "Data Visualization", "Statistical Analysis", "Big Data"
    ],
    "Cloud & DevOps": [
        "AWS", "Azure", "Google Cloud Platform", "Docker", "Kubernetes", "Terraform", 
        "Ansible", "Jenkins", "GitLab CI/CD", "GitHub Actions", "CircleCI", "Travis CI",
        "Prometheus", "Grafana", "ELK Stack", "Nginx", "Apache", "Load Balancing",
        "Microservices", "Serverless", "Cloud Architecture", "Infrastructure as Code",
        "Monitoring", "Logging", "Containerization"
    ],
    "Tools & Platforms": [
        "Git", "GitHub", "GitLab", "Bitbucket", "Linux", "Windows", "macOS", "VS Code", 
        "IntelliJ IDEA", "PyCharm", "Eclipse", "Vim", "Sublime Text", "Postman", "Swagger",
        "Docker Compose", "Vagrant", "VirtualBox", "VMware", "Jira", "Trello", "Slack"
    ],
    "Soft Skills": [
        "Communication", "Leadership", "Problem Solving", "Teamwork", "Time Management", 
        "Adaptability", "Critical Thinking", "Creativity", "Collaboration", "Presentation",
        "Negotiation", "Emotional Intelligence", "Project Management", "Analytical Thinking",
        "Decision Making", "Conflict Resolution", "Active Listening", "Empathy"
    ],
    "Mobile Development": [
        "React Native", "Flutter", "Swift", "Kotlin", "Java", "Objective-C", "Xamarin", 
        "Ionic", "Cordova", "Android Development", "iOS Development", "Mobile UI/UX",
        "App Store Guidelines", "Google Play Guidelines", "Mobile Testing"
    ],
    "Cybersecurity": [
        "Network Security", "Application Security", "Cryptography", "Penetration Testing", 
        "Security Auditing", "Vulnerability Assessment", "OWASP", "Firewalls", "Encryption",
        "Authentication", "Authorization", "Security Compliance", "Risk Assessment"
    ],
    "Business & Management": [
        "Product Management", "Project Management", "Business Analysis", "Requirements Gathering", 
        "Stakeholder Management", "Agile Methodologies", "Scrum", "Kanban", "Sprint Planning",
        "User Stories", "Business Intelligence", "Data-Driven Decision Making", "Market Research"
    ]
}

def get_skill_library():
    """Return the complete skill library."""
    return SKILL_LIBRARY

def get_all_skills():
    """Return all skills from all categories."""
    all_skills = []
    for category_skills in SKILL_LIBRARY.values():
        all_skills.extend(category_skills)
    return list(set(all_skills))  # Remove duplicates

def get_skill_categories():
    """Return all skill categories."""
    return list(SKILL_LIBRARY.keys())

def search_skills(query):
    """Search for skills across all categories."""
    if not query:
        return get_all_skills()
    
    query_lower = query.lower().strip()
    results = []
    
    for category, skills in SKILL_LIBRARY.items():
        for skill in skills:
            if query_lower in skill.lower():
                results.append({
                    'skill': skill,
                    'category': category
                })
    
    # Sort results by relevance (exact match first, then partial)
    results.sort(key=lambda x: (
        x['skill'].lower() != query_lower,  # Exact matches first
        x['skill'].lower().find(query_lower),  # Position of match
        x['skill']  # Alphabetical
    ))
    
    return results

def validate_skills(skills_list):
    """Validate and clean a list of skills."""
    if not skills_list:
        return []
    
    # Convert to set for deduplication, case-insensitive
    skill_set = set()
    valid_skills = []
    
    for skill in skills_list:
        skill_clean = skill.strip()
        if skill_clean and skill_clean not in skill_set:
            skill_set.add(skill_clean)
            valid_skills.append(skill_clean)
    
    return valid_skills

def get_skill_category(skill_name):
    """Get the category of a specific skill."""
    skill_lower = skill_name.lower().strip()
    for category, skills in SKILL_LIBRARY.items():
        for skill in skills:
            if skill.lower() == skill_lower:
                return category
    return "Other"

# Example usage and testing
if __name__ == "__main__":
    # Test skill library
    print("Skill Library Categories:")
    for category in get_skill_categories():
        print(f"- {category}: {len(SKILL_LIBRARY[category])} skills")
    
    print("\nSearch 'Python':")
    python_results = search_skills("Python")
    for result in python_results:
        print(f"- {result['skill']} ({result['category']})")
    
    print("\nAll skills count:", len(get_all_skills()))