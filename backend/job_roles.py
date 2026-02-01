"""
Job Roles Configuration

This module provides a centralized configuration for all job roles
grouped by categories. This data structure is used for:
- Target role selection in the dashboard
- Skill gap analysis role-to-skills mapping
- Search functionality
"""

from typing import List, Dict, TypedDict


class JobRoleCategory(TypedDict):
    """Type definition for job role category."""
    category_name: str
    roles: List[str]


class JobRolesConfig:
    """Centralized job roles configuration."""
    
    # Software & Engineering Roles
    SOFTWARE_ENGINEERING: JobRoleCategory = {
        "category_name": "Software & Engineering",
        "roles": [
            "Software Engineer",
            "Software Developer", 
            "Frontend Developer",
            "Backend Developer",
            "Full Stack Developer",
            "Mobile App Developer",
            "iOS Developer",
            "Android Developer",
            "Game Developer",
            "AR/VR Developer",
            "QA Engineer",
            "Software Tester",
            "Automation Engineer",
            "Embedded Systems Engineer",
            "IoT Engineer",
            "DevOps Engineer",
            "Site Reliability Engineer (SRE)",
            "Cloud Engineer",
            "Network Engineer",
            "Systems Engineer",
            "Database Administrator (DBA)"
        ]
    }
    
    # Data & AI Roles
    DATA_AI: JobRoleCategory = {
        "category_name": "Data & AI",
        "roles": [
            "Data Analyst",
            "Data Scientist",
            "Machine Learning Engineer",
            "AI Engineer",
            "Business Intelligence (BI) Analyst",
            "Data Engineer",
            "Data Architect",
            "Analytics Engineer",
            "Computer Vision Engineer",
            "NLP Engineer"
        ]
    }
    
    # Cloud, DevOps & Infrastructure
    CLOUD_DEVOPS: JobRoleCategory = {
        "category_name": "Cloud, DevOps & Infrastructure",
        "roles": [
            "Cloud Engineer",
            "DevOps Engineer", 
            "Site Reliability Engineer (SRE)",
            "Cloud Architect",
            "Infrastructure Engineer",
            "Network Engineer",
            "Systems Engineer",
            "Platform Engineer",
            "Cloud Security Engineer",
            "Kubernetes Engineer"
        ]
    }
    
    # Security Roles
    SECURITY: JobRoleCategory = {
        "category_name": "Security",
        "roles": [
            "Cybersecurity Analyst",
            "Information Security Engineer",
            "Security Engineer",
            "Security Architect",
            "Security Consultant",
            "Ethical Hacker",
            "Security Operations Center (SOC) Analyst",
            "GRC Analyst"
        ]
    }
    
    # Architecture & Consulting
    ARCHITECTURE_CONSULTING: JobRoleCategory = {
        "category_name": "Architecture & Consulting",
        "roles": [
            "Technical Architect",
            "Solutions Architect",
            "Enterprise Architect",
            "Cloud Architect",
            "Data Architect",
            "Software Architect",
            "Technical Consultant",
            "Solutions Consultant",
            "Pre-Sales Consultant",
            "Techno-Functional Analyst",
            "IT Business Analyst",
            "Digital Transformation Consultant",
            "Technical Advisor"
        ]
    }
    
    # Product, Project & Program
    PRODUCT_PROJECT: JobRoleCategory = {
        "category_name": "Product, Project & Program",
        "roles": [
            "Product Manager",
            "Product Owner",
            "Project Manager",
            "Program Manager",
            "Technical Program Manager",
            "Technical Product Manager",
            "Scrum Master",
            "Agile Coach",
            "Release Manager",
            "Portfolio Manager"
        ]
    }
    
    # Business & Operations
    BUSINESS_OPERATIONS: JobRoleCategory = {
        "category_name": "Business & Operations",
        "roles": [
            "Business Analyst",
            "Management Consultant",
            "Strategy Analyst",
            "Operations Manager",
            "Operations Analyst",
            "Business Operations Manager",
            "Process Improvement Analyst",
            "Business Process Consultant",
            "Operations Consultant"
        ]
    }
    
    # HR & People Operations
    HR_PEOPLE: JobRoleCategory = {
        "category_name": "HR & People Operations",
        "roles": [
            "Human Resources (HR) Executive",
            "HR Business Partner",
            "Talent Acquisition Specialist",
            "Recruiter",
            "Learning & Development Manager",
            "Training Manager",
            "Payroll Specialist",
            "HR Operations Manager",
            "People Operations Manager",
            "Employee Relations Specialist"
        ]
    }
    
    # Finance & Legal
    FINANCE_LEGAL: JobRoleCategory = {
        "category_name": "Finance & Legal",
        "roles": [
            "Finance Analyst",
            "Financial Controller",
            "Accountant",
            "Senior Accountant",
            "Auditor",
            "Investment Analyst",
            "Risk Analyst",
            "Compliance Officer",
            "Legal Associate",
            "Corporate Lawyer",
            "Contract Manager",
            "Tax Consultant",
            "Financial Advisor",
            "Treasury Analyst"
        ]
    }
    
    # Marketing, Sales & Customer Success
    MARKETING_SALES: JobRoleCategory = {
        "category_name": "Marketing, Sales & Customer Success",
        "roles": [
            "Marketing Executive",
            "Digital Marketing Specialist",
            "SEO Specialist",
            "SEM Specialist",
            "Content Strategist",
            "Social Media Manager",
            "Brand Manager",
            "Marketing Manager",
            "Sales Executive",
            "Business Development Executive",
            "Account Manager",
            "Key Account Manager",
            "Customer Success Manager",
            "Customer Support Executive",
            "Client Relationship Manager",
            "Sales Manager",
            "Marketing Manager",
            "Product Marketing Manager"
        ]
    }
    
    # Admin & Corporate
    ADMIN_CORPORATE: JobRoleCategory = {
        "category_name": "Admin & Corporate",
        "roles": [
            "Public Relations (PR) Manager",
            "Corporate Communications Manager",
            "Admin Executive",
            "Office Manager",
            "Operations Executive",
            "Executive Assistant",
            "Personal Assistant",
            "Receptionist",
            "Administrative Assistant",
            "Corporate Trainer"
        ]
    }
    
    # All categories combined
    ALL_CATEGORIES: List[JobRoleCategory] = [
        SOFTWARE_ENGINEERING,
        DATA_AI,
        CLOUD_DEVOPS,
        SECURITY,
        ARCHITECTURE_CONSULTING,
        PRODUCT_PROJECT,
        BUSINESS_OPERATIONS,
        HR_PEOPLE,
        FINANCE_LEGAL,
        MARKETING_SALES,
        ADMIN_CORPORATE
    ]
    
    @classmethod
    def get_all_categories(cls) -> List[JobRoleCategory]:
        """Get all job role categories."""
        return cls.ALL_CATEGORIES
    
    @classmethod
    def get_all_roles(cls) -> List[str]:
        """Get flat list of all roles across all categories."""
        all_roles = []
        for category in cls.ALL_CATEGORIES:
            all_roles.extend(category["roles"])
        return sorted(list(set(all_roles)))  # Remove duplicates and sort
    
    @classmethod
    def get_role_by_name(cls, role_name: str) -> Dict[str, str]:
        """Get role information by name."""
        for category in cls.ALL_CATEGORIES:
            if role_name in category["roles"]:
                return {
                    "role_name": role_name,
                    "category": category["category_name"]
                }
        return None
    
    @classmethod
    def search_roles(cls, query: str) -> List[Dict[str, str]]:
        """Search roles by query string (case-insensitive)."""
        if not query or not query.strip():
            return []
        
        query_lower = query.lower().strip()
        results = []
        
        for category in cls.ALL_CATEGORIES:
            for role in category["roles"]:
                if query_lower in role.lower():
                    results.append({
                        "role_name": role,
                        "category": category["category_name"]
                    })
        
        # Sort results by relevance (exact match first, then partial match)
        results.sort(key=lambda x: (
            not x["role_name"].lower() == query_lower,  # Exact match first
            x["role_name"].lower().find(query_lower),   # Position of match
            x["role_name"]  # Alphabetical
        ))
        
        return results
    
    @classmethod
    def get_roles_by_category(cls, category_name: str) -> List[str]:
        """Get roles by category name."""
        for category in cls.ALL_CATEGORIES:
            if category["category_name"].lower() == category_name.lower():
                return category["roles"]
        return []
    
    @classmethod
    def get_category_for_role(cls, role_name: str) -> str:
        """Get category name for a specific role."""
        for category in cls.ALL_CATEGORIES:
            if role_name in category["roles"]:
                return category["category_name"]
        return "General"


def create_job_roles_endpoint(app):
    """
    Create the /job-roles API endpoint.
    
    Args:
        app: Flask application instance
    """
    from flask import jsonify, request
    
    @app.route('/job-roles', methods=['GET'])
    def get_job_roles():
        """
        API endpoint to get all job roles grouped by categories.
        
        Returns:
            JSON response with job roles categorized
        """
        try:
            job_roles_config = JobRolesConfig()
            categories = job_roles_config.get_all_categories()
            
            return jsonify({
                'success': True,
                'data': {
                    'categories': categories,
                    'total_roles': len(job_roles_config.get_all_roles()),
                    'total_categories': len(categories)
                }
            }), 200
            
        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Server error',
                'message': f'An error occurred: {str(e)}'
            }), 500
    
    @app.route('/job-roles/search', methods=['GET'])
    def search_job_roles():
        """
        API endpoint to search job roles by query.
        
        Query parameter:
        - q: search query string
        
        Returns:
            JSON response with matching roles
        """
        try:
            query = request.args.get('q', '').strip()
            
            if not query:
                return jsonify({
                    'success': False,
                    'error': 'Missing parameter',
                    'message': 'Search query parameter "q" is required'
                }), 400
            
            job_roles_config = JobRolesConfig()
            results = job_roles_config.search_roles(query)
            
            return jsonify({
                'success': True,
                'data': {
                    'query': query,
                    'results': results,
                    'total_results': len(results)
                }
            }), 200
            
        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Server error',
                'message': f'An error occurred: {str(e)}'
            }), 500


def get_sample_job_roles() -> Dict:
    """
    Get sample job roles data for testing.
    
    Returns:
        Dict: Sample job roles structure
    """
    return {
        "categories": [
            {
                "category_name": "Software & Engineering",
                "roles": [
                    "Software Engineer",
                    "Frontend Developer", 
                    "Backend Developer",
                    "Full Stack Developer"
                ]
            },
            {
                "category_name": "Data & AI",
                "roles": [
                    "Data Analyst",
                    "Data Scientist",
                    "Machine Learning Engineer"
                ]
            }
        ],
        "total_roles": 7,
        "total_categories": 2
    }