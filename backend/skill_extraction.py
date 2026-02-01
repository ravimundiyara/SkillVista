"""
Skill Extraction for Resume Analysis

This module extracts technical and soft skills from resume text
using predefined keyword lists and pattern matching.
"""

import re
from typing import List, Set, Dict, Tuple
from collections import defaultdict

from skill_keywords import (
    TECHNICAL_SKILLS, SOFT_SKILLS, EDUCATION_KEYWORDS,
    EXPERIENCE_KEYWORDS, PROJECT_KEYWORDS, CERTIFICATION_KEYWORDS
)


def extract_skills_from_text(text: str, skill_keywords: Set[str]) -> List[str]:
    """
    Extract skills from text using keyword matching.
    
    Args:
        text (str): Cleaned resume text
        skill_keywords (Set[str]): Set of skill keywords to search for
        
    Returns:
        List[str]: List of skills found in the text
    """
    if not text or not skill_keywords:
        return []
    
    text_lower = text.lower()
    found_skills = set()
    
    # Sort keywords by length (longer keywords first) to match multi-word skills first
    sorted_keywords = sorted(skill_keywords, key=len, reverse=True)
    
    for skill in sorted_keywords:
        skill_lower = skill.lower()
        
        # Use word boundaries to avoid partial matches
        # For multi-word skills, we need more flexible matching
        if len(skill_lower.split()) > 1:
            # For multi-word skills, check if the phrase exists
            if skill_lower in text_lower:
                found_skills.add(skill)
        else:
            # For single-word skills, use word boundaries
            pattern = r'\b' + re.escape(skill_lower) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.add(skill)
    
    return sorted(list(found_skills))


def extract_technical_skills(text: str) -> List[str]:
    """
    Extract technical skills from resume text.
    
    Args:
        text (str): Cleaned resume text
        
    Returns:
        List[str]: List of technical skills found
    """
    return extract_skills_from_text(text, TECHNICAL_SKILLS)


def extract_soft_skills(text: str) -> List[str]:
    """
    Extract soft skills from resume text.
    
    Args:
        text (str): Cleaned resume text
        
    Returns:
        List[str]: List of soft skills found
    """
    return extract_skills_from_text(text, SOFT_SKILLS)


def extract_skills_by_section(text: str, sections: Dict[str, str]) -> Dict[str, List[str]]:
    """
    Extract skills from different sections of the resume.
    
    Args:
        text (str): Cleaned resume text
        sections (Dict[str, str]): Dictionary of resume sections
        
    Returns:
        Dict[str, List[str]]: Skills extracted from each section
    """
    skills_by_section = {}
    
    for section_name, section_content in sections.items():
        if section_content and section_name in ['skills', 'experience', 'projects']:
            technical_skills = extract_technical_skills(section_content)
            soft_skills = extract_soft_skills(section_content)
            
            skills_by_section[section_name] = {
                'technical': technical_skills,
                'soft': soft_skills
            }
    
    return skills_by_section


def extract_all_skills(text: str, sections: Dict[str, str] = None) -> Dict[str, List[str]]:
    """
    Extract all skills from resume text.
    
    Args:
        text (str): Cleaned resume text
        sections (Dict[str, str], optional): Dictionary of resume sections
        
    Returns:
        Dict[str, List[str]]: All skills categorized by type
    """
    # Extract skills from the entire text
    technical_skills = extract_technical_skills(text)
    soft_skills = extract_soft_skills(text)
    
    result = {
        'technical': technical_skills,
        'soft': soft_skills,
        'all': sorted(list(set(technical_skills + soft_skills)))
    }
    
    # If sections are provided, extract skills by section
    if sections:
        skills_by_section = extract_skills_by_section(text, sections)
        result['by_section'] = skills_by_section
    
    return result


def extract_skill_level_indicators(text: str) -> Dict[str, List[str]]:
    """
    Extract skill level indicators from resume text.
    
    Args:
        text (str): Cleaned resume text
        
    Returns:
        Dict[str, List[str]]: Skills categorized by proficiency level
    """
    if not text:
        return {}
    
    text_lower = text.lower()
    
    # Skill level indicators
    level_patterns = {
        'expert': [
            r'\bexpert\b', r'\bexpertise\b', r'\bmaster\b', r'\badvanced\b', r'\bproficient\b',
            r'\bhighly skilled\b', r'\bspecialist\b', r'\bseasoned\b', r'\bveteran\b'
        ],
        'intermediate': [
            r'\bintermediate\b', r'\bmoderate\b', r'\bworking knowledge\b', r'\bfamiliar\b',
            r'\bknowledgeable\b', r'\bcompetent\b', r'\bcapable\b', r'\badequate\b'
        ],
        'beginner': [
            r'\bbeginner\b', r'\bbasic\b', r'\bfundamental\b', r'\bintroductory\b', r'\belementary\b',
            r'\bentry level\b', r'\bnewbie\b', r'\bnovice\b', r'\btrainee\b'
        ]
    }
    
    skills_by_level = {level: [] for level in level_patterns.keys()}
    
    # Extract technical skills and check their context for level indicators
    technical_skills = extract_technical_skills(text)
    
    for skill in technical_skills:
        skill_lower = skill.lower()
        
        # Look for the skill in context with level indicators
        for level, patterns in level_patterns.items():
            for pattern in patterns:
                # Look for skill near level indicator (within 5 words)
                combined_pattern = r'(?:' + re.escape(skill_lower) + r'.{0,50}' + pattern + r'|' + pattern + r'.{0,50}' + re.escape(skill_lower) + r')'
                if re.search(combined_pattern, text_lower, re.IGNORECASE):
                    if skill not in skills_by_level[level]:
                        skills_by_level[level].append(skill)
                    break
    
    return skills_by_level


def extract_skill_context(text: str, skills: List[str]) -> Dict[str, str]:
    """
    Extract context around skills in the resume text.
    
    Args:
        text (str): Cleaned resume text
        skills (List[str]): List of skills to find context for
        
    Returns:
        Dict[str, str]: Context snippets for each skill
    """
    if not text or not skills:
        return {}
    
    context_dict = {}
    text_lower = text.lower()
    
    # Split text into sentences for context extraction
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    for skill in skills:
        skill_lower = skill.lower()
        context_snippets = []
        
        for sentence in sentences:
            sentence_lower = sentence.lower()
            if skill_lower in sentence_lower:
                # Clean up the sentence
                cleaned_sentence = re.sub(r'\s+', ' ', sentence.strip())
                if cleaned_sentence and len(cleaned_sentence) > 10:  # Skip very short sentences
                    context_snippets.append(cleaned_sentence)
        
        if context_snippets:
            # Take the first few relevant sentences as context
            context_dict[skill] = ' '.join(context_snippets[:3])
    
    return context_dict


def analyze_skill_distribution(text: str) -> Dict[str, int]:
    """
    Analyze the distribution of different types of skills.
    
    Args:
        text (str): Cleaned resume text
        
    Returns:
        Dict[str, int]: Count of skills by category
    """
    if not text:
        return {}
    
    # Define skill categories
    skill_categories = {
        'programming_languages': ['python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'c', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'lua', 'dart'],
        'web_technologies': ['html', 'css', 'sass', 'less', 'react', 'angular', 'vue', 'jquery', 'bootstrap', 'tailwind', 'webpack', 'vite', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'ruby on rails', 'asp.net'],
        'databases': ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server', 'cassandra', 'elasticsearch', 'dynamodb', 'firebase', 'neo4j'],
        'cloud_devops': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'github', 'gitlab', 'bitbucket', 'terraform', 'ansible', 'puppet', 'chef', 'ci/cd', 'devops', 'linux', 'ubuntu', 'centos', 'redhat', 'nginx', 'apache', 'load balancing'],
        'data_science': ['machine learning', 'deep learning', 'artificial intelligence', 'ai', 'ml', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'matplotlib', 'seaborn', 'jupyter', 'data analysis', 'data visualization', 'statistics', 'big data', 'hadoop', 'spark', 'hive', 'kafka', 'tableau', 'power bi'],
        'mobile': ['android', 'ios', 'flutter', 'react native', 'swift', 'kotlin', 'xamarin', 'ionic', 'cordova', 'mobile development', 'mobile app'],
        'soft_skills': list(SOFT_SKILLS)
    }
    
    text_lower = text.lower()
    distribution = {}
    
    for category, keywords in skill_categories.items():
        count = 0
        for keyword in keywords:
            if len(keyword.split()) > 1:
                if keyword in text_lower:
                    count += 1
            else:
                pattern = r'\b' + re.escape(keyword) + r'\b'
                if re.search(pattern, text_lower):
                    count += 1
        if count > 0:
            distribution[category] = count
    
    return distribution


def extract_skills_comprehensive(text: str, sections: Dict[str, str] = None) -> Dict[str, any]:
    """
    Comprehensive skill extraction with context and analysis.
    
    Args:
        text (str): Cleaned resume text
        sections (Dict[str, str], optional): Dictionary of resume sections
        
    Returns:
        Dict[str, any]: Comprehensive skill analysis
    """
    # Basic skill extraction
    all_skills = extract_all_skills(text, sections)
    
    # Skill level analysis
    skill_levels = extract_skill_level_indicators(text)
    
    # Context extraction
    context_info = extract_skill_context(text, all_skills['all'])
    
    # Distribution analysis
    distribution = analyze_skill_distribution(text)
    
    return {
        'skills': all_skills,
        'skill_levels': skill_levels,
        'context': context_info,
        'distribution': distribution,
        'summary': {
            'total_skills': len(all_skills['all']),
            'technical_skills': len(all_skills['technical']),
            'soft_skills': len(all_skills['soft']),
            'categories_with_skills': len(distribution)
        }
    }