"""
Skill Gap Analysis Module

This module provides functionality to compare a user's resume skills
with required skills for a target role and generate skill gap analysis.
"""

from typing import Dict, List, Set, Tuple, Optional
from dataclasses import dataclass
from enum import Enum


class RecommendationLevel(Enum):
    """Recommendation levels based on skill match percentage."""
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


@dataclass
class SkillGapAnalysisResult:
    """Result of skill gap analysis."""
    target_role: str
    matched_skills: List[str]
    missing_skills: List[str]
    match_percentage: float
    recommendation_level: RecommendationLevel


class SkillGapAnalyzer:
    """Main class for skill gap analysis."""
    
    def __init__(self):
        """Initialize the skill gap analyzer with role-to-skills mapping."""
        self.role_skills_mapping = {
            "Frontend Developer": [
                "HTML", "CSS", "JavaScript", "React", "Vue", "Angular",
                "TypeScript", "Git", "CSS Frameworks", "Responsive Design",
                "APIs", "Webpack", "Node.js", "UI/UX Basics"
            ],
            "Backend Developer": [
                "Python", "Java", "Node.js", "SQL", "REST APIs", "GraphQL",
                "Database Design", "Authentication", "Security", "Docker",
                "AWS", "Microservices", "Git", "Linux", "Testing"
            ],
            "Data Scientist": [
                "Python", "Pandas", "NumPy", "Machine Learning", "SQL",
                "Statistics", "Data Visualization", "R", "TensorFlow",
                "PyTorch", "Data Cleaning", "Big Data", "Git", "Jupyter"
            ],
            "Full Stack Developer": [
                "HTML", "CSS", "JavaScript", "React", "Node.js", "Python",
                "SQL", "REST APIs", "Git", "Database Design", "Authentication",
                "Docker", "AWS", "Testing", "Agile", "Problem Solving"
            ],
            "Mobile Developer": [
                "Swift", "Kotlin", "Java", "React Native", "Flutter",
                "iOS Development", "Android Development", "APIs",
                "UI/UX Design", "Git", "Testing", "App Store Guidelines"
            ],
            "DevOps Engineer": [
                "Docker", "Kubernetes", "AWS", "Linux", "Git", "CI/CD",
                "Monitoring", "Scripting", "Infrastructure as Code",
                "Security", "Networking", "Troubleshooting", "Automation"
            ],
            "UI/UX Designer": [
                "Figma", "Adobe XD", "Sketch", "User Research", "Wireframing",
                "Prototyping", "User Testing", "Design Systems", "HTML",
                "CSS", "JavaScript Basics", "Communication", "Problem Solving"
            ],
            "Product Manager": [
                "Product Strategy", "Market Research", "User Stories",
                "Agile", "Scrum", "Kanban", "Analytics", "Communication",
                "Leadership", "Project Management", "Data Analysis",
                "Stakeholder Management"
            ]
        }
    
    def normalize_skill(self, skill: str) -> str:
        """
        Normalize a skill string for comparison.
        
        Args:
            skill (str): Raw skill string
            
        Returns:
            str: Normalized skill string
        """
        if not skill or not isinstance(skill, str):
            return ""
        
        # Convert to lowercase and remove extra whitespace
        normalized = skill.lower().strip()
        
        # Remove common variations and aliases
        # This helps with matching skills like "JS" vs "JavaScript"
        skill_aliases = {
            'js': 'javascript',
            'reactjs': 'react',
            'vuejs': 'vue',
            'angularjs': 'angular',
            'node': 'node.js',
            'python3': 'python',
            'py': 'python',
            'sql db': 'sql',
            'nosql': 'database',
            'git scm': 'git',
            'github': 'git',
            'docker container': 'docker',
            'k8s': 'kubernetes',
            'aws cloud': 'aws',
            'azure cloud': 'azure',
            'gcp cloud': 'gcp',
            'ml': 'machine learning',
            'ai': 'artificial intelligence',
            'ui': 'user interface',
            'ux': 'user experience'
        }
        
        # Check for aliases
        if normalized in skill_aliases:
            return skill_aliases[normalized]
        
        return normalized
    
    def get_required_skills(self, target_role: str) -> List[str]:
        """
        Get required skills for a target role.
        
        Args:
            target_role (str): Target job role
            
        Returns:
            List[str]: List of required skills for the role
        """
        # Normalize the role name for lookup
        normalized_role = target_role.lower().strip()
        
        # Try exact match first
        if target_role in self.role_skills_mapping:
            return self.role_skills_mapping[target_role]
        
        # Try case-insensitive match
        for role, skills in self.role_skills_mapping.items():
            if role.lower() == normalized_role:
                return skills
        
        # If no match found, return empty list
        return []
    
    def analyze_skill_gap(
        self, 
        resume_skills: List[str], 
        target_role: str
    ) -> SkillGapAnalysisResult:
        """
        Analyze skill gaps between resume skills and target role requirements.
        
        Args:
            resume_skills (List[str]): Skills extracted from resume
            target_role (str): Target job role
            
        Returns:
            SkillGapAnalysisResult: Analysis result with matched/missing skills
        """
        # Handle empty inputs
        if not resume_skills:
            resume_skills = []
        
        if not target_role:
            raise ValueError("Target role is required")
        
        # Get required skills for the target role
        required_skills = self.get_required_skills(target_role)
        
        if not required_skills:
            raise ValueError(f"Role '{target_role}' not found in skill mapping")
        
        # Normalize resume skills
        normalized_resume_skills = set()
        for skill in resume_skills:
            normalized_skill = self.normalize_skill(skill)
            if normalized_skill:  # Only add non-empty skills
                normalized_resume_skills.add(normalized_skill)
        
        # Normalize required skills
        normalized_required_skills = set()
        for skill in required_skills:
            normalized_skill = self.normalize_skill(skill)
            if normalized_skill:  # Only add non-empty skills
                normalized_required_skills.add(normalized_skill)
        
        # Find matched skills (intersection)
        matched_skills_normalized = normalized_resume_skills.intersection(normalized_required_skills)
        
        # Find missing skills (required but not in resume)
        missing_skills_normalized = normalized_required_skills - normalized_resume_skills
        
        # Convert back to original format for matched skills
        matched_skills = []
        for required_skill in required_skills:
            normalized_required = self.normalize_skill(required_skill)
            if normalized_required in matched_skills_normalized:
                matched_skills.append(required_skill)
        
        # Convert back to original format for missing skills
        missing_skills = []
        for required_skill in required_skills:
            normalized_required = self.normalize_skill(required_skill)
            if normalized_required in missing_skills_normalized:
                missing_skills.append(required_skill)
        
        # Calculate match percentage
        total_required = len(required_skills)
        matched_count = len(matched_skills)
        
        if total_required == 0:
            match_percentage = 0.0
        else:
            match_percentage = (matched_count / total_required) * 100
        
        # Determine recommendation level
        recommendation_level = self._get_recommendation_level(match_percentage)
        
        return SkillGapAnalysisResult(
            target_role=target_role,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            match_percentage=round(match_percentage, 2),
            recommendation_level=recommendation_level
        )
    
    def _get_recommendation_level(self, match_percentage: float) -> RecommendationLevel:
        """
        Determine recommendation level based on match percentage.
        
        Args:
            match_percentage (float): Skill match percentage
            
        Returns:
            RecommendationLevel: Beginner, Intermediate, or Advanced
        """
        if match_percentage < 40:
            return RecommendationLevel.BEGINNER
        elif match_percentage <= 70:
            return RecommendationLevel.INTERMEDIATE
        else:
            return RecommendationLevel.ADVANCED
    
    def get_available_roles(self) -> List[str]:
        """
        Get list of available target roles.
        
        Returns:
            List[str]: List of available roles
        """
        return list(self.role_skills_mapping.keys())
    
    def add_role_skills(self, role: str, skills: List[str]) -> None:
        """
        Add or update skills for a role.
        
        Args:
            role (str): Role name
            skills (List[str]): List of skills for the role
        """
        if not role or not skills:
            raise ValueError("Role and skills are required")
        
        self.role_skills_mapping[role] = skills
    
    def to_dict(self, result: SkillGapAnalysisResult) -> Dict:
        """
        Convert SkillGapAnalysisResult to dictionary for JSON serialization.
        
        Args:
            result (SkillGapAnalysisResult): Analysis result
            
        Returns:
            Dict: Dictionary representation of the result
        """
        return {
            "target_role": result.target_role,
            "matched_skills": result.matched_skills,
            "missing_skills": result.missing_skills,
            "match_percentage": result.match_percentage,
            "recommendation_level": result.recommendation_level.value
        }


def create_skill_gap_analysis_endpoint(app):
    """
    Create the /skill-gap-analysis API endpoint.
    
    Args:
        app: Flask application instance
    """
    from flask import request
    analyzer = SkillGapAnalyzer()
    
    @app.route('/skill-gap-analysis', methods=['POST'])
    def skill_gap_analysis():
        """
        API endpoint for skill gap analysis.
        
        Expects JSON with:
        - target_role: string
        - extracted_resume_data: object with skills array
        
        Returns:
            JSON response with skill gap analysis results
        """
        try:
            # Get JSON data from request
            data = request.get_json()
            
            if not data:
                return {
                    'success': False,
                    'error': 'Invalid request',
                    'message': 'Request must contain JSON data'
                }, 400
            
            # Extract required fields
            target_role = data.get('target_role')
            resume_data = data.get('extracted_resume_data')
            
            # Validate inputs
            if not target_role:
                return {
                    'success': False,
                    'error': 'Missing field',
                    'message': 'target_role is required'
                }, 400
            
            if not resume_data:
                return {
                    'success': False,
                    'error': 'Missing field',
                    'message': 'extracted_resume_data is required'
                }, 400
            
            # Extract skills from resume data
            resume_skills = resume_data.get('skills', [])
            
            if not isinstance(resume_skills, list):
                return {
                    'success': False,
                    'error': 'Invalid data',
                    'message': 'skills must be an array'
                }, 400
            
            # Perform skill gap analysis
            result = analyzer.analyze_skill_gap(resume_skills, target_role)
            
            # Convert result to dictionary
            result_dict = analyzer.to_dict(result)
            
            return {
                'success': True,
                'data': result_dict
            }, 200
            
        except ValueError as e:
            return {
                'success': False,
                'error': 'Validation error',
                'message': str(e)
            }, 400
        
        except Exception as e:
            return {
                'success': False,
                'error': 'Server error',
                'message': f'An error occurred during analysis: {str(e)}'
            }, 500
    
    @app.route('/available-roles', methods=['GET'])
    def get_available_roles():
        """
        API endpoint to get list of available target roles.
        
        Returns:
            JSON response with available roles
        """
        try:
            roles = analyzer.get_available_roles()
            
            return {
                'success': True,
                'data': {
                    'available_roles': roles,
                    'total_roles': len(roles)
                }
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'error': 'Server error',
                'message': f'An error occurred: {str(e)}'
            }, 500


def get_sample_skill_gap_analysis() -> Dict:
    """
    Get sample skill gap analysis result for testing.
    
    Returns:
        Dict: Sample skill gap analysis result
    """
    return {
        "target_role": "Frontend Developer",
        "matched_skills": ["HTML", "CSS", "JavaScript", "React"],
        "missing_skills": ["Vue", "Angular", "TypeScript", "Git", "CSS Frameworks", "Responsive Design", "APIs", "Webpack", "Node.js", "UI/UX Basics"],
        "match_percentage": 40.0,
        "recommendation_level": "Intermediate"
    }