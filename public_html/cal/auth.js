// Authentication functionality for Color Calendar
// Uses the appwriteBackend instance from backend.js

// Authentication functions
async function loginUser(email, password) {
    const result = await window.appwriteBackend.login(email, password);
    if (result.success) {
        window.currentUser = result.user;
    }
    return result;
}

async function signupUser(email, password) {
    const result = await window.appwriteBackend.signup(email, password);
    if (result.success) {
        window.currentUser = result.user;
    }
    return result;
}

async function logoutUser() {
    const result = await window.appwriteBackend.logout();
    if (result.success) {
        window.currentUser = null;
    }
    return result;
}

async function checkSession() {
    const result = await window.appwriteBackend.checkSession();
    if (result.success) {
        window.currentUser = result.user;
    }
    return result;
}

// UI functions
function showLoginForm() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function showSignupForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

function updateUIForLoggedInUser() {
    document.getElementById('auth-forms').classList.remove('active');
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-info').style.display = 'flex';
    document.getElementById('user-email').textContent = window.currentUser.email;
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
        // Initialize Appwrite backend
        window.appwriteBackend.initialize('https://fra.cloud.appwrite.io/v1', '68230f820010c85a6246');

        // For backward compatibility
        window.appwriteClient = window.appwriteBackend.client;
        window.databases = window.appwriteBackend.databases;
        window.query = window.appwriteBackend.query;
        window.account = window.appwriteBackend.account;

        // Set up event listeners for auth forms
        document.getElementById('login-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const result = await loginUser(email, password);
            if (result.success) {
                updateUIForLoggedInUser();
                // Load colors after login
                await window.loadColorsFromAppwrite();
                window.createColorLegend(); // Create color legend
                window.createCalendars(); // Create calendars after colors are loaded
            } else {
                document.getElementById('login-error').textContent = result.error || 'Login failed';
            }
        });

        document.getElementById('signup-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            const result = await signupUser(email, password);
            if (result.success) {
                updateUIForLoggedInUser();
                // Load colors after signup
                try {
                    await window.loadColorsFromAppwrite();
                    window.createColorLegend(); // Create color legend
                    window.createCalendars(); // Create calendars after colors are loaded
                } catch (error) {
                    console.warn('Could not load colors from Appwrite', error);
                    // Do not create calendars if colors couldn't be loaded
                }
            } else {
                document.getElementById('signup-error').textContent = result.error || 'Signup failed';
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
        });

        document.getElementById('nav-signup-btn').addEventListener('click', function() {
            showSignupForm();
            document.getElementById('auth-forms').classList.add('active');
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
        console.error('Error initializing Appwrite:', error);
    }
}

// Check if user is already logged in
async function checkAndSetupSession() {
    const sessionResult = await checkSession();
    if (sessionResult.success) {
        updateUIForLoggedInUser();

        // Try to load colors from Appwrite
        try {
            await window.loadColorsFromAppwrite();
            window.createColorLegend(); // Create color legend
            window.createCalendars(); // Create calendars after colors are loaded
        } catch (error) {
            console.warn('Could not load colors from Appwrite', error);
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
