"""
Resume Analyzer - Main Module

This module provides the main functionality for analyzing resumes,
including text extraction, preprocessing, and structured data extraction.
"""

import os
import re
from typing import Dict, List, Any, Optional, Tuple
from pathlib import Path

from flask import request
from text_preprocessing import preprocess_resume_text, extract_emails, extract_phone_numbers
from nlp_extraction import extract_entities
from skill_extraction import extract_skills_comprehensive
from skill_keywords import ALL_KEYWORDS


class ResumeAnalyzer:
    """Main class for resume analysis and structured data extraction."""
    
    def __init__(self):
        """Initialize the resume analyzer."""
        pass
    
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """
        Extract text from a PDF file.
        
        Args:
            pdf_path (str): Path to the PDF file
            
        Returns:
            str: Extracted text from the PDF
        """
        try:
            import pdfplumber
        except ImportError:
            raise ImportError("pdfplumber is required for PDF extraction. Install it with: pip install pdfplumber")
        
        try:
            with pdfplumber.open(pdf_path) as pdf:
                text_pages = []
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        text_pages.append(text)
                return '\n\n'.join(text_pages)
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")
    
    def extract_text_from_docx(self, docx_path: str) -> str:
        """
        Extract text from a Word document (.docx).
        
        Args:
            docx_path (str): Path to the Word document
            
        Returns:
            str: Extracted text from the document
        """
        try:
            from docx import Document
        except ImportError:
            raise ImportError("python-docx is required for DOCX extraction. Install it with: pip install python-docx")
        
        try:
            doc = Document(docx_path)
            text_paragraphs = []
            for paragraph in doc.paragraphs:
                if paragraph.text.strip():
                    text_paragraphs.append(paragraph.text)
            return '\n'.join(text_paragraphs)
        except Exception as e:
            raise Exception(f"Error extracting text from DOCX: {str(e)}")
    
    def extract_text_from_doc(self, doc_path: str) -> str:
        """
        Extract text from a legacy Word document (.doc).
        
        Args:
            doc_path (str): Path to the Word document
            
        Returns:
            str: Extracted text from the document
        """
        try:
            import textract
        except ImportError:
            raise ImportError("textract is required for DOC extraction. Install it with: pip install textract")
        
        try:
            text = textract.process(doc_path).decode('utf-8')
            return text
        except Exception as e:
            raise Exception(f"Error extracting text from DOC: {str(e)}")
    
    def detect_file_type(self, file_path: str) -> str:
        """
        Detect the file type based on extension.
        
        Args:
            file_path (str): Path to the file
            
        Returns:
            str: File type ('pdf', 'docx', 'doc', or 'unknown')
        """
        file_extension = Path(file_path).suffix.lower()
        if file_extension == '.pdf':
            return 'pdf'
        elif file_extension == '.docx':
            return 'docx'
        elif file_extension == '.doc':
            return 'doc'
        else:
            return 'unknown'
    
    def extract_text_from_file(self, file_path: str) -> str:
        """
        Extract text from a file based on its type.
        
        Args:
            file_path (str): Path to the file
            
        Returns:
            str: Extracted text
        """
        file_type = self.detect_file_type(file_path)
        
        if file_type == 'pdf':
            return self.extract_text_from_pdf(file_path)
        elif file_type == 'docx':
            return self.extract_text_from_docx(file_path)
        elif file_type == 'doc':
            return self.extract_text_from_doc(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
    
    def analyze_resume_text(self, text: str) -> Dict[str, Any]:
        """
        Analyze resume text and extract structured information.
        
        Args:
            text (str): Raw resume text
            
        Returns:
            Dict[str, Any]: Structured resume data
        """
        if not text or not isinstance(text, str):
            return self.get_empty_resume_data()
        
        # Preprocess the text
        preprocessed = preprocess_resume_text(text)
        cleaned_text = preprocessed['cleaned_text']
        sections = preprocessed['sections']
        
        # Extract entities using NLP
        entities = extract_entities(cleaned_text)
        
        # Extract skills comprehensively
        skills_analysis = extract_skills_comprehensive(cleaned_text, sections)
        
        # Extract contact information
        emails = preprocessed['emails']
        phone_numbers = preprocessed['phone_numbers']
        
        # Build the final structured data
        resume_data = {
            'name': entities['name'],
            'email': emails[0] if emails else None,
            'phone': phone_numbers[0] if phone_numbers else None,
            'education': entities['education'],
            'skills': skills_analysis['skills']['all'],
            'experience': entities['experience'],
            'projects': entities['projects'],
            'certifications': entities['certifications'],
            'raw_sections': sections,
            'processing_metadata': {
                'total_skills_found': skills_analysis['summary']['total_skills'],
                'technical_skills_count': skills_analysis['summary']['technical_skills'],
                'soft_skills_count': skills_analysis['summary']['soft_skills'],
                'skill_categories': list(skills_analysis['distribution'].keys()),
                'sections_found': list(sections.keys())
            }
        }
        
        return resume_data
    
    def analyze_resume_file(self, file_path: str) -> Dict[str, Any]:
        """
        Analyze a resume file and extract structured information.
        
        Args:
            file_path (str): Path to the resume file
            
        Returns:
            Dict[str, Any]: Structured resume data
        """
        try:
            # Extract text from file
            raw_text = self.extract_text_from_file(file_path)
            
            # Analyze the extracted text
            return self.analyze_resume_text(raw_text)
            
        except Exception as e:
            return {
                'error': True,
                'message': str(e),
                'data': self.get_empty_resume_data()
            }
    
    def get_empty_resume_data(self) -> Dict[str, Any]:
        """
        Get an empty resume data structure.
        
        Returns:
            Dict[str, Any]: Empty resume data structure
        """
        return {
            'name': None,
            'email': None,
            'phone': None,
            'education': [],
            'skills': [],
            'experience': [],
            'projects': [],
            'certifications': [],
            'raw_sections': {},
            'processing_metadata': {
                'total_skills_found': 0,
                'technical_skills_count': 0,
                'soft_skills_count': 0,
                'skill_categories': [],
                'sections_found': []
            }
        }


def create_analyze_resume_endpoint(app):
    """
    Create the /analyze-resume API endpoint.
    
    Args:
        app: Flask application instance
    """
    analyzer = ResumeAnalyzer()
    
    @app.route('/analyze-resume', methods=['POST'])
    def analyze_resume():
        """
        API endpoint to analyze a resume file.
        
        Expects a multipart/form-data request with a file field named 'resume'.
        
        Returns:
            JSON response with structured resume data
        """
        # Check if file is present in request
        if 'resume' not in request.files:
            return {
                'success': False,
                'error': 'No file provided',
                'message': 'Please upload a resume file with the field name "resume"'
            }, 400
        
        file = request.files['resume']
        
        # Check if file has a name
        if not file or file.filename == '':
            return {
                'success': False,
                'error': 'No file selected',
                'message': 'Please select a file to upload'
            }, 400
        
        # Check file extension
        allowed_extensions = {'pdf', 'doc', 'docx'}
        if '.' not in file.filename:
            return {
                'success': False,
                'error': 'Invalid file',
                'message': f'File must have one of these extensions: {", ".join(allowed_extensions)}'
            }, 400
        
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        if file_extension not in allowed_extensions:
            return {
                'success': False,
                'error': 'Invalid file type',
                'message': f'File type not supported. Please upload a PDF, DOC, or DOCX file.'
            }, 400
        
        try:
            # Save file temporarily
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{file_extension}') as temp_file:
                file.save(temp_file.name)
                temp_file_path = temp_file.name
            
            # Analyze the resume
            result = analyzer.analyze_resume_file(temp_file_path)
            
            # Clean up temporary file
            os.unlink(temp_file_path)
            
            # Check if there was an error during analysis
            if result.get('error', False):
                return {
                    'success': False,
                    'error': 'Analysis failed',
                    'message': result['message']
                }, 500
            
            # Return successful analysis result
            return {
                'success': True,
                'data': result
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'error': 'Server error',
                'message': f'An error occurred while processing the file: {str(e)}'
            }, 500


def get_sample_resume_data() -> Dict[str, Any]:
    """
    Get sample resume data structure for testing.
    
    Returns:
        Dict[str, Any]: Sample resume data
    """
    return {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+1 (555) 123-4567",
        "education": [
            {
                "degree": "Bachelor of Science",
                "university": "State University",
                "year": "2020",
                "details": "Bachelor of Science in Computer Science, GPA: 3.8/4.0"
            }
        ],
        "skills": [
            "Python", "JavaScript", "React", "Node.js", "AWS", "Docker", 
            "Communication", "Teamwork", "Problem Solving"
        ],
        "experience": [
            {
                "company": "Tech Corp",
                "role": "Software Developer",
                "duration": "Jan 2021 - Present",
                "details": "Developing web applications using React and Node.js"
            }
        ],
        "projects": [
            {
                "title": "E-commerce Website",
                "description": "Full-stack e-commerce application with React frontend and Node.js backend",
                "technologies": ["React", "Node.js", "MongoDB"],
                "duration": "Mar 2022 - Jun 2022"
            }
        ],
        "certifications": [
            "AWS Certified Solutions Architect",
            "Google Analytics Certified"
        ],
        "raw_sections": {
            "contact": "John Doe\nEmail: john.doe@example.com\nPhone: +1 (555) 123-4567",
            "summary": "Experienced software developer with expertise in web technologies",
            "experience": "Software Developer at Tech Corp (Jan 2021 - Present)",
            "education": "BS in Computer Science, State University, 2020",
            "skills": "Python, JavaScript, React, Node.js, AWS, Docker"
        },
        "processing_metadata": {
            "total_skills_found": 9,
            "technical_skills_count": 6,
            "soft_skills_count": 3,
            "skill_categories": ["programming_languages", "web_technologies", "cloud_devops"],
            "sections_found": ["contact", "summary", "experience", "education", "skills"]
        }
    }