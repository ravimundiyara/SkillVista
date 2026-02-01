"""
Test script for Job Roles Configuration

This script tests the job roles functionality including
search, categorization, and API endpoints.
"""

import json
from job_roles import JobRolesConfig, get_sample_job_roles


def test_job_roles_config():
    """Test the JobRolesConfig class functionality."""
    print("Testing JobRolesConfig class...")
    
    try:
        config = JobRolesConfig()
        
        # Test getting all categories
        categories = config.get_all_categories()
        if not categories:
            print("❌ No categories found")
            return False
        
        print(f"✅ Found {len(categories)} categories")
        
        # Test getting all roles
        all_roles = config.get_all_roles()
        if not all_roles:
            print("❌ No roles found")
            return False
        
        print(f"✅ Found {len(all_roles)} total roles")
        
        # Test role search
        search_results = config.search_roles("Developer")
        if not search_results:
            print("❌ No search results for 'Developer'")
            return False
        
        print(f"✅ Found {len(search_results)} roles matching 'Developer'")
        
        # Test specific role search
        specific_results = config.search_roles("Frontend Developer")
        if not specific_results:
            print("❌ No exact match for 'Frontend Developer'")
            return False
        
        print(f"✅ Found exact match for 'Frontend Developer'")
        
        # Test case-insensitive search
        case_results = config.search_roles("developer")
        if len(case_results) != len(search_results):
            print("❌ Case-insensitive search failed")
            return False
        
        print("✅ Case-insensitive search works correctly")
        
        # Test category-based filtering
        engineering_roles = config.get_roles_by_category("Software & Engineering")
        if not engineering_roles:
            print("❌ No roles found for Software & Engineering category")
            return False
        
        print(f"✅ Found {len(engineering_roles)} roles in Software & Engineering category")
        
        # Test role category lookup
        category = config.get_category_for_role("Data Scientist")
        if not category:
            print("❌ Could not find category for Data Scientist")
            return False
        
        print(f"✅ Found category '{category}' for Data Scientist")
        
        return True
        
    except Exception as e:
        print(f"❌ JobRolesConfig test failed: {e}")
        return False


def test_search_functionality():
    """Test search functionality with various queries."""
    print("\nTesting search functionality...")
    
    try:
        config = JobRolesConfig()
        
        test_cases = [
            ("Engineer", 10),  # Should find many engineering roles
            ("Manager", 8),    # Should find management roles
            ("Analyst", 6),    # Should find analyst roles
            ("Developer", 9),  # Should find developer roles (9 found)
            ("Sales", 3),      # Should find sales roles
            ("HR", 3),         # Should find HR roles (3 found)
            ("Finance", 1),    # Should find finance roles (1 found)
            ("Marketing", 5),  # Should find marketing roles
            ("NonExistent", 0) # Should find no results
        ]
        
        for query, expected_min in test_cases:
            results = config.search_roles(query)
            if len(results) < expected_min:
                print(f"❌ Search for '{query}' returned {len(results)} results, expected at least {expected_min}")
                return False
            
            print(f"✅ Search for '{query}': {len(results)} results")
        
        return True
        
    except Exception as e:
        print(f"❌ Search functionality test failed: {e}")
        return False


def test_role_categories():
    """Test role categorization."""
    print("\nTesting role categorization...")
    
    try:
        config = JobRolesConfig()
        
        # Test that roles are properly categorized
        all_roles = config.get_all_roles()
        categorized_roles = set()
        
        for category in config.get_all_categories():
            categorized_roles.update(category["roles"])
        
        # Check for duplicates
        if len(categorized_roles) != len(all_roles):
            print("❌ Duplicate roles found in categories")
            return False
        
        print(f"✅ All {len(all_roles)} roles are properly categorized")
        
        # Test specific role categorization
        test_roles = [
            ("Frontend Developer", "Software & Engineering"),
            ("Data Scientist", "Data & AI"),
            ("Product Manager", "Product, Project & Program"),
            ("Human Resources (HR) Executive", "HR & People Operations"),
            ("Finance Analyst", "Finance & Legal")
        ]
        
        for role, expected_category in test_roles:
            actual_category = config.get_category_for_role(role)
            if actual_category != expected_category:
                print(f"❌ Role '{role}' categorized as '{actual_category}', expected '{expected_category}'")
                return False
        
        print("✅ Role categorization is correct")
        return True
        
    except Exception as e:
        print(f"❌ Role categorization test failed: {e}")
        return False


def test_sample_data():
    """Test sample job roles data."""
    print("\nTesting sample data...")
    
    try:
        sample_data = get_sample_job_roles()
        
        required_fields = ['categories', 'total_roles', 'total_categories']
        for field in required_fields:
            if field not in sample_data:
                print(f"❌ Missing required field in sample data: {field}")
                return False
        
        categories = sample_data['categories']
        if not categories:
            print("❌ No categories in sample data")
            return False
        
        print(f"✅ Sample data contains {len(categories)} categories")
        print(f"✅ Sample data contains {sample_data['total_roles']} total roles")
        print(f"✅ Sample data contains {sample_data['total_categories']} categories")
        
        return True
        
    except Exception as e:
        print(f"❌ Sample data test failed: {e}")
        return False


def test_json_serialization():
    """Test JSON serialization of job roles data."""
    print("\nTesting JSON serialization...")
    
    try:
        config = JobRolesConfig()
        
        # Test categories serialization
        categories = config.get_all_categories()
        json_str = json.dumps(categories)
        parsed_back = json.loads(json_str)
        
        if parsed_back != categories:
            print("❌ Categories JSON serialization failed")
            return False
        
        # Test search results serialization
        search_results = config.search_roles("Developer")
        json_str = json.dumps(search_results)
        parsed_back = json.loads(json_str)
        
        if parsed_back != search_results:
            print("❌ Search results JSON serialization failed")
            return False
        
        print("✅ JSON serialization works correctly")
        return True
        
    except Exception as e:
        print(f"❌ JSON serialization test failed: {e}")
        return False


def run_all_tests():
    """Run all tests and report results."""
    print("🧪 Running Job Roles Tests\n")
    print("=" * 50)
    
    tests = [
        test_job_roles_config,
        test_search_functionality,
        test_role_categories,
        test_sample_data,
        test_json_serialization
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
        print("🎉 All tests passed! The Job Roles system is working correctly.")
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