document.addEventListener("DOMContentLoaded", () => {
    const connectBtn = document.getElementById("connectBtn");
    const walletInfo = document.getElementById("walletInfo");
    const walletAddressSpan = document.getElementById("walletAddress");
    const cryptoSelect = document.getElementById("cryptoSelect");
    const signUpBtn = document.getElementById("signUpBtn");
    const signInBtn = document.getElementById("signInBtn");
    const signUpModal = document.getElementById("signUpModal");
    const signInModal = document.getElementById("signInModal");
    const cancelSignUpBtn = document.getElementById("cancelSignUpBtn");
    const registerBtn = document.getElementById("registerBtn");
    const cancelSignInBtn = document.getElementById("cancelSignInBtn");
    const loginBtn = document.getElementById("loginBtn");
    const authButtons = document.getElementById("authButtons");
    const userMenu = document.getElementById("userMenu");
    const userMenuBtn = document.getElementById("userMenuBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const logoutBtn = document.getElementById("logoutBtn");

    let provider, signer, walletAddress;
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || null;
    let sessionTimeout;

    // Wallet Connection
    async function connectWallet(crypto) {
        console.log(`Connecting wallet for ${crypto}...`);
        if (crypto === "ETH" || crypto === "USDT") {
            if (typeof window.ethereum !== "undefined") {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                signer = provider.getSigner();
                walletAddress = await signer.getAddress();
                console.log("Connected wallet:", walletAddress);
                return true;
            } else {
                console.log("Ethereum wallet not detected.");
                alert("Please install MetaMask or Trust Wallet to connect for ETH/USDT!");
                return false;
            }
        } else if (crypto === "SOL" && window.solana) {
            await window.solana.connect();
            walletAddress = window.solana.publicKey.toString();
            console.log("Connected Solana wallet:", walletAddress);
            return true;
        } else if (crypto === "SOL") {
            console.log("Solana wallet not detected.");
            alert("Please install a Solana wallet (e.g., Phantom) to connect for SOL!");
            return false;
        } else {
            walletAddress = "Manual_" + crypto;
            console.log("Manual payment selected for:", crypto);
            return true;
        }
    }

    connectBtn.addEventListener("click", async () => {
        const crypto = cryptoSelect.value;
        if (await connectWallet(crypto)) {
            walletAddressSpan.textContent = walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
            walletInfo.style.display = "block";
            connectBtn.style.display = "none";
        }
    });

    // Slider Animation
    const phaseSlider = document.querySelector('.phase-slider');
    phaseSlider.addEventListener('animationiteration', () => {
        phaseSlider.style.transition = 'none';
        phaseSlider.style.transform = 'translateX(0)';
        setTimeout(() => {
            phaseSlider.style.transition = 'transform 0s linear';
        }, 50);
    });

    // Pie Chart
    const chartCanvas = document.getElementById('tokenPieChart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Presale (40%)', 'Burned (20%)', 'Liquidity (20%)', 'Team (10%)', 'Development (10%)', 'Marketing (10%)'],
                    datasets: [{
                        data: [200, 100, 100, 50, 50, 50],
                        backgroundColor: ['#00ffcc', '#ff3366', '#33ccff', '#ffcc33', '#9966ff', '#ff6699'],
                        borderColor: '#000',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: { color: '#fff', font: { size: 12 }, boxWidth: 20, padding: 10 }
                        }
                    }
                }
            });
        }
    }

    // Login State Management
    function setLoggedIn(user) {
        loggedInUser = user;
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        authButtons.style.display = "none";
        userMenu.style.display = "block";
        startSessionTimeout();
    }

    function logout() {
        loggedInUser = null;
        localStorage.removeItem("loggedInUser");
        clearTimeout(sessionTimeout);
        authButtons.style.display = "flex";
        userMenu.style.display = "none";
        dropdownMenu.style.display = "none";
    }

    function startSessionTimeout() {
        clearTimeout(sessionTimeout);
        sessionTimeout = setTimeout(logout, 10 * 60 * 1000); // 10 minutes
    }

    if (loggedInUser) {
        setLoggedIn(loggedInUser);
    }

    // Sign Up Modal
    signUpBtn.addEventListener('click', () => {
        signUpModal.style.display = 'block';
    });

    cancelSignUpBtn.addEventListener('click', () => {
        signUpModal.style.display = 'none';
        clearSignUpForm();
    });

    registerBtn.addEventListener('click', () => {
        const name = document.getElementById("nameInput").value;
        const username = document.getElementById("usernameInput").value;
        const email = document.getElementById("emailInput").value;
        const password = document.getElementById("passwordInput").value;
        const notRobot = document.getElementById("notRobot").checked;

        if (!name || !username || !email || !password || !notRobot) {
            alert("Please fill all fields and confirm you're not a robot.");
            return;
        }

        if (users.find(u => u.username === username)) {
            alert("Username already exists.");
            return;
        }

        const user = { name, username, email, password };
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
        setLoggedIn(user);
        signUpModal.style.display = 'none';
        clearSignUpForm();
    });

    // Sign In Modal
    signInBtn.addEventListener('click', () => {
        signInModal.style.display = 'block';
    });

    cancelSignInBtn.addEventListener('click', () => {
        signInModal.style.display = 'none';
        clearSignInForm();
    });

    loginBtn.addEventListener('click', () => {
        const username = document.getElementById("loginUsernameInput").value;
        const password = document.getElementById("loginPasswordInput").value;

        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            setLoggedIn(user);
            signInModal.style.display = 'none';
            clearSignInForm();
        } else {
            alert("Invalid username or password.");
        }
    });

    // User Menu Dropdown
    userMenuBtn.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    // Clear Forms
    function clearSignUpForm() {
        document.getElementById("nameInput").value = '';
        document.getElementById("usernameInput").value = '';
        document.getElementById("emailInput").value = '';
        document.getElementById("passwordInput").value = '';
        document.getElementById("notRobot").checked = false;
    }

    function clearSignInForm() {
        document.getElementById("loginUsernameInput").value = '';
        document.getElementById("loginPasswordInput").value = '';
    }

    // Background Music
    const audio = document.getElementById("backgroundMusic");
    audio.volume = 0.1;
    audio.play().catch(() => console.log("Autoplay blocked by browser."));
});
