"""
NLP Entity Extraction for Resume Analysis

This module uses spaCy to extract structured information from resume text,
including names, education, work experience, and other entities.
"""

import re
import spacy
from typing import List, Dict, Tuple, Optional
from collections import defaultdict
from datetime import datetime

# Try to load spaCy model, fall back to basic if not available
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # If model not found, try to download it
    try:
        import subprocess
        import sys
        subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
        nlp = spacy.load("en_core_web_sm")
    except:
        # Fallback to basic English model if available
        try:
            nlp = spacy.load("en")
        except:
            nlp = None


def extract_name(text: str) -> Optional[str]:
    """
    Extract full name from resume text using spaCy NER.
    
    Args:
        text (str): Cleaned resume text
        
    Returns:
        Optional[str]: Extracted name or None if not found
    """
    if not text or not nlp:
        return None
    
    doc = nlp(text)
    
    # Look for PERSON entities
    person_entities = []
    for ent in doc.ents:
        if ent.label_ == "PERSON" and len(ent.text.split()) >= 2:
            person_entities.append(ent.text.strip())
    
    # Filter out common non-name patterns
    filtered_names = []
    for name in person_entities:
        # Skip if it contains common non-name words
        if any(word in name.lower() for word in ['inc', 'llc', 'corp', 'company', 'organization']):
            continue
        # Skip if it's too short or contains only initials
        if len(name) < 3 or re.match(r'^[A-Z]\.?$', name):
            continue
        filtered_names.append(name)
    
    # Return the most likely name (usually the first one or the longest)
    if filtered_names:
        # Sort by length (longer names are more likely to be full names)
        filtered_names.sort(key=len, reverse=True)
        return filtered_names[0]
    
    return None


def extract_education(text: str) -> List[Dict[str, str]]:
    """
    Extract education information from resume text.
    
    Args:
        text (str): Cleaned resume text
        
    Returns:
        List[Dict[str, str]]: List of education entries with degree, university, and year
    """
    if not text:
        return []
    
    education_entries = []
    
    # Common degree patterns
    degree_patterns = [
        r'(?:bachelor|b\.sc\.?|bsc|b\.tech\.?|btech|master|msc|m\.sc\.?|m\.tech\.?|mtech|ph\.?d\.?|doctorate|mba|bba|bca|mca)',
        r'(?:associate|diploma|certificate|training)',
    ]
    
    # University patterns
    university_patterns = [
        r'(?:university|college|institute|school|academy|campus)',
    ]
    
    # Year patterns
    year_patterns = [
        r'\b(?:19|20)\d{2}\b',  # 1900-2099
        r'\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*\d{4}\b',  # Month Year
        r'\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{4}\b',
    ]
    
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        line_lower = line.lower()
        
        # Check if line contains education keywords
        if any(re.search(pattern, line_lower, re.IGNORECASE) for pattern in degree_patterns + university_patterns):
            education_entry = {
                'degree': '',
                'university': '',
                'year': '',
                'details': line.strip()
            }
            
            # Extract degree
            for pattern in degree_patterns:
                match = re.search(pattern, line_lower, re.IGNORECASE)
                if match:
                    education_entry['degree'] = match.group(0).title()
                    break
            
            # Extract university
            for pattern in university_patterns:
                match = re.search(pattern, line_lower, re.IGNORECASE)
                if match:
                    # Try to extract the full university name
                    university_match = re.search(r'([A-Z][a-zA-Z\s&]+(?:University|College|Institute|School|Academy))', line, re.IGNORECASE)
                    if university_match:
                        education_entry['university'] = university_match.group(1).strip()
                    else:
                        education_entry['university'] = match.group(0).title()
                    break
            
            # Extract year
            for pattern in year_patterns:
                match = re.search(pattern, line_lower, re.IGNORECASE)
                if match:
                    education_entry['year'] = match.group(0)
                    break
            
            # Look for additional context in next few lines
            for j in range(i + 1, min(i + 3, len(lines))):
                next_line = lines[j].strip()
                if next_line and not re.search(r'(?:experience|skills|projects|certifications)', next_line.lower(), re.IGNORECASE):
                    education_entry['details'] += ' ' + next_line
            
            education_entries.append(education_entry)
    
    return education_entries


def extract_work_experience(text: str) -> List[Dict[str, str]]:
    """
    Extract work experience information from resume text.
    
    Args:
        text (str): Cleaned resume text
        
    Returns:
        List[Dict[str, str]]: List of work experience entries
    """
    if not text:
        return []
    
    experience_entries = []
    
    # Common experience indicators
    experience_indicators = [
        r'(?:experience|employment|work\s+history|professional\s+experience)',
        r'(?:company|organization|firm|corporation|inc|llc)',
        r'(?:position|role|title|job)',
    ]
    
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        line_lower = line.lower()
        
        # Look for company names or job titles
        if any(re.search(pattern, line_lower, re.IGNORECASE) for pattern in experience_indicators):
            experience_entry = {
                'company': '',
                'role': '',
                'duration': '',
                'details': line.strip()
            }
            
            # Extract company name (simple heuristic)
            company_match = re.search(r'([A-Z][a-zA-Z\s&]+(?:Company|Corporation|Inc|LLC|Ltd|Group|Organization))', line, re.IGNORECASE)
            if company_match:
                experience_entry['company'] = company_match.group(1).strip()
            
            # Extract role/title
            role_patterns = [
                r'(?:developer|engineer|manager|director|analyst|consultant|specialist|coordinator|officer|executive)',
                r'(?:senior|junior|lead|principal|associate)',
            ]
            
            for pattern in role_patterns:
                match = re.search(pattern, line_lower, re.IGNORECASE)
                if match:
                    experience_entry['role'] = match.group(0).title()
                    break
            
            # Extract duration
            duration_patterns = [
                r'\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*\d{4}\s*-\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*\d{4}\b',
                r'\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{4}\s*-\s*(?:january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{4}\b',
                r'\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*\d{4}\s*-\s*(?:present|current)\b',
                r'\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{4}\s*-\s*(?:present|current)\b',
                r'\b\d{4}\s*-\s*\d{4}\b',
            ]
            
            for pattern in duration_patterns:
                match = re.search(pattern, line_lower, re.IGNORECASE)
                if match:
                    experience_entry['duration'] = match.group(0)
                    break
            
            # Look for additional context in next few lines
            for j in range(i + 1, min(i + 4, len(lines))):
                next_line = lines[j].strip()
                if next_line and not re.search(r'(?:education|skills|projects|certifications)', next_line.lower(), re.IGNORECASE):
                    experience_entry['details'] += ' ' + next_line
                else:
                    break
            
            if experience_entry['company'] or experience_entry['role']:
                experience_entries.append(experience_entry)
    
    return experience_entries


def extract_projects(text: str) -> List[Dict[str, str]]:
    """
    Extract project information from resume text.
    
    Args:
        text (str): Cleaned resume text
        
    Returns:
        List[Dict[str, str]]: List of project entries
    """
    if not text:
        return []
    
    project_entries = []
    
    # Look for project sections
    project_indicators = [
        r'(?:projects?|portfolio|achievements?)',
        r'(?:developed|created|built|implemented)',
        r'(?:project\s*title|name\s*of\s*project)',
    ]
    
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        line_lower = line.lower()
        
        # Check if line indicates a project
        if any(re.search(pattern, line_lower, re.IGNORECASE) for pattern in project_indicators):
            project_entry = {
                'title': '',
                'description': line.strip(),
                'technologies': [],
                'duration': ''
            }
            
            # Extract project title
            title_match = re.search(r'(?:project\s*[:\-]?\s*|title\s*[:\-]?\s*)([A-Z][a-zA-Z\s]+)', line, re.IGNORECASE)
            if title_match:
                project_entry['title'] = title_match.group(1).strip()
            
            # Look for technologies used
            tech_keywords = ['python', 'java', 'javascript', 'react', 'angular', 'vue', 'node', 'django', 'flask', 'spring', 'aws', 'docker', 'kubernetes']
            for tech in tech_keywords:
                if tech in line_lower:
                    project_entry['technologies'].append(tech.title())
            
            # Look for duration
            duration_patterns = [
                r'\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*\d{4}\s*-\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*\d{4}\b',
                r'\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{4}\s*-\s*(?:january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{4}\b',
                r'\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*\d{4}\s*-\s*(?:present|current)\b',
                r'\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{4}\s*-\s*(?:present|current)\b',
            ]
            
            for pattern in duration_patterns:
                match = re.search(pattern, line_lower, re.IGNORECASE)
                if match:
                    project_entry['duration'] = match.group(0)
                    break
            
            # Look for additional context in next few lines
            for j in range(i + 1, min(i + 3, len(lines))):
                next_line = lines[j].strip()
                if next_line and not re.search(r'(?:experience|education|skills|certifications)', next_line.lower(), re.IGNORECASE):
                    project_entry['description'] += ' ' + next_line
                else:
                    break
            
            if project_entry['title'] or len(project_entry['description']) > 20:
                project_entries.append(project_entry)
    
    return project_entries


def extract_certifications(text: str) -> List[str]:
    """
    Extract certifications from resume text.
    
    Args:
        text (str): Cleaned resume text
        
    Returns:
        List[str]: List of certifications found
    """
    if not text:
        return []
    
    certifications = []
    
    # Common certification patterns
    cert_patterns = [
        r'(?:certified|certification|certificate)\s+[:\-]?\s*([A-Z][a-zA-Z\s]+)',
        r'(?:AWS|Microsoft|Google|Oracle|Cisco|PMP|Scrum)\s+[A-Z][a-zA-Z\s]+',
        r'\b(?:AWS|Azure|GCP|Oracle|Cisco|PMP|CSM|PSM)\b',
    ]
    
    lines = text.split('\n')
    
    for line in lines:
        line_lower = line.lower()
        
        # Check for certification keywords
        if any(word in line_lower for word in ['certified', 'certification', 'certificate']):
            for pattern in cert_patterns:
                matches = re.findall(pattern, line, re.IGNORECASE)
                for match in matches:
                    cert_name = match.strip()
                    if cert_name and cert_name not in certifications:
                        certifications.append(cert_name)
    
    return certifications


def extract_entities(text: str) -> Dict[str, any]:
    """
    Complete entity extraction pipeline for resume text.
    
    Args:
        text (str): Cleaned resume text
        
    Returns:
        Dict[str, any]: Extracted entities including name, education, experience, projects, certifications
    """
    if not text:
        return {
            'name': None,
            'education': [],
            'experience': [],
            'projects': [],
            'certifications': []
        }
    
    # Extract different types of entities
    name = extract_name(text)
    education = extract_education(text)
    experience = extract_work_experience(text)
    projects = extract_projects(text)
    certifications = extract_certifications(text)
    
    return {
        'name': name,
        'education': education,
        'experience': experience,
        'projects': projects,
        'certifications': certifications
    }