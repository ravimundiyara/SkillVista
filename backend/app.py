"""
SkillVista Backend (Flask)

This service handles:
- Resume upload (local file storage)
- Resume text extraction (PDF/DOCX/DOC)
- NLP-based structured data extraction
- Skill analysis and categorization

Features:
- /analyze-resume endpoint for comprehensive resume analysis
- Support for PDF, DOC, and DOCX formats
- Extracts name, email, phone, education, skills, experience, projects, certifications
- Returns structured JSON with metadata about the analysis process
"""

from __future__ import annotations

import os
import logging
from pathlib import Path

from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename

# Import the resume analyzer, skill gap analysis, and job roles
from resume_analyzer import create_analyze_resume_endpoint, get_sample_resume_data
from skill_gap_analysis import create_skill_gap_analysis_endpoint, get_sample_skill_gap_analysis
from job_roles import create_job_roles_endpoint, get_sample_job_roles
from skill_library import get_skill_library, search_skills, validate_skills, get_all_skills
from create_manual_skills_endpoint import create_manual_skills_endpoint


def create_app() -> Flask:
    """
    Application factory.

    Using a factory makes it easier to scale later (testing, config per env, etc.).
    """
    app = Flask(__name__)

    # --- Upload folder configuration ---
    # Store uploads locally in backend/uploads/ (no database yet).
    base_dir = Path(__file__).resolve().parent
    upload_dir = base_dir / "uploads"

    # Ensure the uploads directory exists.
    upload_dir.mkdir(parents=True, exist_ok=True)

    # Flask config values (available via app.config["UPLOAD_FOLDER"])
    app.config["UPLOAD_FOLDER"] = str(upload_dir)

    # Allowed resume file extensions
    app.config["ALLOWED_RESUME_EXTENSIONS"] = {"pdf", "doc", "docx"}

    # Optional hard limits (adjust later as needed)
    # app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # 10 MB

    # --- Basic routes ---
    @app.get("/")
    def home():
        """
        Basic health/test route.
        """
        return jsonify(
            status="ok",
            service="skillvista-resume-analyzer",
            version="1.0.0",
            endpoints={
                "analyze_resume": "/analyze-resume (POST)",
                "sample_data": "/sample-data (GET)"
            },
            supported_formats=["PDF (.pdf)", "Word (.doc, .docx)"],
            extracted_fields=[
                "name", "email", "phone", "education", "skills", 
                "experience", "projects", "certifications"
            ]
        )

    @app.get("/sample-data")
    def sample_data():
        """
        Return sample resume data structure for testing and documentation.
        """
        return jsonify(get_sample_resume_data())

    def _is_allowed_resume_filename(filename: str) -> bool:
        """
        Validate the resume filename by extension only.
        (Content inspection / virus scanning can be added later.)
        """
        if "." not in filename:
            return False
        ext = filename.rsplit(".", 1)[-1].lower()
        return ext in app.config["ALLOWED_RESUME_EXTENSIONS"]

    @app.post("/upload-resume")
    def upload_resume():
        """
        Accept a resume file upload and save to the local uploads folder.

        This endpoint is kept for backward compatibility and testing.
        For analysis, use /analyze-resume instead.
        """
        # Expect multipart/form-data with a file field named "resume"
        if "resume" not in request.files:
            return (
                jsonify(
                    success=False,
                    error="missing_file",
                    message='No file part found. Use form field name "resume".',
                ),
                400,
            )

        file = request.files["resume"]

        # Browser may submit an empty file without a filename.
        if not file or not file.filename:
            return (
                jsonify(
                    success=False,
                    error="empty_filename",
                    message="No file selected.",
                ),
                400,
            )

        original_filename = file.filename

        if not _is_allowed_resume_filename(original_filename):
            allowed = sorted(app.config["ALLOWED_RESUME_EXTENSIONS"])
            return (
                jsonify(
                    success=False,
                    error="invalid_file_type",
                    message=f"Invalid file type. Allowed: {', '.join(allowed)}.",
                ),
                400,
            )

        safe_filename = secure_filename(original_filename)
        save_path = Path(app.config["UPLOAD_FOLDER"]) / safe_filename

        # TODO: In the future, store per-user files (e.g., user_id subfolders)
        # and avoid overwriting by using unique IDs or timestamps.
        file.save(str(save_path))

        return jsonify(
            success=True,
            message="Resume uploaded successfully.",
            filename=safe_filename,
            upload_path=str(save_path),
        )

    # --- Resume Analysis Endpoint ---
    # This is the main endpoint for resume analysis
    create_analyze_resume_endpoint(app)
    
    # --- Skill Gap Analysis Endpoints ---
    # These endpoints provide skill gap analysis functionality
    create_skill_gap_analysis_endpoint(app)
    
    # --- Job Roles Endpoints ---
    # These endpoints provide job roles configuration and search functionality
    create_job_roles_endpoint(app)

    # --- Manual Skills Endpoints ---
    # These endpoints provide manual skill management functionality
    from create_manual_skills_endpoint import create_manual_skills_endpoint
    create_manual_skills_endpoint(app)

    return app


app = create_app()


if __name__ == "__main__":
    # Development entry point.
    # TIP: For production, use a WSGI server like gunicorn/waitress instead.
    host = os.getenv("FLASK_HOST", "127.0.0.1")
    port = int(os.getenv("FLASK_PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "1") == "1"

    app.run(host=host, port=port, debug=debug)

