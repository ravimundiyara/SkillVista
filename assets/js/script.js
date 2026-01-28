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

    // ===== First-time User Resume Upload (dashboard.html) =====
    const resumeSection = document.getElementById('resume-upload-section');
    const resumeForm = document.getElementById('resume-upload-form');
    const resumeFileInput = document.getElementById('resume-file');
    const resumeSkipBtn = document.getElementById('resume-skip-btn');

    if (resumeSection && resumeForm && resumeFileInput && resumeSkipBtn) {
        // TODO: Replace this with real first-time user flag from backend/session.
        const isFirstTimeUser = true; // Placeholder for backend-provided value

        if (!isFirstTimeUser) {
            resumeSection.classList.add('is-hidden');
        }

        resumeForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const file = resumeFileInput.files[0];
            if (!file) {
                alert('Please select a resume file before uploading.');
                return;
            }

            // Front-end validation only: ensure allowed types
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];

            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a PDF, DOC, or DOCX file.');
                return;
            }

            // TODO: Connect to backend API to upload the file.
            // Example:
            // const formData = new FormData();
            // formData.append('resume', file);
            // fetch('/api/upload-resume', {
            //   method: 'POST',
            //   body: formData,
            //   credentials: 'include',
            // })
            //   .then(/* handle response, update UI, mark user as not first-time */)
            //   .catch(/* show error to user */);

            alert('This is a demo: resume upload will be wired to the backend later.');
        });

        resumeSkipBtn.addEventListener('click', () => {
            // TODO: Persist "skipped" state in backend or local storage.
            resumeSection.classList.add('is-hidden');
        });
    }
});