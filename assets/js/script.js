// Minimal JavaScript for Skill Gap Analyzer & Integrated Learning Platform

document.addEventListener('DOMContentLoaded', () => {
    console.log('Skill Gap Analyzer is ready!');

    // ===== Login / Register Toggle (login.html) =====
    const loginToggle = document.getElementById('login-toggle');
    const registerToggle = document.getElementById('register-toggle');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginToggle && registerToggle && loginForm && registerForm) {
        const setFormActive = (activeForm, inactiveForm, activeToggle, inactiveToggle) => {
            // Toggle form visibility via .active class (matches your CSS)
            activeForm.classList.add('active');
            inactiveForm.classList.remove('active');

            // Toggle tab button style
            activeToggle.classList.add('active');
            inactiveToggle.classList.remove('active');
        };

        loginToggle.addEventListener('click', (e) => {
            e.preventDefault();
            setFormActive(loginForm, registerForm, loginToggle, registerToggle);
        });

        registerToggle.addEventListener('click', (e) => {
            e.preventDefault();
            setFormActive(registerForm, loginForm, registerToggle, loginToggle);
        });
    }

    // ===== Sidebar Active Highlight (dashboard.html) =====
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

    if (sidebarLinks.length) {
        sidebarLinks.forEach((link) => {
            link.addEventListener('click', () => {
                // Remove existing active state
                sidebarLinks.forEach((l) => l.classList.remove('active'));
                // Highlight clicked link
                link.classList.add('active');
                // No backend / routing logic here – just UI state
            });
        });
    }

    // ===== First-time User Resume Upload Modal (dashboard.html) =====
    const resumeModal = document.getElementById('resume-modal');
    const resumeModalClose = document.getElementById('resume-modal-close');
    const resumeModalSkip = document.getElementById('resume-modal-skip');
    const resumeModalForm = document.getElementById('resume-modal-form');
    const resumeManagerLink = document.getElementById('resume-manager-link');

    // Modal open/close functions (accessible for sidebar link)
    const openResumeModal = () => {
        if (resumeModal) {
            resumeModal.classList.remove('is-hidden');
            resumeModal.setAttribute('aria-hidden', 'false');
        }
    };

    const closeResumeModal = () => {
        if (resumeModal) {
            resumeModal.classList.add('is-hidden');
            resumeModal.setAttribute('aria-hidden', 'true');
        }
    };

    if (resumeModal && resumeModalClose && resumeModalSkip && resumeModalForm) {
        // Check if user has already uploaded or skipped (frontend check via localStorage)
        // TODO: Replace with real first-time user flag from backend/session.
        const savedStatus = localStorage.getItem('skillvista_resume_status');
        const isFirstTimeUser = !savedStatus || savedStatus === 'not-uploaded';

        if (isFirstTimeUser) {
            openResumeModal();
        }

        // Close on "X"
        resumeModalClose.addEventListener('click', () => {
            closeResumeModal();
        });

        // Skip button handler is moved below after status management setup

        // Close when clicking outside the dialog (backdrop)
        resumeModal.addEventListener('click', (event) => {
            if (event.target === resumeModal) {
                closeResumeModal();
            }
        });

        // Optional: close with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeResumeModal();
            }
        });
    }

    // Sidebar "Resume Manager" link opens the modal
    if (resumeManagerLink) {
        resumeManagerLink.addEventListener('click', (event) => {
            event.preventDefault();
            openResumeModal();
        });
    }

    // ===== Resume Status Management (dashboard.html) =====
    const resumeStatusBadge = document.getElementById('resume-status-badge');
    const resumeStatusContent = document.getElementById('resume-status-content');
    const resumeFileInput = document.getElementById('resume-modal-file');

    // Resume status state management (frontend only, using localStorage)
    const RESUME_STORAGE_KEY = 'skillvista_resume_status';
    const RESUME_FILE_KEY = 'skillvista_resume_filename';

    const getResumeStatus = () => {
        return localStorage.getItem(RESUME_STORAGE_KEY) || 'not-uploaded';
    };

    const setResumeStatus = (status, filename = null) => {
        localStorage.setItem(RESUME_STORAGE_KEY, status);
        if (filename) {
            localStorage.setItem(RESUME_FILE_KEY, filename);
        }
        updateResumeStatusDisplay();
    };

    const getResumeFilename = () => {
        return localStorage.getItem(RESUME_FILE_KEY) || null;
    };

    const updateResumeStatusDisplay = () => {
        if (!resumeStatusBadge || !resumeStatusContent) return;

        const status = getResumeStatus();
        const filename = getResumeFilename();

        // Update badge
        resumeStatusBadge.className = 'resume-status-badge';
        resumeStatusBadge.textContent = status === 'uploaded' ? 'Uploaded' : 
                                         status === 'skipped' ? 'Skipped' : 'Not uploaded';
        resumeStatusBadge.classList.add(status === 'uploaded' ? 'uploaded' : 
                                         status === 'skipped' ? 'skipped' : 'not-uploaded');

        // Update content based on status
        if (status === 'uploaded' && filename) {
            resumeStatusContent.innerHTML = `
                <p class="resume-status-message">Your resume is on file.</p>
                <p class="resume-status-filename">File: ${filename}</p>
                <div class="resume-status-actions">
                    <button type="button" class="btn btn-primary" id="replace-resume-btn">Replace Resume</button>
                </div>
            `;
        } else if (status === 'skipped') {
            resumeStatusContent.innerHTML = `
                <p class="resume-status-message">You can upload your resume later from Resume Manager or Profile Settings.</p>
            `;
        } else {
            resumeStatusContent.innerHTML = `
                <p class="resume-status-message">No resume uploaded yet.</p>
            `;
        }
    };

    // Update status display on page load
    updateResumeStatusDisplay();

    // Event delegation for dynamically created "Replace Resume" button
    if (resumeStatusContent) {
        resumeStatusContent.addEventListener('click', (event) => {
            if (event.target && event.target.id === 'replace-resume-btn') {
                event.preventDefault();
                openResumeModal();
            }
        });
    }

    // Handle resume form submission
    if (resumeModalForm && resumeFileInput) {
        resumeModalForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const file = resumeFileInput.files[0];
            if (!file) {
                alert('Please select a resume file before uploading.');
                return;
            }

            // Front-end validation: ensure allowed types
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];

            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a PDF, DOC, or DOCX file.');
                return;
            }

            // Save status and filename (frontend only - no backend API yet)
            setResumeStatus('uploaded', file.name);
            
            // TODO: Connect to backend API to upload the file.
            // Example:
            // const formData = new FormData();
            // formData.append('resume', file);
            // fetch('/api/upload-resume', {
            //   method: 'POST',
            //   body: formData,
            //   credentials: 'include',
            // })
            //   .then(response => response.json())
            //   .then(data => {
            //     setResumeStatus('uploaded', file.name);
            //     closeResumeModal();
            //   })
            //   .catch(error => {
            //     alert('Upload failed. Please try again.');
            //   });

            closeResumeModal();
        });
    }

    // Handle skip button
    if (resumeModalSkip) {
        resumeModalSkip.addEventListener('click', () => {
            setResumeStatus('skipped');
            // TODO: Persist "skipped" state in backend or local storage.
            closeResumeModal();
        });
    }
});