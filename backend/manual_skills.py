"""
Manual Skills Management Module

This module provides functionality for managing manually added skills
by users, separate from resume-extracted skills.
"""

from typing import Dict, List, Any, Optional
from skill_library import validate_skills, get_skill_category
import logging

logger = logging.getLogger(__name__)

# In-memory storage for manual skills (in production, use database)
MANUAL_SKILLS_DB: Dict[str, List[str]] = {}

def save_manual_skills(user_id: str, manual_skills: List[str]) -> Dict[str, Any]:
    """
    Save manually selected skills for a user.
    
    Args:
        user_id: Unique identifier for the user
        manual_skills: List of skills selected by the user
        
    Returns:
        Dict containing success status and saved skills
    """
    try:
        # Validate and clean skills
        validated_skills = validate_skills(manual_skills)
        
        # Store manual skills
        MANUAL_SKILLS_DB[user_id] = validated_skills
        
        logger.info(f"Saved {len(validated_skills)} manual skills for user {user_id}")
        
        return {
            'success': True,
            'message': f'Saved {len(validated_skills)} manual skills',
            'data': {
                'user_id': user_id,
                'manual_skills': validated_skills,
                'total_manual_skills': len(validated_skills)
            }
        }
        
    except Exception as e:
        logger.error(f"Error saving manual skills for user {user_id}: {str(e)}")
        return {
            'success': False,
            'message': f'Error saving manual skills: {str(e)}'
        }

def get_manual_skills(user_id: str) -> Dict[str, Any]:
    """
    Get manual skills for a user.
    
    Args:
        user_id: Unique identifier for the user
        
    Returns:
        Dict containing user's manual skills
    """
    try:
        manual_skills = MANUAL_SKILLS_DB.get(user_id, [])
        
        return {
            'success': True,
            'data': {
                'user_id': user_id,
                'manual_skills': manual_skills,
                'total_manual_skills': len(manual_skills)
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting manual skills for user {user_id}: {str(e)}")
        return {
            'success': False,
            'message': f'Error getting manual skills: {str(e)}'
        }

def get_all_manual_skills() -> Dict[str, Any]:
    """
    Get all manual skills across all users.
    
    Returns:
        Dict containing all manual skills data
    """
    try:
        return {
            'success': True,
            'data': {
                'users_count': len(MANUAL_SKILLS_DB),
                'manual_skills_db': MANUAL_SKILLS_DB.copy(),
                'total_manual_skills': sum(len(skills) for skills in MANUAL_SKILLS_DB.values())
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting all manual skills: {str(e)}")
        return {
            'success': False,
            'message': f'Error getting all manual skills: {str(e)}'
        }

def delete_manual_skills(user_id: str) -> Dict[str, Any]:
    """
    Delete manual skills for a user.
    
    Args:
        user_id: Unique identifier for the user
        
    Returns:
        Dict containing deletion status
    """
    try:
        if user_id in MANUAL_SKILLS_DB:
            deleted_skills = MANUAL_SKILLS_DB.pop(user_id)
            logger.info(f"Deleted {len(deleted_skills)} manual skills for user {user_id}")
            return {
                'success': True,
                'message': f'Deleted {len(deleted_skills)} manual skills',
                'data': {
                    'user_id': user_id,
                    'deleted_skills_count': len(deleted_skills)
                }
            }
        else:
            return {
                'success': True,
                'message': 'No manual skills found for this user',
                'data': {
                    'user_id': user_id,
                    'deleted_skills_count': 0
                }
            }
        
    except Exception as e:
        logger.error(f"Error deleting manual skills for user {user_id}: {str(e)}")
        return {
            'success': False,
            'message': f'Error deleting manual skills: {str(e)}'
        }

def merge_skills_with_manual(resume_skills: List[str], manual_skills: List[str]) -> List[str]:
    """
    Merge resume skills with manual skills, avoiding duplicates.
    
    Args:
        resume_skills: Skills extracted from resume
        manual_skills: Skills manually selected by user
        
    Returns:
        List of merged skills with no duplicates
    """
    try:
        # Convert to sets for deduplication (case-insensitive)
        resume_set = set(skill.strip().lower() for skill in resume_skills if skill.strip())
        manual_set = set(skill.strip().lower() for skill in manual_skills if skill.strip())
        
        # Union of both sets
        merged_set = resume_set.union(manual_set)
        
        # Convert back to list, preserving original case from manual skills when possible
        merged_skills = []
        seen = set()
        
        # Add manual skills first (preserving original case)
        for skill in manual_skills:
            skill_clean = skill.strip()
            if skill_clean and skill_clean.lower() not in seen:
                merged_skills.append(skill_clean)
                seen.add(skill_clean.lower())
        
        # Add resume skills that aren't already in manual skills
        for skill in resume_skills:
            skill_clean = skill.strip()
            if skill_clean and skill_clean.lower() not in seen:
                merged_skills.append(skill_clean)
                seen.add(skill_clean.lower())
        
        logger.info(f"Merged {len(resume_skills)} resume skills with {len(manual_skills)} manual skills, result: {len(merged_skills)} skills")
        
        return merged_skills
        
    except Exception as e:
        logger.error(f"Error merging skills: {str(e)}")
        # Return resume skills as fallback
        return resume_skills

def get_skill_statistics() -> Dict[str, Any]:
    """
    Get statistics about manual skills usage.
    
    Returns:
        Dict containing skill usage statistics
    """
    try:
        total_users = len(MANUAL_SKILLS_DB)
        total_manual_skills = sum(len(skills) for skills in MANUAL_SKILLS_DB.values())
        
        # Count skill occurrences
        skill_counts = {}
        for user_skills in MANUAL_SKILLS_DB.values():
            for skill in user_skills:
                skill_lower = skill.lower()
                skill_counts[skill_lower] = skill_counts.get(skill_lower, 0) + 1
        
        # Get most popular skills
        most_popular = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        return {
            'success': True,
            'data': {
                'total_users_with_manual_skills': total_users,
                'total_manual_skills': total_manual_skills,
                'average_skills_per_user': total_users > 0 and total_manual_skills / total_users or 0,
                'most_popular_skills': most_popular,
                'skill_categories_distribution': get_skill_categories_distribution()
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting skill statistics: {str(e)}")
        return {
            'success': False,
            'message': f'Error getting skill statistics: {str(e)}'
        }

def get_skill_categories_distribution() -> Dict[str, int]:
    """
    Get distribution of manual skills across categories.
    
    Returns:
        Dict mapping category names to skill counts
    """
    try:
        category_counts = {}
        
        for user_skills in MANUAL_SKILLS_DB.values():
            for skill in user_skills:
                category = get_skill_category(skill)
                category_counts[category] = category_counts.get(category, 0) + 1
        
        return category_counts
        
    except Exception as e:
        logger.error(f"Error getting skill categories distribution: {str(e)}")
        return {}

def clear_all_manual_skills() -> Dict[str, Any]:
    """
    Clear all manual skills data (for testing/admin purposes).
    
    Returns:
        Dict containing operation status
    """
    try:
        total_users = len(MANUAL_SKILLS_DB)
        total_skills = sum(len(skills) for skills in MANUAL_SKILLS_DB.values())
        
        MANUAL_SKILLS_DB.clear()
        
        logger.info(f"Cleared all manual skills data: {total_users} users, {total_skills} skills")
        
        return {
            'success': True,
            'message': f'Cleared all manual skills data: {total_users} users, {total_skills} skills'
        }
        
    except Exception as e:
        logger.error(f"Error clearing manual skills: {str(e)}")
        return {
            'success': False,
            'message': f'Error clearing manual skills: {str(e)}'
        }

# Example usage and testing
if __name__ == "__main__":
    # Test manual skills functionality
    print("Testing Manual Skills Module...")
    
    # Test saving skills
    result = save_manual_skills("user1", ["Python", "JavaScript", "React"])
    print(f"Save result: {result}")
    
    # Test getting skills
    result = get_manual_skills("user1")
    print(f"Get result: {result}")
    
    # Test merging skills
    resume_skills = ["Python", "Django", "SQL"]
    manual_skills = ["React", "JavaScript", "Python"]  # Python is duplicate
    merged = merge_skills_with_manual(resume_skills, manual_skills)
    print(f"Merged skills: {merged}")
    
    # Test statistics
    stats = get_skill_statistics()
    print(f"Statistics: {stats}")