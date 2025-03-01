document.addEventListener("DOMContentLoaded", () => {
    // Core Variables
    let loggedInUser = null;
    let token = localStorage.getItem('token');

    // DOM Elements (Shared)
    const authButtons = document.getElementById("authButtons");
    const footerAuth = document.getElementById("footerAuth");

    // Index.html Elements
    const signUpModal = document.getElementById("signUpModal");
    const signInModal = document.getElementById("signInModal");
    const cancelSignUpBtn = document.getElementById("cancelSignUpBtn");
    const registerBtn = document.getElementById("registerBtn");
    const cancelSignInBtn = document.getElementById("cancelSignInBtn");
    const loginBtn = document.getElementById("loginBtn");
    const registerLink = document.getElementById("registerLink");
    const footerSignUpBtn = document.getElementById("footerSignUpBtn");
    const footerSignInBtn = document.getElementById("footerSignInBtn");
    const introBuyBtn = document.getElementById("introBuyBtn");
    const hypeBuyBtn = document.getElementById("hypeBuyBtn");
    const footerBuyBtn = document.getElementById("footerBuyBtn");
    const chartCanvas = document.getElementById("tokenPieChart");
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const hamburgerMenu = document.getElementById("hamburgerMenu");
    const signUpLink = document.getElementById("signUpLink");
    const signInLink = document.getElementById("signInLink");
    const profileLink = document.getElementById("profileLink");
    const logoutLink = document.getElementById("logoutLink");

    // Profile.html Elements
    const profileName = document.getElementById("profileName");
    const profileUsername = document.getElementById("profileUsername");
    const profileEmail = document.getElementById("profileEmail");
    const doge1Owned = document.getElementById("doge1Owned");
    const doge1Value = document.getElementById("doge1Value");
    const buyNowBtn = document.getElementById("buyNowBtn");

    // Debug: Log DOM elements
    console.log("Login Button:", loginBtn);
    console.log("Register Button:", registerBtn);

    // Initial State
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (token) {
        fetchProfile();
    } else {
        if (authButtons) authButtons.style.display = "flex";
        if (footerAuth) footerAuth.style.display = "flex";
        if (signUpLink) signUpLink.style.display = "block";
        if (signInLink) signInLink.style.display = "block";
        if (profileLink) profileLink.style.display = "none";
        if (logoutLink) logoutLink.style.display = "none";
        if (currentPage !== 'index.html') {
            window.location.href = 'index.html';
        }
    }

    // Hamburger Menu Toggle
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            console.log("Hamburger clicked");
            hamburgerMenu.style.display = hamburgerMenu.style.display === "block" ? "none" : "block";
        });
    }

    // Sign-In Logic
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            console.log("Sign In button clicked");
            const username = document.getElementById("loginUsernameInput").value.trim();
            const password = document.getElementById("loginPasswordInput").value.trim();

            console.log("Login attempt - Username:", username, "Password:", password ? "[hidden]" : "empty");

            if (!username || !password) {
                alert("Please enter both username and password.");
                return;
            }

            try {
                console.log("Sending login request...");
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();
                console.log("Login response:", data);
                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    token = data.token;
                    setLoggedIn();
                    signInModal.style.display = 'none';
                    clearSignInForm();
                    window.location.href = 'profile.html';
                } else {
                    alert(data.error);
                }
            } catch (err) {
                console.error('Login error:', err);
                alert('Server error. Is the backend running?');
            }
        });
    } else {
        console.error("Login button not found in DOM");
    }

    // Sign-Up Logic
    if (registerBtn) {
        registerBtn.addEventListener('click', async () => {
            console.log("Sign Up button clicked");
            const name = document.getElementById("nameInput").value.trim();
            const username = document.getElementById("usernameInput").value.trim();
            const email = document.getElementById("emailInput").value.trim();
            const password = document.getElementById("passwordInput").value.trim();
            const notRobot = document.getElementById("notRobot").checked;

            console.log("Signup attempt - Name:", name, "Username:", username, "Email:", email, "Not Robot:", notRobot);

            if (!name || !username || !email || !password || !notRobot) {
                alert("Please fill all fields and confirm you're not a robot.");
                return;
            }

            try {
                console.log("Sending signup request...");
                const response = await fetch('http://localhost:3000/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, username, email, password })
                });
                const data = await response.json();
                console.log("Signup response:", data);
                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    token = data.token;
                    setLoggedIn();
                    signUpModal.style.display = 'none';
                    clearSignUpForm();
                    window.location.href = 'profile.html';
                } else {
                    alert(data.error);
                }
            } catch (err) {
                console.error('Signup error:', err);
                alert('Server error. Is the backend running?');
            }
        });
    } else {
        console.error("Register button not found in DOM");
    }

    // Modal Triggers (index.html)
    if (footerSignUpBtn) footerSignUpBtn.addEventListener('click', () => { console.log("Footer Sign Up"); signUpModal.style.display = 'block'; });
    if (footerSignInBtn) footerSignInBtn.addEventListener('click', () => { console.log("Footer Sign In"); signInModal.style.display = 'block'; });
    if (cancelSignUpBtn) cancelSignUpBtn.addEventListener('click', () => { signUpModal.style.display = 'none'; clearSignUpForm(); });
    if (cancelSignInBtn) cancelSignInBtn.addEventListener('click', () => { signInModal.style.display = 'none'; clearSignInForm(); });
    if (registerLink) registerLink.addEventListener('click', (e) => { e.preventDefault(); signInModal.style.display = 'none'; signUpModal.style.display = 'block'; });
    if (signUpLink) signUpLink.addEventListener('click', (e) => { e.preventDefault(); console.log("Menu Sign Up"); signUpModal.style.display = 'block'; hamburgerMenu.style.display = 'none'; });
    if (signInLink) signInLink.addEventListener('click', (e) => { e.preventDefault(); console.log("Menu Sign In"); signInModal.style.display = 'block'; hamburgerMenu.style.display = 'none'; });

    // Buy Buttons (index.html)
    if (introBuyBtn) introBuyBtn.addEventListener('click', () => token ? window.location.href = 'profile.html' : signInModal.style.display = 'block');
    if (hypeBuyBtn) hypeBuyBtn.addEventListener('click', () => token ? window.location.href = 'profile.html' : signInModal.style.display = 'block');
    if (footerBuyBtn) footerBuyBtn.addEventListener('click', () => token ? window.location.href = 'profile.html' : signInModal.style.display = 'block');

    // Buy Button (profile.html)
    if (buyNowBtn) buyNowBtn.addEventListener('click', () => alert("Buy functionality coming soon!"));

    // Logout (hamburger menu)
    if (logoutLink) logoutLink.addEventListener('click', (e) => { e.preventDefault(); logout(); });

    // Pie Chart (index.html)
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Presale (40%)', 'Burned (20%)', 'Liquidity (20%)', 'Team (10%)', 'Development (10%)'],
                datasets: [{
                    data: [200, 100, 100, 50, 50],
                    backgroundColor: ['#00ffcc', '#ff3366', '#33ccff', '#ffcc33', '#9966ff'],
                    borderColor: '#000',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'right', labels: { color: '#fff', font: { size: 12 } } } }
            }
        });
    }

    // Helper Functions
    function setLoggedIn() {
        if (authButtons) authButtons.style.display = "none";
        if (footerAuth) footerAuth.style.display = "none";
        if (signUpLink) signUpLink.style.display = "none";
        if (signInLink) signInLink.style.display = "none";
        if (profileLink) profileLink.style.display = "block";
        if (logoutLink) logoutLink.style.display = "block";
        console.log("Logged in successfully");
    }

    function logout() {
        localStorage.removeItem('token');
        token = null;
        if (authButtons) authButtons.style.display = "flex";
        if (footerAuth) footerAuth.style.display = "flex";
        if (signUpLink) signUpLink.style.display = "block";
        if (signInLink) signInLink.style.display = "block";
        if (profileLink) profileLink.style.display = "none";
        if (logoutLink) logoutLink.style.display = "none";
        console.log("Logging out, redirecting to index.html");
        window.location.href = 'index.html';
    }

    async function fetchProfile() {
        try {
            const response = await fetch('http://localhost:3000/api/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                loggedInUser = data;
                setLoggedIn();
                if (currentPage === 'profile.html') {
                    populateProfile();
                }
            } else {
                logout(); // Invalid token, force logout
            }
        } catch (err) {
            console.error('Profile fetch error:', err);
            logout();
        }
    }

    function clearSignUpForm() {
        if (document.getElementById("nameInput")) {
            document.getElementById("nameInput").value = '';
            document.getElementById("usernameInput").value = '';
            document.getElementById("emailInput").value = '';
            document.getElementById("passwordInput").value = '';
            document.getElementById("notRobot").checked = false;
        }
    }

    function clearSignInForm() {
        if (document.getElementById("loginUsernameInput")) {
            document.getElementById("loginUsernameInput").value = '';
            document.getElementById("loginPasswordInput").value = '';
        }
    }

    function populateProfile() {
        if (profileName) profileName.textContent = loggedInUser.name;
        if (profileUsername) profileUsername.textContent = loggedInUser.username;
        if (profileEmail) profileEmail.textContent = loggedInUser.email;
        if (doge1Owned) doge1Owned.textContent = loggedInUser.doge1Owned || 0;
        if (doge1Value) doge1Value.textContent = ((loggedInUser.doge1Owned || 0) * 0.00050).toFixed(2); // Phase 1 price
    }
});
