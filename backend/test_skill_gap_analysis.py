"""
Test script for Skill Gap Analysis

This script tests the skill gap analysis functionality with sample data
and validates the JSON output format.
"""

import json
import requests
from skill_gap_analysis import SkillGapAnalyzer, get_sample_skill_gap_analysis


def test_skill_gap_analyzer_class():
    """Test the SkillGapAnalyzer class initialization."""
    print("Testing SkillGapAnalyzer class...")
    
    try:
        analyzer = SkillGapAnalyzer()
        print("✅ SkillGapAnalyzer initialized successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to initialize SkillGapAnalyzer: {e}")
        return False


def test_role_skills_mapping():
    """Test the role skills mapping functionality."""
    print("\nTesting role skills mapping...")
    
    try:
        analyzer = SkillGapAnalyzer()
        
        # Test getting skills for a known role
        frontend_skills = analyzer.get_required_skills("Frontend Developer")
        if not frontend_skills:
            print("❌ Frontend Developer skills not found")
            return False
        
        print(f"✅ Frontend Developer skills found: {len(frontend_skills)} skills")
        
        # Test case-insensitive matching
        frontend_skills_lower = analyzer.get_required_skills("frontend developer")
        if len(frontend_skills_lower) != len(frontend_skills):
            print("❌ Case-insensitive matching failed")
            return False
        
        print("✅ Case-insensitive role matching works")
        
        # Test unknown role
        unknown_skills = analyzer.get_required_skills("Unknown Role")
        if unknown_skills:
            print("❌ Unknown role should return empty list")
            return False
        
        print("✅ Unknown role handling works correctly")
        return True
        
    except Exception as e:
        print(f"❌ Role skills mapping test failed: {e}")
        return False


def test_skill_normalization():
    """Test skill normalization functionality."""
    print("\nTesting skill normalization...")
    
    try:
        analyzer = SkillGapAnalyzer()
        
        # Test basic normalization
        normalized = analyzer.normalize_skill("  JavaScript  ")
        if normalized != "javascript":
            print(f"❌ Basic normalization failed: expected 'javascript', got '{normalized}'")
            return False
        
        # Test alias handling
        aliases = [
            ("JS", "javascript"),
            ("ReactJS", "react"),
            ("Node", "node.js"),
            ("Python3", "python")
        ]
        
        for alias, expected in aliases:
            normalized = analyzer.normalize_skill(alias)
            if normalized != expected:
                print(f"❌ Alias normalization failed: '{alias}' -> expected '{expected}', got '{normalized}'")
                return False
        
        print("✅ Skill normalization works correctly")
        return True
        
    except Exception as e:
        print(f"❌ Skill normalization test failed: {e}")
        return False


def test_skill_gap_analysis():
    """Test the complete skill gap analysis functionality."""
    print("\nTesting skill gap analysis...")
    
    try:
        analyzer = SkillGapAnalyzer()
        
        # Test with sample resume skills
        resume_skills = [
            "Python", "JavaScript", "React", "HTML", "CSS", "Git",
            "SQL", "Node.js", "Docker", "AWS"
        ]
        
        target_role = "Frontend Developer"
        result = analyzer.analyze_skill_gap(resume_skills, target_role)
        
        # Validate result structure
        if not result:
            print("❌ Analysis result is None")
            return False
        
        required_fields = ['target_role', 'matched_skills', 'missing_skills', 'match_percentage', 'recommendation_level']
        for field in required_fields:
            if not hasattr(result, field):
                print(f"❌ Missing required field: {field}")
                return False
        
        print(f"✅ Analysis result structure is valid")
        print(f"   Target role: {result.target_role}")
        print(f"   Matched skills: {len(result.matched_skills)}")
        print(f"   Missing skills: {len(result.missing_skills)}")
        print(f"   Match percentage: {result.match_percentage}%")
        print(f"   Recommendation level: {result.recommendation_level.value}")
        
        # Validate match percentage calculation
        total_required = len(analyzer.get_required_skills(target_role))
        expected_percentage = (len(result.matched_skills) / total_required) * 100
        
        if abs(result.match_percentage - expected_percentage) > 0.01:
            print(f"❌ Match percentage calculation incorrect: expected {expected_percentage}, got {result.match_percentage}")
            return False
        
        print("✅ Match percentage calculation is correct")
        return True
        
    except Exception as e:
        print(f"❌ Skill gap analysis test failed: {e}")
        return False


def test_recommendation_levels():
    """Test recommendation level determination."""
    print("\nTesting recommendation levels...")
    
    try:
        analyzer = SkillGapAnalyzer()
        
        # Test different match percentages
        test_cases = [
            (30.0, "Beginner"),
            (50.0, "Intermediate"),
            (80.0, "Advanced"),
            (40.0, "Intermediate"),  # Boundary case
            (70.0, "Intermediate"),  # Boundary case (40-70% is Intermediate)
            (70.1, "Advanced")       # Just above 70%
        ]
        
        for percentage, expected_level in test_cases:
            level = analyzer._get_recommendation_level(percentage)
            if level.value != expected_level:
                print(f"❌ Recommendation level incorrect: {percentage}% -> expected '{expected_level}', got '{level.value}'")
                return False
        
        print("✅ Recommendation level determination works correctly")
        return True
        
    except Exception as e:
        print(f"❌ Recommendation level test failed: {e}")
        return False


def test_available_roles():
    """Test getting available roles."""
    print("\nTesting available roles...")
    
    try:
        analyzer = SkillGapAnalyzer()
        roles = analyzer.get_available_roles()
        
        if not roles:
            print("❌ No roles found in mapping")
            return False
        
        print(f"✅ Found {len(roles)} available roles:")
        for role in roles:
            print(f"   - {role}")
        
        return True
        
    except Exception as e:
        print(f"❌ Available roles test failed: {e}")
        return False


def test_json_serialization():
    """Test JSON serialization of analysis results."""
    print("\nTesting JSON serialization...")
    
    try:
        analyzer = SkillGapAnalyzer()
        
        # Create a test result
        resume_skills = ["Python", "JavaScript", "React"]
        target_role = "Frontend Developer"
        result = analyzer.analyze_skill_gap(resume_skills, target_role)
        
        # Convert to dictionary
        result_dict = analyzer.to_dict(result)
        
        # Validate dictionary structure
        required_keys = ['target_role', 'matched_skills', 'missing_skills', 'match_percentage', 'recommendation_level']
        for key in required_keys:
            if key not in result_dict:
                print(f"❌ Missing key in dictionary: {key}")
                return False
        
        # Test JSON serialization
        json_str = json.dumps(result_dict)
        parsed_back = json.loads(json_str)
        
        if parsed_back != result_dict:
            print("❌ JSON serialization/deserialization failed")
            return False
        
        print("✅ JSON serialization works correctly")
        return True
        
    except Exception as e:
        print(f"❌ JSON serialization test failed: {e}")
        return False


def test_sample_data():
    """Test the sample skill gap analysis data."""
    print("\nTesting sample data...")
    
    try:
        sample_data = get_sample_skill_gap_analysis()
        
        required_fields = ['target_role', 'matched_skills', 'missing_skills', 'match_percentage', 'recommendation_level']
        for field in required_fields:
            if field not in sample_data:
                print(f"❌ Missing required field in sample data: {field}")
                return False
        
        print("✅ Sample data structure is valid")
        print(f"   Target role: {sample_data['target_role']}")
        print(f"   Matched skills: {len(sample_data['matched_skills'])}")
        print(f"   Missing skills: {len(sample_data['missing_skills'])}")
        print(f"   Match percentage: {sample_data['match_percentage']}%")
        print(f"   Recommendation level: {sample_data['recommendation_level']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Sample data test failed: {e}")
        return False


def run_all_tests():
    """Run all tests and report results."""
    print("🧪 Running Skill Gap Analysis Tests\n")
    print("=" * 50)
    
    tests = [
        test_skill_gap_analyzer_class,
        test_role_skills_mapping,
        test_skill_normalization,
        test_skill_gap_analysis,
        test_recommendation_levels,
        test_available_roles,
        test_json_serialization,
        test_sample_data
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
        print("🎉 All tests passed! The Skill Gap Analysis is working correctly.")
        return True
    else:
        print("⚠️  Some tests failed. Please check the implementation.")
        return False


if __name__ == "__main__":
    # Change to the backend directory to ensure imports work correctly
    import os
    from pathlib import Path
    os.chdir(Path(__file__).parent)
    run_all_tests()