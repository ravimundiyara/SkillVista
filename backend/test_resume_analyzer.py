"""
Test script for Resume Analyzer

This script tests the resume analyzer functionality with sample data
and validates the JSON output format.
"""

import json
import tempfile
import os
import sys
from pathlib import Path

# Add the backend directory to the Python path
sys.path.insert(0, str(Path(__file__).parent))

# Import the resume analyzer
from resume_analyzer import ResumeAnalyzer, get_sample_resume_data


def test_sample_data():
    """Test the sample data structure."""
    print("Testing sample data structure...")
    sample_data = get_sample_resume_data()
    
    # Validate required fields
    required_fields = ['name', 'email', 'phone', 'education', 'skills', 'experience', 'projects', 'certifications']
    
    for field in required_fields:
        if field not in sample_data:
            print(f"❌ Missing required field: {field}")
            return False
        print(f"✅ Field '{field}' present")
    
    print("✅ Sample data structure is valid")
    return True


def test_resume_analyzer_class():
    """Test the ResumeAnalyzer class initialization."""
    print("\nTesting ResumeAnalyzer class...")
    
    try:
        analyzer = ResumeAnalyzer()
        print("✅ ResumeAnalyzer initialized successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to initialize ResumeAnalyzer: {e}")
        return False


def test_empty_resume_data():
    """Test getting empty resume data structure."""
    print("\nTesting empty resume data...")
    
    try:
        analyzer = ResumeAnalyzer()
        empty_data = analyzer.get_empty_resume_data()
        
        required_fields = ['name', 'email', 'phone', 'education', 'skills', 'experience', 'projects', 'certifications']
        
        for field in required_fields:
            if field not in empty_data:
                print(f"❌ Missing required field in empty data: {field}")
                return False
        
        print("✅ Empty resume data structure is valid")
        return True
    except Exception as e:
        print(f"❌ Failed to get empty resume data: {e}")
        return False


def test_text_preprocessing():
    """Test text preprocessing functionality."""
    print("\nTesting text preprocessing...")
    
    try:
        from text_preprocessing import preprocess_resume_text
        
        sample_text = """
        John Doe
        Email: john.doe@example.com
        Phone: +1 (555) 123-4567
        
        SUMMARY
        Experienced software developer with expertise in Python, JavaScript, and web technologies.
        
        EXPERIENCE
        Software Developer at Tech Corp (Jan 2021 - Present)
        - Developed web applications using React and Node.js
        - Collaborated with cross-functional teams
        
        EDUCATION
        Bachelor of Science in Computer Science, State University, 2020
        
        SKILLS
        Python, JavaScript, React, Node.js, AWS, Docker, Communication, Teamwork
        """
        
        result = preprocess_resume_text(sample_text)
        
        # Check if preprocessing worked
        if 'cleaned_text' not in result:
            print("❌ Cleaned text not found in preprocessing result")
            return False
        
        if 'emails' not in result or not result['emails']:
            print("❌ Emails not extracted")
            return False
        
        if 'phone_numbers' not in result or not result['phone_numbers']:
            print("❌ Phone numbers not extracted")
            return False
        
        print("✅ Text preprocessing works correctly")
        print(f"   - Emails found: {result['emails']}")
        print(f"   - Phone numbers found: {result['phone_numbers']}")
        print(f"   - Sections found: {list(result['sections'].keys())}")
        return True
        
    except Exception as e:
        print(f"❌ Text preprocessing failed: {e}")
        return False


def test_skill_extraction():
    """Test skill extraction functionality."""
    print("\nTesting skill extraction...")
    
    try:
        from skill_extraction import extract_skills_comprehensive
        
        sample_text = """
        I am a software developer with experience in Python, JavaScript, React, Node.js, AWS, and Docker.
        I have strong communication and teamwork skills. I am proficient in problem solving and time management.
        """
        
        result = extract_skills_comprehensive(sample_text)
        
        if 'skills' not in result:
            print("❌ Skills not extracted")
            return False
        
        if 'technical' not in result['skills'] or not result['skills']['technical']:
            print("❌ Technical skills not extracted")
            return False
        
        if 'soft' not in result['skills'] or not result['skills']['soft']:
            print("❌ Soft skills not extracted")
            return False
        
        print("✅ Skill extraction works correctly")
        print(f"   - Technical skills: {result['skills']['technical']}")
        print(f"   - Soft skills: {result['skills']['soft']}")
        print(f"   - Total skills: {result['summary']['total_skills']}")
        return True
        
    except Exception as e:
        print(f"❌ Skill extraction failed: {e}")
        return False


def test_nlp_extraction():
    """Test NLP entity extraction functionality."""
    print("\nTesting NLP entity extraction...")
    
    try:
        from nlp_extraction import extract_entities
        
        sample_text = """
        John Doe
        Email: john.doe@example.com
        Phone: +1 (555) 123-4567
        
        SUMMARY
        Experienced software developer with expertise in web technologies.
        
        EXPERIENCE
        Software Developer at Tech Corp (Jan 2021 - Present)
        - Developed web applications using React and Node.js
        
        EDUCATION
        Bachelor of Science in Computer Science, State University, 2020
        """
        
        result = extract_entities(sample_text)
        
        if 'name' not in result:
            print("❌ Name extraction failed")
            return False
        
        if 'education' not in result:
            print("❌ Education extraction failed")
            return False
        
        if 'experience' not in result:
            print("❌ Experience extraction failed")
            return False
        
        print("✅ NLP entity extraction works correctly")
        print(f"   - Name: {result['name']}")
        print(f"   - Education entries: {len(result['education'])}")
        print(f"   - Experience entries: {len(result['experience'])}")
        return True
        
    except Exception as e:
        print(f"❌ NLP entity extraction failed: {e}")
        return False


def test_file_type_detection():
    """Test file type detection."""
    print("\nTesting file type detection...")
    
    try:
        analyzer = ResumeAnalyzer()
        
        # Test different file extensions
        test_cases = [
            ('resume.pdf', 'pdf'),
            ('resume.docx', 'docx'),
            ('resume.doc', 'doc'),
            ('resume.txt', 'unknown'),
            ('resume', 'unknown')
        ]
        
        for file_path, expected_type in test_cases:
            detected_type = analyzer.detect_file_type(file_path)
            if detected_type != expected_type:
                print(f"❌ File type detection failed for {file_path}: expected {expected_type}, got {detected_type}")
                return False
        
        print("✅ File type detection works correctly")
        return True
        
    except Exception as e:
        print(f"❌ File type detection failed: {e}")
        return False


def test_json_output_format():
    """Test that the JSON output format matches requirements."""
    print("\nTesting JSON output format...")
    
    try:
        sample_data = get_sample_resume_data()
        
        # Validate JSON structure matches requirements
        required_structure = {
            "name": str,
            "email": str,
            "phone": str,
            "education": list,
            "skills": list,
            "experience": list,
            "projects": list,
            "certifications": list
        }
        
        for field, expected_type in required_structure.items():
            if field not in sample_data:
                print(f"❌ Missing required field: {field}")
                return False
            
            if not isinstance(sample_data[field], expected_type):
                print(f"❌ Field '{field}' has wrong type: expected {expected_type}, got {type(sample_data[field])}")
                return False
        
        print("✅ JSON output format is correct")
        print("   Required fields present with correct types:")
        for field in required_structure:
            print(f"   - {field}: {type(sample_data[field]).__name__}")
        return True
        
    except Exception as e:
        print(f"❌ JSON output format validation failed: {e}")
        return False


def run_all_tests():
    """Run all tests and report results."""
    print("🧪 Running Resume Analyzer Tests\n")
    print("=" * 50)
    
    tests = [
        test_sample_data,
        test_resume_analyzer_class,
        test_empty_resume_data,
        test_text_preprocessing,
        test_skill_extraction,
        test_nlp_extraction,
        test_file_type_detection,
        test_json_output_format
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
            print()  # Add spacing between tests
        except Exception as e:
            print(f"❌ Test {test.__name__} failed with exception: {e}\n")
    
    print("=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The Resume Analyzer is working correctly.")
        return True
    else:
        print("⚠️  Some tests failed. Please check the implementation.")
        return False


if __name__ == "__main__":
    # Change to the backend directory to ensure imports work correctly
    os.chdir(Path(__file__).parent)
    run_all_tests()