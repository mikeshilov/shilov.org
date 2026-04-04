// Authentication functionality for Color Calendar
// Uses the shilovBackend instance from backend.js

// Authentication functions
async function loginUser(email, otp) {
    const result = await window.shilovBackend.login(email, otp);
    if (result.success) {
        window.currentUser = result.user;
    }
    return result;
}

async function signupUser(email) {
    return window.shilovBackend.signup(email);
}

async function logoutUser() {
    const result = await window.shilovBackend.logout();
    if (result.success) {
        window.currentUser = null;
    }
    return result;
}

async function checkSession() {
    const result = await window.shilovBackend.checkSession();
    if (result.success) {
        window.currentUser = result.user;
    }
    return result;
}

// UI functions
function syncEmailFields(sourceId, targetId) {
    const source = document.getElementById(sourceId);
    const target = document.getElementById(targetId);
    const value = source.value.trim();
    if (value) {
        target.value = value;
    }
}

function showLoginForm() {
    syncEmailFields('signup-email', 'login-email');
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-error').textContent = '';
}

function showSignupForm() {
    syncEmailFields('login-email', 'signup-email');
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-error').textContent = '';
}

function updateUIForLoggedInUser() {
    document.getElementById('auth-forms').classList.remove('active');
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-info').style.display = 'flex';
    document.getElementById('user-email').textContent =
        window.currentUser?.email || window.currentUser?.user_email || window.currentUser?.name || 'Logged in';
    // Note: createCalendars() will be called after colors are loaded
}

function updateUIForLoggedOutUser() {
    document.getElementById('auth-buttons').style.display = 'flex';
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('calendars').innerHTML = ''; // Clear calendars
}

// Function to download color data as JSON
function downloadColorData() {
    try {
        // Add metadata to the export
        const exportData = {
            metadata: {
                exportDate: new Date().toISOString(),
                colorMeanings: window.colorMeanings,
                colors: window.colors
            },
            colorData: {}
        };

        // Add the actual color data
        for (const dateStr in window.colorData) {
            exportData.colorData[dateStr] = window.colorData[dateStr];
        }

        // Convert to JSON string
        const jsonString = JSON.stringify(exportData, null, 2);

        // Create a blob with the JSON data
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Create a URL for the blob
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = `color-data-${new Date().toISOString().split('T')[0]}.json`;

        // Append the anchor to the body, click it, and remove it
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Release the URL object
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading color data:', error);
        alert('Failed to download color data. Please try again.');
    }
}

// Initialize authentication
function initializeAuth() {
    try {
        // Initialize Shilov backend
        window.shilovBackend.initialize();

        // Set up event listeners for auth forms
        document.getElementById('login-email').addEventListener('input', function(e) {
            document.getElementById('signup-email').value = e.target.value;
        });
        document.getElementById('signup-email').addEventListener('input', function(e) {
            document.getElementById('login-email').value = e.target.value;
        });

        document.getElementById('login-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const otp = document.getElementById('login-otp').value.trim();
            document.getElementById('login-error').textContent = '';

            const result = await loginUser(email, otp);
            if (result.success) {
                updateUIForLoggedInUser();
                // Load colors after login
                await window.loadColorsFromBackend();
                window.createColorLegend(); // Create color legend
                window.createCalendars(); // Create calendars after colors are loaded
            } else {
                document.getElementById('login-error').textContent = result.error || 'Login failed';
            }
        });

        document.getElementById('signup-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            document.getElementById('signup-error').textContent = '';

            const result = await signupUser(email);
            if (result.success && result.otpSent) {
                showLoginForm();
                document.getElementById('auth-forms').classList.add('active');
                document.getElementById('login-email').value = email;
                document.getElementById('login-error').textContent = 'OTP sent to your email. Enter it below to sign in.';
            } else {
                document.getElementById('signup-error').textContent = result.error || 'Could not send OTP';
            }
        });

        document.getElementById('logout-btn').addEventListener('click', async function() {
            const result = await logoutUser();
            if (result.success) {
                updateUIForLoggedOutUser();
            }
        });

        // Form toggle links
        document.getElementById('show-signup').addEventListener('click', showSignupForm);
        document.getElementById('show-login').addEventListener('click', showLoginForm);

        // Navbar button event listeners
        document.getElementById('nav-login-btn').addEventListener('click', function() {
            showLoginForm();
            document.getElementById('auth-forms').classList.add('active');
            document.getElementById('login-email').focus();
        });

        document.getElementById('nav-signup-btn').addEventListener('click', function() {
            showSignupForm();
            document.getElementById('auth-forms').classList.add('active');
            document.getElementById('signup-email').focus();
        });

        // Download button event listener
        document.getElementById('download-btn').addEventListener('click', function() {
            downloadColorData();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const authForms = document.getElementById('auth-forms');
            const navButtons = document.getElementById('auth-buttons');

            if (!authForms.contains(event.target) && !navButtons.contains(event.target)) {
                authForms.classList.remove('active');
            }
        });

    } catch (error) {
        console.error('Error initializing backend:', error);
    }
}

// Check if user is already logged in
async function checkAndSetupSession() {
    const sessionResult = await checkSession();
    if (sessionResult.success) {
        updateUIForLoggedInUser();

        // Try to load colors from backend
        try {
            await window.loadColorsFromBackend();
            window.createColorLegend(); // Create color legend
            window.createCalendars(); // Create calendars after colors are loaded
        } catch (error) {
            console.warn('Could not load colors from backend', error);
            // Do not create calendars if colors couldn't be loaded
        }
    } else {
        updateUIForLoggedOutUser();
    }
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    checkAndSetupSession();
});
