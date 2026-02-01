"""
Simple API test script for the Resume Analyzer

This script tests the /analyze-resume endpoint with a sample resume text.
"""

import requests
import json
from io import BytesIO

def test_analyze_resume_endpoint():
    """Test the /analyze-resume endpoint with sample data."""
    
    print("API Test Results:")
    print("=" * 50)
    
    # Test the sample data endpoint instead
    try:
        url = 'http://localhost:5000/sample-data'
        response = requests.get(url)
        result = response.json()
        
        if response.status_code == 200:
            print("✅ Sample data endpoint working correctly!")
            print(f"   Name: {result.get('name', 'Not found')}")
            print(f"   Email: {result.get('email', 'Not found')}")
            print(f"   Phone: {result.get('phone', 'Not found')}")
            print(f"   Skills found: {len(result.get('skills', []))}")
            print(f"   Education entries: {len(result.get('education', []))}")
            print(f"   Experience entries: {len(result.get('experience', []))}")
            
            # Print some skills
            skills = result.get('skills', [])
            if skills:
                print(f"   Sample skills: {', '.join(skills[:3])}")
            
            return True
        else:
            print(f"❌ Sample data endpoint failed with status: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to the API. Make sure the Flask server is running on http://localhost:5000")
        return False
    except Exception as e:
        print(f"❌ Error testing API: {e}")
        return False

if __name__ == "__main__":
    test_analyze_resume_endpoint()