document.addEventListener("DOMContentLoaded", () => {
    // Core Variables
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || null;
    let sessionTimeout;

    // DOM Elements (Shared)
    const authButtons = document.getElementById("authButtons");
    const userMenu = document.getElementById("userMenu");
    const userMenuBtn = document.getElementById("userMenuBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const logoutBtn = document.getElementById("logoutBtn");
    const footerAuth = document.getElementById("footerAuth");

    // Index.html Elements
    const signUpBtn = document.getElementById("signUpBtn");
    const signInBtn = document.getElementById("signInBtn");
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

    // Profile.html Elements
    const profileName = document.getElementById("profileName");
    const profileUsername = document.getElementById("profileUsername");
    const profileEmail = document.getElementById("profileEmail");
    const doge1Owned = document.getElementById("doge1Owned");
    const doge1Value = document.getElementById("doge1Value");
    const buyNowBtn = document.getElementById("buyNowBtn");

    // Initial State
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (loggedInUser) {
        if (currentPage === 'profile.html') {
            if (userMenu) userMenu.style.display = "block";
            startSessionTimeout();
            populateProfile();
        } else if (currentPage === 'index.html') {
            // Force logout state on index.html unless signing in
            loggedInUser = null;
            localStorage.removeItem("loggedInUser");
            if (authButtons) authButtons.style.display = "flex";
            if (footerAuth) footerAuth.style.display = "flex";
            if (userMenu) userMenu.style.display = "none";
        }
    } else {
        if (authButtons) authButtons.style.display = "flex";
        if (footerAuth) footerAuth.style.display = "flex";
        if (userMenu) userMenu.style.display = "none";
        if (currentPage !== 'index.html') {
            window.location.href = 'index.html';
        }
    }

    // Sign-In Logic
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const username = document.getElementById("loginUsernameInput").value.trim();
            const password = document.getElementById("loginPasswordInput").value.trim();

            console.log("Login attempt - Username:", username, "Password:", password);

            if (!username || !password) {
                alert("Please enter both username and password.");
                return;
            }

            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                console.log("User found:", user);
                setLoggedIn(user);
                signInModal.style.display = 'none';
                clearSignInForm();
                window.location.href = 'profile.html'; // Explicit redirect after sign-in
            } else {
                console.log("Login failed - Users in storage:", users);
                alert("Invalid username or password.");
            }
        });
    }

    // Sign-Up Logic
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            const name = document.getElementById("nameInput").value.trim();
            const username = document.getElementById("usernameInput").value.trim();
            const email = document.getElementById("emailInput").value.trim();
            const password = document.getElementById("passwordInput").value.trim();
            const notRobot = document.getElementById("notRobot").checked;

            if (!name || !username || !email || !password || !notRobot) {
                alert("Please fill all fields and confirm you're not a robot.");
                return;
            }

            if (users.find(u => u.username === username)) {
                alert("Username already exists.");
                return;
            }

            const user = { name, username, email, password, doge1Owned: 0 };
            users.push(user);
            localStorage.setItem("users", JSON.stringify(users));
            setLoggedIn(user);
            signUpModal.style.display = 'none';
            clearSignUpForm();
            window.location.href = 'profile.html'; // Explicit redirect after sign-up
        });
    }

    // Modal Triggers (index.html)
    if (signUpBtn) signUpBtn.addEventListener('click', () => signUpModal.style.display = 'block');
    if (footerSignUpBtn) footerSignUpBtn.addEventListener('click', () => signUpModal.style.display = 'block');
    if (signInBtn) signInBtn.addEventListener('click', () => signInModal.style.display = 'block');
    if (footerSignInBtn) footerSignInBtn.addEventListener('click', () => signInModal.style.display = 'block');
    if (cancelSignUpBtn) cancelSignUpBtn.addEventListener('click', () => { signUpModal.style.display = 'none'; clearSignUpForm(); });
    if (cancelSignInBtn) cancelSignInBtn.addEventListener('click', () => { signInModal.style.display = 'none'; clearSignInForm(); });
    if (registerLink) registerLink.addEventListener('click', (e) => { e.preventDefault(); signInModal.style.display = 'none'; signUpModal.style.display = 'block'; });

    // Buy Buttons (index.html)
    if (introBuyBtn) introBuyBtn.addEventListener('click', () => loggedInUser ? window.location.href = 'profile.html' : signInModal.style.display = 'block');
    if (hypeBuyBtn) hypeBuyBtn.addEventListener('click', () => loggedInUser ? window.location.href = 'profile.html' : signInModal.style.display = 'block');
    if (footerBuyBtn) footerBuyBtn.addEventListener('click', () => loggedInUser ? window.location.href = 'profile.html' : signInModal.style.display = 'block');

    // Buy Button (profile.html)
    if (buyNowBtn) buyNowBtn.addEventListener('click', () => alert("Buy functionality coming soon!"));

    // User Menu (both pages)
    if (userMenuBtn) userMenuBtn.addEventListener('click', () => dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block");
    if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); logout(); });

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
    function setLoggedIn(user) {
        loggedInUser = user;
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        if (authButtons) authButtons.style.display = "none";
        if (footerAuth) footerAuth.style.display = "none";
        if (userMenu) userMenu.style.display = "block";
        startSessionTimeout();
        console.log("Logged in successfully");
    }

    function logout() {
        loggedInUser = null;
        localStorage.removeItem("loggedInUser");
        clearTimeout(sessionTimeout);
        if (authButtons) authButtons.style.display = "flex";
        if (footerAuth) footerAuth.style.display = "flex";
        if (userMenu) userMenu.style.display = "none";
        if (dropdownMenu) dropdownMenu.style.display = "none";
        console.log("Logging out, redirecting to index.html");
        window.location.href = 'index.html';
    }

    function startSessionTimeout() {
        clearTimeout(sessionTimeout);
        sessionTimeout = setTimeout(logout, 10 * 60 * 1000); // 10 minutes
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
