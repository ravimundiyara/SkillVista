"""
API test script for Skill Gap Analysis

This script tests the /skill-gap-analysis endpoint with sample data.
"""

import requests
import json


def test_skill_gap_analysis_api():
    """Test the /skill-gap-analysis API endpoint."""
    
    print("Testing Skill Gap Analysis API")
    print("=" * 40)
    
    # Sample resume data (extracted from resume analysis)
    sample_resume_data = {
        "skills": [
            "Python", "JavaScript", "React", "HTML", "CSS", "Git",
            "SQL", "Node.js", "Docker", "AWS"
        ],
        "education": [],
        "experience": [],
        "projects": [],
        "certifications": []
    }
    
    # Test data for the API
    test_data = {
        "target_role": "Frontend Developer",
        "extracted_resume_data": sample_resume_data
    }
    
    try:
        # Test the API
        url = 'http://localhost:5000/skill-gap-analysis'
        headers = {'Content-Type': 'application/json'}
        
        response = requests.post(url, json=test_data, headers=headers)
        result = response.json()
        
        print(f"Status Code: {response.status_code}")
        
        if result.get('success'):
            data = result['data']
            print("✅ API call successful!")
            print(f"   Target Role: {data.get('target_role')}")
            print(f"   Matched Skills: {len(data.get('matched_skills', []))}")
            print(f"   Missing Skills: {len(data.get('missing_skills', []))}")
            print(f"   Match Percentage: {data.get('match_percentage')}%")
            print(f"   Recommendation Level: {data.get('recommendation_level')}")
            
            # Print some matched skills
            matched_skills = data.get('matched_skills', [])
            if matched_skills:
                print(f"   Sample Matched Skills: {', '.join(matched_skills[:3])}")
            
            # Print some missing skills
            missing_skills = data.get('missing_skills', [])
            if missing_skills:
                print(f"   Sample Missing Skills: {', '.join(missing_skills[:3])}")
            
            return True
        else:
            print(f"❌ API call failed: {result.get('message', 'Unknown error')}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to the API. Make sure the Flask server is running on http://localhost:5000")
        return False
    except Exception as e:
        print(f"❌ Error testing API: {e}")
        return False


def test_skill_gap_analysis_api_errors():
    """Test error handling in the /skill-gap-analysis API endpoint."""
    
    print("\nTesting Skill Gap Analysis API Error Handling")
    print("=" * 50)
    
    test_cases = [
        {
            "name": "Missing target_role",
            "data": {
                "extracted_resume_data": {"skills": ["Python", "JavaScript"]}
            },
            "expected_error": "target_role is required"
        },
        {
            "name": "Missing extracted_resume_data",
            "data": {
                "target_role": "Frontend Developer"
            },
            "expected_error": "extracted_resume_data is required"
        },
        {
            "name": "Invalid skills format",
            "data": {
                "target_role": "Frontend Developer",
                "extracted_resume_data": {"skills": "Python, JavaScript"}
            },
            "expected_error": "skills must be an array"
        },
        {
            "name": "Unknown role",
            "data": {
                "target_role": "Unknown Role",
                "extracted_resume_data": {"skills": ["Python", "JavaScript"]}
            },
            "expected_error": "Role 'Unknown Role' not found in skill mapping"
        }
    ]
    
    url = 'http://localhost:5000/skill-gap-analysis'
    headers = {'Content-Type': 'application/json'}
    
    all_passed = True
    
    for test_case in test_cases:
        try:
            response = requests.post(url, json=test_case["data"], headers=headers)
            result = response.json()
            
            print(f"\nTest: {test_case['name']}")
            print(f"Expected Error: {test_case['expected_error']}")
            
            if not result.get('success'):
                actual_error = result.get('message', '')
                if test_case['expected_error'] in actual_error:
                    print("✅ Error handling works correctly")
                else:
                    print(f"❌ Unexpected error message: {actual_error}")
                    all_passed = False
            else:
                print("❌ Expected error but got success response")
                all_passed = False
                
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
            all_passed = False
    
    return all_passed


def test_available_roles_api():
    """Test the /available-roles API endpoint."""
    
    print("\nTesting Available Roles API")
    print("=" * 30)
    
    try:
        url = 'http://localhost:5000/available-roles'
        response = requests.get(url)
        result = response.json()
        
        print(f"Status Code: {response.status_code}")
        
        if result.get('success'):
            data = result['data']
            roles = data.get('available_roles', [])
            total_roles = data.get('total_roles', 0)
            
            print("✅ API call successful!")
            print(f"   Total Roles: {total_roles}")
            print(f"   Available Roles:")
            for role in roles:
                print(f"     - {role}")
            
            return True
        else:
            print(f"❌ API call failed: {result.get('message', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing API: {e}")
        return False


def run_api_tests():
    """Run all API tests."""
    print("🧪 Running Skill Gap Analysis API Tests\n")
    
    tests = [
        test_available_roles_api,
        test_skill_gap_analysis_api,
        test_skill_gap_analysis_api_errors
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test {test.__name__} failed with exception: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 API Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All API tests passed!")
        return True
    else:
        print("⚠️  Some API tests failed.")
        return False


if __name__ == "__main__":
    run_api_tests()