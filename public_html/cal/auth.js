// Authentication functionality for Color Calendar
// Uses global variables from index.html: appwriteClient, account, currentUser, databases, colorData

// Authentication functions
async function loginUser(email, password) {
    try {
        const session = await window.account.createEmailPasswordSession(email, password);
        window.currentUser = await window.account.get();
        return { success: true, user: window.currentUser };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

async function signupUser(email, password) {
    try {
        const user = await window.account.create('unique()', email, password);
        // Automatically log in after successful signup
        await loginUser(email, password);
        return { success: true, user };
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, error: error.message };
    }
}

async function logoutUser() {
    try {
        await window.account.deleteSession('current');
        window.currentUser = null;
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
}

async function checkSession() {
    try {
        window.currentUser = await window.account.get();
        return { success: true, user: window.currentUser };
    } catch (error) {
        console.log('No active session');
        return { success: false };
    }
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
    document.getElementById('auth-forms').style.display = 'none';
    document.getElementById('user-info').style.display = 'flex';
    document.getElementById('user-email').textContent = window.currentUser.email;
    // Note: createCalendars() will be called after colors are loaded
}

function updateUIForLoggedOutUser() {
    document.getElementById('auth-forms').style.display = 'block';
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('calendars').innerHTML = ''; // Clear calendars
}

// Initialize authentication
function initializeAuth() {
    try {
        // Initialize Appwrite client
        window.appwriteClient = new Client();
        window.appwriteClient
            .setEndpoint('https://fra.cloud.appwrite.io/v1')
            .setProject('68230f820010c85a6246');

        // Initialize Appwrite services
        const { Databases, Query } = Appwrite;
        window.databases = new Databases(window.appwriteClient);
        window.databases.Query = Query;

        // Initialize Account service
        window.account = new Account(window.appwriteClient);

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
