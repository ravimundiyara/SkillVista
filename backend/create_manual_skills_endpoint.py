"""
Manual Skills API Endpoints

This module creates Flask endpoints for manual skills management.
"""

from flask import Flask, request, jsonify
from manual_skills import (
    save_manual_skills, get_manual_skills, get_all_manual_skills,
    delete_manual_skills, merge_skills_with_manual, get_skill_statistics,
    clear_all_manual_skills
)
from skill_library import get_skill_library, search_skills, get_all_skills
import logging

logger = logging.getLogger(__name__)

def create_manual_skills_endpoint(app: Flask):
    """
    Create manual skills management endpoints.
    
    Args:
        app: Flask application instance
    """
    
    @app.route('/manual-skills', methods=['POST'])
    def save_manual_skills_endpoint():
        """Save manually selected skills for a user."""
        try:
            data = request.get_json()
            
            user_id = data.get('user_id', 'default_user')
            manual_skills = data.get('manual_skills', [])
            
            if not isinstance(manual_skills, list):
                return jsonify({
                    'success': False,
                    'message': 'manual_skills must be a list'
                }), 400
            
            if len(manual_skills) > 100:  # Reasonable limit
                return jsonify({
                    'success': False,
                    'message': 'Too many skills. Maximum 100 skills allowed.'
                }), 400
            
            result = save_manual_skills(user_id, manual_skills)
            
            if result['success']:
                return jsonify(result), 200
            else:
                return jsonify(result), 500
                
        except Exception as e:
            logger.error(f"Error in save_manual_skills_endpoint: {str(e)}")
            return jsonify({
                'success': False,
                'message': f'Error saving manual skills: {str(e)}'
            }), 500

    @app.route('/manual-skills', methods=['GET'])
    def get_manual_skills_endpoint():
        """Get manual skills for a user."""
        try:
            user_id = request.args.get('user_id', 'default_user')
            
            result = get_manual_skills(user_id)
            
            if result['success']:
                return jsonify(result), 200
            else:
                return jsonify(result), 500
                
        except Exception as e:
            logger.error(f"Error in get_manual_skills_endpoint: {str(e)}")
            return jsonify({
                'success': False,
                'message': f'Error getting manual skills: {str(e)}'
            }), 500

    @app.route('/manual-skills/all', methods=['GET'])
    def get_all_manual_skills_endpoint():
        """Get all manual skills across all users."""
        try:
            result = get_all_manual_skills()
            
            if result['success']:
                return jsonify(result), 200
            else:
                return jsonify(result), 500
                
        except Exception as e:
            logger.error(f"Error in get_all_manual_skills_endpoint: {str(e)}")
            return jsonify({
                'success': False,
                'message': f'Error getting all manual skills: {str(e)}'
            }), 500

    @app.route('/manual-skills', methods=['DELETE'])
    def delete_manual_skills_endpoint():
        """Delete manual skills for a user."""
        try:
            user_id = request.args.get('user_id')
            
            if not user_id:
                return jsonify({
                    'success': False,
                    'message': 'user_id parameter is required'
                }), 400
            
            result = delete_manual_skills(user_id)
            
            if result['success']:
                return jsonify(result), 200
            else:
                return jsonify(result), 500
                
        except Exception as e:
            logger.error(f"Error in delete_manual_skills_endpoint: {str(e)}")
            return jsonify({
                'success': False,
                'message': f'Error deleting manual skills: {str(e)}'
            }), 500

    @app.route('/manual-skills/merge', methods=['POST'])
    def merge_skills_endpoint():
        """Merge resume skills with manual skills."""
        try:
            data = request.get_json()
            
            resume_skills = data.get('resume_skills', [])
            manual_skills = data.get('manual_skills', [])
            
            if not isinstance(resume_skills, list):
                return jsonify({
                    'success': False,
                    'message': 'resume_skills must be a list'
                }), 400
            
            if not isinstance(manual_skills, list):
                return jsonify({
                    'success': False,
                    'message': 'manual_skills must be a list'
                }), 400
            
            merged_skills = merge_skills_with_manual(resume_skills, manual_skills)
            
            return jsonify({
                'success': True,
                'data': {
                    'resume_skills_count': len(resume_skills),
                    'manual_skills_count': len(manual_skills),
                    'merged_skills_count': len(merged_skills),
                    'merged_skills': merged_skills
                }
            }), 200
                
        except Exception as e:
            logger.error(f"Error in merge_skills_endpoint: {str(e)}")
            return jsonify({
                'success': False,
                'message': f'Error merging skills: {str(e)}'
            }), 500

    @app.route('/manual-skills/statistics', methods=['GET'])
    def get_skill_statistics_endpoint():
        """Get statistics about manual skills usage."""
        try:
            result = get_skill_statistics()
            
            if result['success']:
                return jsonify(result), 200
            else:
                return jsonify(result), 500
                
        except Exception as e:
            logger.error(f"Error in get_skill_statistics_endpoint: {str(e)}")
            return jsonify({
                'success': False,
                'message': f'Error getting skill statistics: {str(e)}'
            }), 500

    @app.route('/manual-skills/clear', methods=['POST'])
    def clear_all_manual_skills_endpoint():
        """Clear all manual skills data (admin/testing endpoint)."""
        try:
            # In production, add authentication/authorization here
            result = clear_all_manual_skills()
            
            if result['success']:
                return jsonify(result), 200
            else:
                return jsonify(result), 500
                
        except Exception as e:
            logger.error(f"Error in clear_all_manual_skills_endpoint: {str(e)}")
            return jsonify({
                'success': False,
                'message': f'Error clearing manual skills: {str(e)}'
            }), 500

    # Skill Library Endpoints
    
    @app.route('/skill-library', methods=['GET'])
    def get_skill_library_endpoint():
        """Get the complete skill library."""
        try:
            skill_library = get_skill_library()
            
            return jsonify({
                'success': True,
                'data': skill_library,
                'total_categories': len(skill_library),
                'total_skills': len(get_all_skills())
            }), 200
            
        except Exception as e:
            logger.error(f"Error getting skill library: {str(e)}")
            return jsonify({
                'success': False,
                'message': f'Error getting skill library: {str(e)}'
            }), 500

    @app.route('/skill-library/search', methods=['GET'])
    def search_skills_endpoint():
        """Search skills in the library."""
        try:
            query = request.args.get('q', '').strip()
            
            if not query:
                return jsonify({
                    'success': False,
                    'message': 'Search query is required'
                }), 400
            
            results = search_skills(query)
            
            return jsonify({
                'success': True,
                'data': results,
                'query': query,
                'total_results': len(results)
            }), 200
            
        except Exception as e:
            logger.error(f"Error searching skills: {str(e)}")
            return jsonify({
                'success': False,
                'message': f'Error searching skills: {str(e)}'
            }), 500

    @app.route('/skill-library/categories', methods=['GET'])
    def get_skill_categories_endpoint():
        """Get all skill categories."""
        try:
            from skill_library import get_skill_categories
            categories = get_skill_categories()
            
            return jsonify({
                'success': True,
                'data': categories,
                'total_categories': len(categories)
            }), 200
            
        except Exception as e:
            logger.error(f"Error getting skill categories: {str(e)}")
            return jsonify({
                'success': False,
                'message': f'Error getting skill categories: {str(e)}'
            }), 500

    @app.route('/skill-library/skills', methods=['GET'])
    def get_all_skills_endpoint():
        """Get all skills from the library."""
        try:
            all_skills = get_all_skills()
            
            return jsonify({
                'success': True,
                'data': all_skills,
                'total_skills': len(all_skills)
            }), 200
            
        except Exception as e:
            logger.error(f"Error getting all skills: {str(e)}")
            return jsonify({
                'success': False,
                'message': f'Error getting all skills: {str(e)}'
            }), 500

    # Enhanced Skill Gap Analysis with Manual Skills
    
    @app.route('/skill-gap-analysis-with-manual', methods=['POST'])
    def skill_gap_analysis_with_manual_endpoint():
        """Perform skill gap analysis with manual skills integration."""
        try:
            data = request.get_json()
            
            target_role = data.get('target_role')
            extracted_resume_data = data.get('extracted_resume_data', {})
            user_id = data.get('user_id', 'default_user')
            
            if not target_role:
                return jsonify({
                    'success': False,
                    'message': 'Target role is required'
                }), 400
            
            # Get manual skills for user
            manual_skills_result = get_manual_skills(user_id)
            if not manual_skills_result['success']:
                return jsonify(manual_skills_result), 500
            
            manual_skills = manual_skills_result['data']['manual_skills']
            
            # Merge resume skills with manual skills
            resume_skills = extracted_resume_data.get('skills', [])
            final_skills = merge_skills_with_manual(resume_skills, manual_skills)
            
            # Update extracted data with merged skills
            extracted_resume_data['skills'] = final_skills
            
            # Perform skill gap analysis
            from skill_gap_analysis import analyze_skill_gaps
            analysis_result = analyze_skill_gaps(target_role, extracted_resume_data)
            
            # Add manual skills info to result
            analysis_result['manual_skills'] = manual_skills
            analysis_result['total_skills_used'] = len(final_skills)
            analysis_result['skills_source_breakdown'] = {
                'resume_skills_count': len(resume_skills),
                'manual_skills_count': len(manual_skills),
                'merged_skills_count': len(final_skills)
            }
            
            return jsonify({
                'success': True,
                'data': analysis_result
            }), 200
            
        except Exception as e:
            logger.error(f"Error in skill gap analysis with manual skills: {str(e)}")
            return jsonify({
                'success': False,
                'message': f'Error performing skill gap analysis: {str(e)}'
            }), 500

    logger.info("Manual skills endpoints registered successfully")

# Example usage
if __name__ == "__main__":
    # Test the endpoints
    from flask import Flask
    
    app = Flask(__name__)
    create_manual_skills_endpoint(app)
    
    # Run a test server
    app.run(debug=True)