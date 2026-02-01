"""
Text Preprocessing for Resume Analysis

This module contains functions for cleaning and preprocessing resume text
to improve NLP extraction accuracy.
"""

import re
import string
from typing import List, Set


def clean_text(text: str) -> str:
    """
    Clean and normalize resume text.
    
    Args:
        text (str): Raw text extracted from resume
        
    Returns:
        str: Cleaned text ready for NLP processing
    """
    if not text or not isinstance(text, str):
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove extra whitespace and normalize
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    
    # Remove special characters but keep important ones for emails, URLs, etc.
    # Keep: letters, numbers, spaces, @, ., -, _, /, (, ), [, ], #, +, &
    text = re.sub(r'[^\w\s@.\-_/()\[\]#&+]', ' ', text)
    
    # Normalize common resume formatting
    text = re.sub(r'\n+', '\n', text)  # Multiple newlines to single
    text = re.sub(r'\t+', ' ', text)   # Tabs to spaces
    
    # Remove excessive punctuation
    text = re.sub(r'[!?:;]+', ' ', text)
    
    # Clean up multiple spaces again after punctuation removal
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    
    return text


def extract_emails(text: str) -> List[str]:
    """
    Extract email addresses from text.
    
    Args:
        text (str): Cleaned resume text
        
    Returns:
        List[str]: List of email addresses found
    """
    if not text:
        return []
    
    # Email regex pattern
    email_pattern = r'\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b'
    emails = re.findall(email_pattern, text, re.IGNORECASE)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_emails = []
    for email in emails:
        email_lower = email.lower()
        if email_lower not in seen:
            seen.add(email_lower)
            unique_emails.append(email)  # Keep original case
    
    return unique_emails


def extract_phone_numbers(text: str) -> List[str]:
    """
    Extract phone numbers from text.
    
    Args:
        text (str): Cleaned resume text
        
    Returns:
        List[str]: List of phone numbers found
    """
    if not text:
        return []
    
    # Common phone number patterns
    phone_patterns = [
        r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b',  # US format
        r'\b\(\d{3}\)\s?\d{3}[-.\s]?\d{4}\b',  # (XXX) XXX-XXXX
        r'\b\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}\b',  # International
        r'\b\d{10}\b',  # 10 digit without separators
    ]
    
    phones = []
    for pattern in phone_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        phones.extend(matches)
    
    # Clean and format phone numbers
    cleaned_phones = []
    for phone in phones:
        # Remove non-digit characters for comparison
        digits_only = re.sub(r'\D', '', phone)
        if len(digits_only) >= 10:  # Valid phone number should have at least 10 digits
            cleaned_phones.append(phone)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_phones = []
    for phone in cleaned_phones:
        digits_only = re.sub(r'\D', '', phone)
        if digits_only not in seen:
            seen.add(digits_only)
            unique_phones.append(phone)
    
    return unique_phones


def extract_urls(text: str) -> List[str]:
    """
    Extract URLs from text (LinkedIn, portfolio, etc.).
    
    Args:
        text (str): Cleaned resume text
        
    Returns:
        List[str]: List of URLs found
    """
    if not text:
        return []
    
    # URL regex pattern
    url_pattern = r'\b(?:https?://)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)'
    urls = re.findall(url_pattern, text, re.IGNORECASE)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_urls = []
    for url in urls:
        url_lower = url.lower()
        if url_lower not in seen:
            seen.add(url_lower)
            unique_urls.append(url)  # Keep original case
    
    return unique_urls


def split_into_sections(text: str) -> dict:
    """
    Split resume text into logical sections based on common headings.
    
    Args:
        text (str): Cleaned resume text
        
    Returns:
        dict: Dictionary with section names as keys and content as values
    """
    if not text:
        return {}
    
    # Common resume section headings
    section_patterns = {
        'contact': r'(?:contact|personal|details?)\s*information?',
        'summary': r'(?:professional\s+)?summary|objective|profile',
        'experience': r'(?:work\s+)?experience|employment|career\s+history|professional\s+experience',
        'education': r'education|academic\s+background|qualifications',
        'skills': r'skills?|competencies|technical\s+skills|core\s+competencies',
        'projects': r'projects?|portfolio|achievements?',
        'certifications': r'certifications?|licenses?|credentials?|training',
        'languages': r'languages?',
        'awards': r'awards?|honors?|recognitions?',
    }
    
    sections = {}
    text_lines = text.split('\n')
    
    current_section = None
    section_content = []
    
    for line in text_lines:
        line = line.strip()
        if not line:
            continue
            
        # Check if this line matches a section heading
        section_found = False
        for section_name, pattern in section_patterns.items():
            if re.search(pattern, line, re.IGNORECASE):
                # Save previous section
                if current_section and section_content:
                    sections[current_section] = '\n'.join(section_content).strip()
                
                # Start new section
                current_section = section_name
                section_content = []
                section_found = True
                break
        
        if not section_found and current_section:
            section_content.append(line)
    
    # Save the last section
    if current_section and section_content:
        sections[current_section] = '\n'.join(section_content).strip()
    
    return sections


def preprocess_resume_text(text: str) -> dict:
    """
    Complete preprocessing pipeline for resume text.
    
    Args:
        text (str): Raw resume text
        
    Returns:
        dict: Preprocessed data including cleaned text, extracted info, and sections
    """
    # Clean the text
    cleaned_text = clean_text(text)
    
    # Extract key information
    emails = extract_emails(cleaned_text)
    phones = extract_phone_numbers(cleaned_text)
    urls = extract_urls(cleaned_text)
    
    # Split into sections
    sections = split_into_sections(cleaned_text)
    
    return {
        'cleaned_text': cleaned_text,
        'emails': emails,
        'phone_numbers': phones,
        'urls': urls,
        'sections': sections
    }