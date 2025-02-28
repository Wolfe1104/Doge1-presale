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
    const footerAuth = document.getElementById("footerAuth");
    const footerSignUpBtn = document.getElementById("footerSignUpBtn");
    const footerSignInBtn = document.getElementById("footerSignInBtn");
    const profileName = document.getElementById("profileName");
    const profileUsername = document.getElementById("profileUsername");
    const profileEmail = document.getElementById("profileEmail");
    const doge1Owned = document.getElementById("doge1Owned");
    const doge1Value = document.getElementById("doge1Value");
    const introBuyBtn = document.getElementById("introBuyBtn");
    const hypeBuyBtn = document.getElementById("hypeBuyBtn");
    const footerBuyBtn = document.getElementById("footerBuyBtn");
    const menuBuyBtn = document.getElementById("menuBuyBtn");
    const buyModal = document.getElementById("buyModal");
    const maticOption = document.getElementById("maticOption");
    const paypalOption = document.getElementById("paypalOption");
    const venmoOption = document.getElementById("venmoOption");
    const maticFields = document.getElementById("maticFields");
    const usdInput = document.getElementById("usdInput");
    const maticAmount = document.getElementById("maticAmount");
    const doge1Amount = document.getElementById("doge1Amount");
    const cancelBuyBtn = document.getElementById("cancelBuyBtn");
    const buyBtn = document.getElementById("buyBtn");
    const registerLink = document.getElementById("registerLink");

    let provider, signer, walletAddress;
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || null;
    let sessionTimeout;

    // Matic Price (simulated, ~$0.73 USD as of Feb 28, 2025, +10% premium)
    const maticPriceUSD = 0.73 * 1.10; // ~$0.803 with premium
    const phasePrices = [0.00050, 0.00071, 0.00092, 0.00113, 0.00134, 0.00155, 0.00176, 0.00197, 0.00218, 0.00239, 0.00260, 0.00281, 0.00500];
    let currentPhase = 0; // Phase 1 (update dynamically later)

    // Redirect Logic
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log("Current Page:", currentPage);
    console.log("Logged In User:", loggedInUser);

    if (loggedInUser && currentPage !== 'profile.html') {
        console.log("Redirecting to profile.html");
        window.location.href = 'profile.html';
        return;
    } else if (!loggedInUser && currentPage !== 'index.html') {
        console.log("Redirecting to index.html");
        window.location.href = 'index.html';
        return;
    }

    // Populate Profile Data
    if (loggedInUser && currentPage === 'profile.html' && profileName && profileUsername && profileEmail) {
        profileName.textContent = loggedInUser.name;
        profileUsername.textContent = loggedInUser.username;
        profileEmail.textContent = loggedInUser.email;
        doge1Owned.textContent = loggedInUser.doge1Owned || 0;
        doge1Value.textContent = (loggedInUser.doge1Owned || 0) * phasePrices[currentPhase];
    }

    // Set UI State
    if (loggedInUser) {
        if (authButtons) authButtons.style.display = "none";
        if (footerAuth) footerAuth.style.display = "none";
        if (userMenu) userMenu.style.display = "block";
        startSessionTimeout();
    } else {
        if (authButtons) authButtons.style.display = "flex";
        if (footerAuth) footerAuth.style.display = "flex";
        if (userMenu) userMenu.style.display = "none";
    }

    // Buy Now Buttons (Index.html)
    console.log("introBuyBtn:", introBuyBtn);
    console.log("hypeBuyBtn:", hypeBuyBtn);
    console.log("footerBuyBtn:", footerBuyBtn);

    if (introBuyBtn) {
        introBuyBtn.addEventListener('click', () => {
            console.log("Intro Buy Button Clicked");
            if (loggedInUser) {
                window.location.href = 'profile.html';
            } else {
                signInModal.style.display = 'block';
            }
        });
    }
    if (hypeBuyBtn) {
        hypeBuyBtn.addEventListener('click', () => {
            console.log("Hype Buy Button Clicked");
            if (loggedInUser) {
                window.location.href = 'profile.html';
            } else {
                signInModal.style.display = 'block';
            }
        });
    }
    if (footerBuyBtn) {
        footerBuyBtn.addEventListener('click', () => {
            console.log("Footer Buy Button Clicked");
            if (loggedInUser && currentPage !== 'profile.html') {
                window.location.href = 'profile.html';
            } else if (!loggedInUser) {
                signInModal.style.display = 'block';
            } else {
                buyModal.style.display = 'block';
            }
        });
    }

    // Buy Now Buttons (Profile.html)
    if (menuBuyBtn) {
        menuBuyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Menu Buy Button Clicked");
            buyModal.style.display = 'block';
        });
    }

    // Buy Modal Logic
    if (maticOption) {
        maticOption.addEventListener('change', () => {
            maticFields.style.display = maticOption.checked ? 'block' : 'none';
            paypalOption.checked = false;
            venmoOption.checked = false;
        });
    }
    if (paypalOption) {
        paypalOption.addEventListener('change', () => {
            maticFields.style.display = 'none';
            maticOption.checked = false;
            venmoOption.checked = false;
        });
    }
    if (venmoOption) {
        venmoOption.addEventListener('change', () => {
            maticFields.style.display = 'none';
            maticOption.checked = false;
            paypalOption.checked = false;
        });
    }

    if (usdInput) {
        usdInput.addEventListener('input', () => {
            const usd = parseFloat(usdInput.value) || 0;
            const matic = usd / maticPriceUSD;
            const doge1 = usd / phasePrices[currentPhase];
            maticAmount.textContent = matic.toFixed(6);
            doge1Amount.textContent = doge1.toFixed(2);
        });
    }

    if (cancelBuyBtn) {
        cancelBuyBtn.addEventListener('click', () => {
            buyModal.style.display = 'none';
            maticOption.checked = false;
            paypalOption.checked = false;
            venmoOption.checked = false;
            maticFields.style.display = 'none';
            usdInput.value = '';
            maticAmount.textContent = '0';
            doge1Amount.textContent = '0';
        });
    }

    if (buyBtn) {
        buyBtn.addEventListener('click', () => {
            if (maticOption.checked) {
                const usd = parseFloat(usdInput.value) || 0;
                if (usd <= 0) {
                    alert("Please enter a valid USD amount.");
                    return;
                }
                const matic = usd / maticPriceUSD;
                const doge1 = usd / phasePrices[currentPhase];
                openMaticPaymentWindow(matic, doge1);
                buyModal.style.display = 'none';
            } else if (paypalOption.checked || venmoOption.checked) {
                alert("PayPal and Venmo options coming soon!");
            } else {
                alert("Please select a payment method.");
            }
        });
    }

    // Matic Payment Window
    function openMaticPaymentWindow(matic, doge1) {
        const paymentWindow = window.open('', '_blank', 'width=600,height=400');
        paymentWindow.document.write(`
            <html>
            <head><title>Send Matic</title>
            <style>
                body { background: #1f1f1f; color: #fff; font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                .warning { color: #ff3366; font-weight: bold; }
                #progressBar { width: 100%; height: 20px; }
            </style>
            </head>
            <body>
                <h2>Send Matic</h2>
                <p>Matic Wallet Address: <strong>0xYourMaticAddressHere</strong></p>
                <p><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0xYourMaticAddressHere" alt="QR Code"></p>
                <p>Send ${matic.toFixed(6)} Matic to this address.</p>
                <p class="warning">Do not refresh or close this window until transaction is complete!</p>
                <progress id="progressBar" value="0" max="100"></progress>
                <p>Status: <span id="status">Pending</span></p>
                <script>
                    let progress = 0;
                    const progressBar = document.getElementById("progressBar");
                    const status = document.getElementById("status");
                    const interval = setInterval(() => {
                        progress += 10;
                        progressBar.value = progress;
                        if (progress >= 50) status.textContent = "Received";
                        if (progress >= 100) {
                            status.textContent = "Complete";
                            clearInterval(interval);
                            window.opener.postMessage({ doge1: ${doge1}, complete: true }, '*');
                        }
                    }, 1000);
                </script>
            </body>
            </html>
        `);
    }

    // Handle Transaction Completion
    window.addEventListener('message', (event) => {
        if (event.data.complete && loggedInUser) {
            loggedInUser.doge1Owned = (loggedInUser.doge1Owned || 0) + event.data.doge1;
            localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
            if (doge1Owned) doge1Owned.textContent = loggedInUser.doge1Owned;
            if (doge1Value) doge1Value.textContent = (loggedInUser.doge1Owned * phasePrices[currentPhase]).toFixed(2);
            users = users.map(u => u.username === loggedInUser.username ? loggedInUser : u);
            localStorage.setItem("users", JSON.stringify(users));
        }
    });

    // Wallet Connection
    if (connectBtn) {
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
    }

    // Slider Animation
    const phaseSlider = document.querySelector('.phase-slider');
    if (phaseSlider) {
        phaseSlider.addEventListener('animationiteration', () => {
            phaseSlider.style.transition = 'none';
            phaseSlider.style.transform = 'translateX(0)';
            setTimeout(() => {
                phaseSlider.style.transition = 'transform 0s linear';
            }, 50);
        });
    }

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
        if (authButtons) authButtons.style.display = "none";
        if (footerAuth) footerAuth.style.display = "none";
        if (userMenu) userMenu.style.display = "block";
        startSessionTimeout();
        if (currentPage !== 'profile.html') {
            console.log("setLoggedIn redirecting to profile.html");
            window.location.href = 'profile.html';
        } else {
            if (profileName) profileName.textContent = user.name;
            if (profileUsername) profileUsername.textContent = user.username;
            if (profileEmail) profileEmail.textContent = user.email;
            if (doge1Owned) doge1Owned.textContent = user.doge1Owned || 0;
            if (doge1Value) doge1Value.textContent = ((user.doge1Owned || 0) * phasePrices[currentPhase]).toFixed(2);
        }
    }

    function logout() {
        loggedInUser = null;
        localStorage.removeItem("loggedInUser");
        clearTimeout(sessionTimeout);
        if (authButtons) authButtons.style.display = "flex";
        if (footerAuth) footerAuth.style.display = "flex";
        if (userMenu) userMenu.style.display = "none";
        if (dropdownMenu) dropdownMenu.style.display = "none";
        if (currentPage !== 'index.html') {
            console.log("Logout redirecting to index.html");
            window.location.href = 'index.html';
        }
    }

    function startSessionTimeout() {
        clearTimeout(sessionTimeout);
        sessionTimeout = setTimeout(logout, 10 * 60 * 1000); // 10 minutes
    }

    // Sign Up Modal (index.html only)
    if (signUpBtn) {
        signUpBtn.addEventListener('click', () => {
            signUpModal.style.display = 'block';
        });
    }
    if (footerSignUpBtn) {
        footerSignUpBtn.addEventListener('click', () => {
            signUpModal.style.display = 'block';
        });
    }
    if (cancelSignUpBtn) {
        cancelSignUpBtn.addEventListener('click', () => {
            signUpModal.style.display = 'none';
            clearSignUpForm();
        });
    }
    if (registerBtn) {
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

            const user = { name, username, email, password, doge1Owned: 0 };
            users.push(user);
            localStorage.setItem("users", JSON.stringify(users));
            setLoggedIn(user);
            signUpModal.style.display = 'none';
            clearSignUpForm();
        });
    }

    // Sign In Modal (index.html only)
    if (signInBtn) {
        signInBtn.addEventListener('click', () => {
            signInModal.style.display = 'block';
        });
    }
    if (footerSignInBtn) {
        footerSignInBtn.addEventListener('click', () => {
            signInModal.style.display = 'block';
        });
    }
    if (cancelSignInBtn) {
        cancelSignInBtn.addEventListener('click', () => {
            signInModal.style.display = 'none';
            clearSignInForm();
        });
    }
    if (loginBtn) {
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
    }
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            signInModal.style.display = 'none';
            signUpModal.style.display = 'block';
        });
    }

    // User Menu Dropdown (both pages)
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', () => {
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        });
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Clear Forms (index.html only)
    function clearSignUpForm() {
        if (document.getElementById("nameInput")) {
            document.getElementById("nameInput").value = '';
            document.getElementById("usernameInput").value = '';
            document.getElementById("emailInput").value = '';
            document
