"""
SkillVista Backend (Flask)

This service will later handle:
- Resume upload (local file storage for now)
- Resume text extraction (PDF/DOCX)
- Skill extraction / analysis workflow

For now, it only includes:
- Flask app initialization
- Upload folder configuration
- A basic home route for testing
"""

from __future__ import annotations

import os
import logging
from pathlib import Path

from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename


def extract_text_from_pdf(pdf_path: str | Path) -> str:
    """
    Extract text from a multi-page PDF file.

    Uses `pdfplumber` (built on pdfminer.six) which is a commonly used,
    reliable choice for resume-style PDFs.

    Args:
        pdf_path: Path to a PDF file on disk.

    Returns:
        Extracted text as a single string (pages separated by blank lines).

    Raises:
        FileNotFoundError: If the file does not exist.
        ValueError: If the file is not a PDF by extension.
        RuntimeError: If the PDF cannot be opened/parsed.
    """
    path = Path(pdf_path)

    if not path.exists():
        raise FileNotFoundError(f"PDF file not found: {path}")

    if path.suffix.lower() != ".pdf":
        raise ValueError("Invalid file type: expected a .pdf file")

    try:
        import pdfplumber  # local import keeps startup lightweight if unused
    except Exception as exc:  # pragma: no cover
        raise RuntimeError(
            "Missing dependency: pdfplumber is required for PDF extraction"
        ) from exc

    try:
        pages_text: list[str] = []
        with pdfplumber.open(str(path)) as pdf:
            for page_index, page in enumerate(pdf.pages, start=1):
                # page.extract_text() may return None for scanned/image-only pages.
                text = page.extract_text() or ""
                text = text.strip()
                if text:
                    pages_text.append(text)
                else:
                    logging.getLogger(__name__).warning(
                        "No extractable text on page %s of %s", page_index, path.name
                    )

        return "\n\n".join(pages_text).strip()
    except Exception as exc:
        raise RuntimeError(f"Failed to extract text from PDF: {path.name}") from exc


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

    # Allowed resume file extensions (text extraction will be added later)
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
            service="skillvista-backend",
            upload_folder=app.config["UPLOAD_FOLDER"],
            note="Resume upload/extraction endpoints will be added later.",
        )

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

        Frontend will connect later.
        """
        # Expect multipart/form-data with a file field named "resume"
        if "resume" not in request.files:
            return (
                jsonify(
                    ok=False,
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
                    ok=False,
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
                    ok=False,
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
            ok=True,
            message="Resume uploaded successfully.",
            filename=safe_filename,
            upload_path=str(save_path),
        )

    # TODO: Add extraction endpoints / background analysis later.

    return app


app = create_app()


if __name__ == "__main__":
    # Development entry point.
    # TIP: For production, use a WSGI server like gunicorn/waitress instead.
    host = os.getenv("FLASK_HOST", "127.0.0.1")
    port = int(os.getenv("FLASK_PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "1") == "1"

    app.run(host=host, port=port, debug=debug)

