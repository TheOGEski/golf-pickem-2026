// ============================================
// AUTHENTICATION
// ============================================

// Utility function to show status messages
function showStatus(message, type = 'info') {
    const statusDiv = document.getElementById('statusMessage');
    if (!statusDiv) return;
    
    if (!message) {
        statusDiv.innerHTML = '';
        return;
    }
    
    const className = type === 'error' ? 'error-message' : 
                     type === 'success' ? 'success-message' : 
                     type === 'warning' ? 'warning-message' : 'info-message';
    
    statusDiv.innerHTML = `<div class="${className}">${message}</div>`;
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.innerHTML = '';
        }, 5000);
    }
}

// Sanitize username for Firebase (no special characters)
function sanitizeUsername(username) {
    return username.replace(/\./g, '_dot_')
                   .replace(/#/g, '_hash_')
                   .replace(/\$/g, '_dollar_')
                   .replace(/\[/g, '_lbracket_')
                   .replace(/\]/g, '_rbracket_')
                   .replace(/\//g, '_slash_');
}

// Handle login button click - routes to correct function based on state
function handleLoginClick() {
    const passwordGroup = document.getElementById('passwordGroup');
    const isPasswordVisible = !passwordGroup.classList.contains('hidden');
    
    if (isPasswordVisible) {
        // Password field is visible, so attempt login
        login();
    } else {
        // Password field is hidden, so check user first
        checkUserAndPromptPassword();
    }
}

// Check if user exists and prompt for password
async function checkUserAndPromptPassword() {
    const username = document.getElementById('usernameInput').value.trim();
    
    if (!username) {
        showStatus('Please enter a username', 'error');
        return;
    }
    
    const sanitized = sanitizeUsername(username);
    console.log('Checking user:', username, '| Sanitized:', sanitized);
    
    try {
        const snapshot = await db.ref(`users/${sanitized}`).once('value');
        console.log('User exists:', snapshot.exists());
        
        if (!snapshot.exists()) {
            showStatus('Username not found. Please contact admin to create your account.', 'error');
            return;
        }
        
        const userData = snapshot.val();
        console.log('User data:', userData);
        window.tempUsername = sanitized;
        window.tempOriginalUsername = username;
        
        // Check if password is set
        if (!userData.passwordSet) {
            // First time login - show create password screen
            document.getElementById('loginScreen').classList.add('hidden');
            document.getElementById('createPasswordScreen').classList.remove('hidden');
        } else {
            // Show password field
            document.getElementById('passwordGroup').classList.remove('hidden');
            document.getElementById('passwordInput').focus();
        }
    } catch (error) {
        console.error('Error checking user:', error);
        showStatus('Error checking username', 'error');
    }
}

// Login user
async function login() {
    const password = document.getElementById('passwordInput').value;
    
    if (!password) {
        showStatus('Please enter your password', 'error');
        return;
    }
    
    console.log('Attempting login for user:', window.tempUsername);
    
    try {
        const snapshot = await db.ref(`users/${window.tempUsername}`).once('value');
        const userData = snapshot.val();
        console.log('Password match:', userData.password === password);
        
        if (userData.password === password) {
            currentUser = window.tempUsername;
            isAdmin = false;
            window.tempUsername = null;
            await showMainApp();
        } else {
            showStatus('Incorrect password', 'error');
            document.getElementById('passwordInput').value = '';
        }
    } catch (error) {
        console.error('Error during login process:', error);
        // Only show error if we haven't successfully logged in
        if (!currentUser) {
            showStatus('Error logging in', 'error');
        }
    }
}

// Create password for first-time login
async function createPassword() {
    const newPassword = document.getElementById('newPasswordInput').value;
    const confirmPassword = document.getElementById('confirmPasswordInput').value;
    
    if (!newPassword || !confirmPassword) {
        showStatus('Please fill in both password fields', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showStatus('Passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 4) {
        showStatus('Password must be at least 4 characters', 'error');
        return;
    }
    
    try {
        await db.ref(`users/${window.tempUsername}`).update({
            password: newPassword,
            passwordSet: true
        });
        
        currentUser = window.tempUsername;
        isAdmin = false;
        window.tempUsername = null;
        showMainApp();
    } catch (error) {
        console.error('Error creating password:', error);
        showStatus('Error creating password', 'error');
    }
}

// Show admin login screen
function showAdminLogin() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminLoginScreen').classList.remove('hidden');
}

// Show user login screen
function showUserLogin() {
    document.getElementById('adminLoginScreen').classList.add('hidden');
    document.getElementById('createPasswordScreen').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('passwordGroup').classList.add('hidden');
    document.getElementById('loginBtn').textContent = 'Continue';
}

// Admin login
function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        currentUser = 'admin';
        isAdmin = true;
        showMainApp();
    } else {
        showStatus('Incorrect admin password', 'error');
    }
}

// Show main application
async function showMainApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminLoginScreen').classList.add('hidden');
    document.getElementById('createPasswordScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    if (isAdmin) {
        // Show admin tabs
        document.getElementById('userTabs').classList.add('hidden');
        document.getElementById('adminTabs').classList.remove('hidden');
        switchTab('admin');
        await loadAdminData();
    } else {
        // Show user tabs
        document.getElementById('adminTabs').classList.add('hidden');
        document.getElementById('userTabs').classList.remove('hidden');
        switchTab('picks');
        await loadUserData();
    }
    
    showStatus(`Welcome ${isAdmin ? 'Admin' : currentUser}!`, 'success');
}

// Load user data
async function loadUserData() {
    console.log('🔄 loadUserData() called');
    try {
        // Load tournaments for selection
        console.log('📋 About to call loadTournamentList()...');
        await loadTournamentList();
        console.log('✅ loadTournamentList() completed');
        
        // Load standings
        console.log('📊 About to call loadStandings()...');
        loadStandings();
        console.log('✅ loadStandings() completed');
    } catch (error) {
        console.error('❌ Error loading user data:', error);
        console.error('Error stack:', error.stack);
        showStatus('Error loading data', 'error');
    }
}

// Load admin data
async function loadAdminData() {
    try {
        // Load tournament list for admin
        await loadAdminTournamentList();
        
        // Load user list
        await loadUserList();
    } catch (error) {
        console.error('Error loading admin data:', error);
        showStatus('Error loading admin data', 'error');
    }
}

// Logout
function logout() {
    currentUser = null;
    isAdmin = false;
    
    // Reset all forms
    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('passwordGroup').classList.add('hidden');
    document.getElementById('loginBtn').textContent = 'Continue';
    
    // Hide main app, show login
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
    
    showStatus('', '');
}

// Tab switching
function switchTab(tabName, clickEvent) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active to clicked nav tab (if called from a click event)
    if (clickEvent && clickEvent.target) {
        clickEvent.target.classList.add('active');
    }
    
    // Load data for specific tabs
    if (tabName === 'standings') {
        loadStandings();
    } else if (tabName === 'dashboard') {
        loadDashboard();
    } else if (tabName === 'admin') {
        // Initialize simulator if it exists
        if (typeof initializeSimulator === 'function') {
            initializeSimulator();
        }
    }
}

// Initialize on page load
window.addEventListener('load', () => {
    console.log('🏌️ Fed-up Cup Golf Pick\'em loaded');
    showStatus('', '');
});
