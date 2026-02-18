




































"""
Text Preprocessing Module

This module provides functions for preprocessing resume text,
including cleaning, normalization, and basic information extraction.
"""

import re
from typing import Dict, List, Tuple, Optional


def load_spacy_model():
    """
    Load the spaCy model for NLP processing.
    
    Returns:
        spacy.Language: Loaded spaCy model
    """
    try:
        import spacy
        return spacy.load("en_core_web_sm")
    except ImportError:
        raise ImportError(
            "SpaCy is not installed. Install it with: pip install spacy"
        )
    except OSError:
        raise ImportError(
            "SpaCy model 'en_core_web_sm' not found. "
            "Install it with: python -m spacy download en_core_web_sm"
        )


def clean_text(text: str) -> str:
    """
    Clean and normalize text by removing extra whitespace and special characters.
    
    Args:
        text (str): Raw text to clean
        
    Returns:
        str: Cleaned text
    """
    if not text:
        return ""
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s\.\,\;\:\-\(\)\&]', ' ', text)
    
    # Strip leading and trailing whitespace
    return text.strip()


def extract_emails(text: str) -> List[str]:
    """
    Extract email addresses from text.
    
    Args:
        text (str): Text to search for emails
        
    Returns:
        List[str]: List of found email addresses
    """
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    return re.findall(email_pattern, text)


def extract_phone_numbers(text: str) -> List[str]:
    """
    Extract phone numbers from text.
    
    Args:
        text (str): Text to search for phone numbers
        
    Returns:
        List[str]: List of found phone numbers
    """
    # Pattern for various phone number formats
    phone_patterns = [
        r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b',  # US format
        r'\b\(\d{3}\)\s?\d{3}[-.\s]?\d{4}\b',  # US format with parentheses
        r'\b\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}\b',  # International
    ]
    
    phones = []
    for pattern in phone_patterns:
        phones.extend(re.findall(pattern, text))
    
    return list(set(phones))  # Remove duplicates


def extract_urls(text: str) -> List[str]:
    """
    Extract URLs from text.
    
    Args:
        text (str): Text to search for URLs
        
    Returns:
        List[str]: List of found URLs
    """
    url_pattern = r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
    return re.findall(url_pattern, text)


def extract_dates(text: str) -> List[str]:
    """
    Extract dates from text.
    
    Args:
        text (str): Text to search for dates
        
    Returns:
        List[str]: List of found dates
    """
    date_patterns = [
        r'\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b',  # MM/DD/YYYY or similar
        r'\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b',  # Month DD, YYYY
        r'\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b',
    ]
    
    dates = []
    for pattern in date_patterns:
        dates.extend(re.findall(pattern, text, re.IGNORECASE))
    
    return dates


def extract_sections(text: str) -> Dict[str, str]:
    """
    Extract different sections from resume text.
    
    Args:
        text (str): Full resume text
        
    Returns:
        Dict[str, str]: Dictionary of section names and their content
    """
    # Common resume section headers
    section_headers = {
        'contact': r'contact|email|phone|address',
        'summary': r'summary|objective|profile',
        'experience': r'experience|work experience|employment history',
        'education': r'education|academic background|degrees',
        'skills': r'skills|competencies|technical skills',
        'projects': r'projects|portfolio|work samples',
        'certifications': r'certifications|certificates|licenses',
        'achievements': r'achievements|awards|honors',
        'languages': r'languages',
        'references': r'references'
    }
    
    sections = {}
    text_lower = text.lower()
    
    for section_name, pattern in section_headers.items():
        # Find section start
        match = re.search(pattern, text_lower)
        if match:
            start_pos = match.start()
            
            # Find next section or end of text
            next_sections = []
            for other_pattern in section_headers.values():
                if other_pattern != pattern:
                    other_matches = re.finditer(other_pattern, text_lower[start_pos + len(match.group()):])
                    for m in other_matches:
                        next_sections.append(start_pos + len(match.group()) + m.start())
            
            if next_sections:
                end_pos = min(next_sections)
            else:
                end_pos = len(text)
            
            # Extract section content
            section_content = text[start_pos:end_pos].strip()
            sections[section_name] = section_content
    
    return sections


def preprocess_resume_text(text: str) -> Dict[str, any]:
    """
    Main preprocessing function that combines all preprocessing steps.
    
    Args:
        text (str): Raw resume text
        
    Returns:
        Dict[str, any]: Preprocessed data including cleaned text, sections, and extracted info
    """
    if not text:
        return {
            'cleaned_text': '',
            'sections': {},
            'emails': [],
            'phone_numbers': [],
            'urls': [],
            'dates': []
        }
    
    # Clean the text
    cleaned_text = clean_text(text)
    
    # Extract basic information
    emails = extract_emails(cleaned_text)
    phone_numbers = extract_phone_numbers(cleaned_text)
    urls = extract_urls(cleaned_text)
    dates = extract_dates(cleaned_text)
    
    # Extract sections
    sections = extract_sections(cleaned_text)
    
    return {
        'cleaned_text': cleaned_text,
        'sections': sections,
        'emails': emails,
        'phone_numbers': phone_numbers,
        'urls': urls,
        'dates': dates
    }


def extract_education_info(text: str) -> List[Dict[str, str]]:
    """
    Extract education information from text.
    
    Args:
        text (str): Text to search for education info
        
    Returns:
        List[Dict[str, str]]: List of education entries
    """
    education_entries = []
    
    # Pattern for degree information
    degree_pattern = r'(\b(?:Bachelor|Master|Ph\.?D\.?|Associate|Diploma|Certificate)\b[^.\n]+(?:degree|program|major)[^.\n]*)'
    degrees = re.findall(degree_pattern, text, re.IGNORECASE)
    
    for degree in degrees:
        education_entries.append({
            'degree': degree.strip(),
            'institution': '',  # Would need more sophisticated parsing
            'year': ''  # Would need more sophisticated parsing
        })
    
    return education_entries


def extract_work_experience(text: str) -> List[Dict[str, str]]:
    """
    Extract work experience information from text.
    
    Args:
        text (str): Text to search for work experience
        
    Returns:
        List[Dict[str, str]]: List of work experience entries
    """
    experience_entries = []
    
    # Pattern for job titles and companies
    job_pattern = r'(\b(?:Senior|Junior|Lead|Principal|Staff|Associate|Assistant)\s+)?([A-Z][a-zA-Z\s]+)\s+at\s+([A-Z][a-zA-Z\s]+)'
    jobs = re.findall(job_pattern, text)
    
    for job in jobs:
        title = f"{job[0] if job[0] else ''} {job[1]}".strip()
        company = job[2]
        experience_entries.append({
            'title': title,
            'company': company,
            'duration': '',  # Would need more sophisticated parsing
            'description': ''  # Would need more sophisticated parsing
        })
    
    return experience_entries


def normalize_skill_name(skill: str) -> str:
    """
    Normalize skill names to standard format.
    
    Args:
        skill (str): Raw skill name
        
    Returns:
        str: Normalized skill name
    """
    # Convert to title case and remove extra whitespace
    normalized = skill.strip().title()
    
    # Common skill name variations and their standard forms
    skill_mappings = {
        'Js': 'JavaScript',
        'Reactjs': 'React',
        'Nodejs': 'Node.js',
        'Node': 'Node.js',
        'Python3': 'Python',
        'Py': 'Python',
        'Java': 'Java',
        'C++': 'C++',
        'C#': 'C#',
        'Dotnet': '.NET',
        'Dot Net': '.NET',
        'Dotnet Core': '.NET Core',
        'Dot Net Core': '.NET Core',
        'Aws': 'AWS',
        'Azure': 'Azure',
        'Gcp': 'GCP',
        'Google Cloud': 'Google Cloud Platform',
        'Sql': 'SQL',
        'Mysql': 'MySQL',
        'Postgresql': 'PostgreSQL',
        'Mongodb': 'MongoDB',
        'Mssql': 'SQL Server',
        'Html': 'HTML',
        'Css': 'CSS',
        'Javascript': 'JavaScript',
        'Typescript': 'TypeScript',
        'Angularjs': 'Angular',
        'Vuejs': 'Vue.js',
        'Jquery': 'jQuery',
        'Bootstrap': 'Bootstrap',
        'Django': 'Django',
        'Flask': 'Flask',
        'Spring': 'Spring',
        'Spring Boot': 'Spring Boot',
        'Laravel': 'Laravel',
        'Express': 'Express.js',
        'Git': 'Git',
        'Github': 'GitHub',
        'Gitlab': 'GitLab',
        'Docker': 'Docker',
        'Kubernetes': 'Kubernetes',
        'Jenkins': 'Jenkins',
        'Jira': 'Jira',
        'Confluence': 'Confluence',
        'Slack': 'Slack',
        'Teams': 'Microsoft Teams',
        'Office': 'Microsoft Office',
        'Excel': 'Microsoft Excel',
        'Word': 'Microsoft Word',
        'Powerpoint': 'Microsoft PowerPoint',
        'Outlook': 'Microsoft Outlook',
        'Photoshop': 'Adobe Photoshop',
        'Illustrator': 'Adobe Illustrator',
        'Premiere': 'Adobe Premiere Pro',
        'After Effects': 'Adobe After Effects'
    }
    
    # Apply mappings
    if normalized in skill_mappings:
        return skill_mappings[normalized]
    
    return normalized


def extract_skills_from_text(text: str) -> List[str]:
    """
    Extract skills from text using pattern matching.
    
    Args:
        text (str): Text to search for skills
        
    Returns:
        List[str]: List of extracted skills
    """
    # Common skill patterns
    skill_patterns = [
        r'\b(?:Python|Java|JavaScript|TypeScript|C\+\+|C#|Ruby|PHP|Go|Swift|Kotlin|Rust|Scala)\b',
        r'\b(?:React|Angular|Vue\.js|Node\.js|Django|Flask|Spring|Laravel)\b',
        r'\b(?:AWS|Azure|Google Cloud|Docker|Kubernetes|Jenkins)\b',
        r'\b(?:Git|GitHub|GitLab|Bitbucket)\b',
        r'\b(?:SQL|MySQL|PostgreSQL|MongoDB|Redis|Elasticsearch)\b',
        r'\b(?:HTML|CSS|Sass|Less|Bootstrap|Tailwind)\b',
        r'\b(?:Agile|Scrum|Kanban|Waterfall|DevOps|CI/CD)\b'
    ]
    
    skills = []
    for pattern in skill_patterns:
        found_skills = re.findall(pattern, text, re.IGNORECASE)
        skills.extend(found_skills)
    
    # Normalize and deduplicate
    normalized_skills = [normalize_skill_name(skill) for skill in skills]
    return list(set(normalized_skills))


def get_text_statistics(text: str) -> Dict[str, int]:
    """
    Get basic statistics about the text.
    
    Args:
        text (str): Text to analyze
        
    Returns:
        Dict[str, int]: Text statistics
    """
    if not text:
        return {
            'total_characters': 0,
            'total_words': 0,
            'total_lines': 0,
            'total_sentences': 0
        }
    
    return {
        'total_characters': len(text),
        'total_words': len(text.split()),
        'total_lines': len(text.split('\n')),
        'total_sentences': len(re.findall(r'[.!?]+', text))
    }


def preprocess_for_nlp(text: str) -> str:
    """
    Preprocess text specifically for NLP tasks.
    
    Args:
        text (str): Raw text
        
    Returns:
        str: Preprocessed text for NLP
    """
    # Remove special characters but keep important punctuation
    text = re.sub(r'[^\w\s\.\,\;\:\-\(\)\&]', ' ', text)
    
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Convert to lowercase for consistency
    text = text.lower()
    
    return text.strip()