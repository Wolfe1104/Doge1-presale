document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const connectBtn = document.getElementById("connectBtn");
    const buyBtn = document.getElementById("buyBtn");
    const walletInfo = document.getElementById("walletInfo");
    const walletAddressSpan = document.getElementById("walletAddress");
    const cryptoSelect = document.getElementById("cryptoSelect");
    const amountInput = document.getElementById("amountInput");
    const buyNowBtn = document.getElementById("buyNowBtn");
    const buyModal = document.getElementById("buyModal");
    const usdInput = document.getElementById("usdInput");
    const cryptoDropdown = document.getElementById("cryptoDropdown");
    const cryptoAmount = document.getElementById("cryptoAmount");
    const purchaseBtn = document.getElementById("purchaseBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const cancelConfirmModal = document.getElementById("cancelConfirmModal");
    const cancelYesBtn = document.getElementById("cancelYesBtn");
    const cancelNoBtn = document.getElementById("cancelNoBtn");
    const purchaseConfirmModal = document.getElementById("purchaseConfirmModal");
    const purchaseDetails = document.getElementById("purchaseDetails");
    const connectWalletBtn = document.getElementById("connectWalletBtn");
    const purchaseCancelBtn = document.getElementById("purchaseCancelBtn");

    // Constants
    const wallets = {
        ETH: "0xD780c0B3a47c3FCA0090FC2153a80d15A4F286E3"
    };

    const cryptoRates = {
        ETH: 2000  // $2,000 per ETH
    };

    const doge1Price = 0.00050; // Starting presale price
    let walletProvider, signer, walletAddress;

    // Initialize WalletConnect
    const walletConnectProvider = new WalletConnectProvider({
        rpc: {
            1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161" // Free Infura ID for Ethereum mainnet
        },
        chainId: 1 // Ethereum mainnet
    });

    // Function to connect wallet via WalletConnect
    async function connectWallet() {
        console.log("Attempting WalletConnect for ETH...");
        console.log("WalletConnectProvider instance:", walletConnectProvider);
        
        try {
            if (!walletConnectProvider.connected) {
                console.log("Triggering WalletConnect enable...");
                await walletConnectProvider.enable(); // Should show QR code
            }
            walletProvider = new ethers.providers.Web3Provider(walletConnectProvider);
            signer = walletProvider.getSigner();
            walletAddress = await signer.getAddress();
            console.log("Connected ETH wallet via WalletConnect:", walletAddress);
            return true;
        } catch (error) {
            console.error("WalletConnect connection error:", error);
            alert("Failed to connect wallet: " + error.message + "\n1. Ensure Trust Wallet or MetaMask is installed.\n2. Scan the QR code with your wallet app.\n3. Try again.");
            return false;
        }
    }

    // Verify DOM elements exist
    console.log("Checking DOM elements:");
    console.log("buyNowBtn:", buyNowBtn);
    console.log("buyModal:", buyModal);
    console.log("purchaseBtn:", purchaseBtn);
    console.log("connectWalletBtn:", connectWalletBtn);

    // Wallet connection for .buy-section
    if (connectBtn) {
        connectBtn.addEventListener("click", async () => {
            console.log("Connect button clicked");
            if (await connectWallet()) {
                walletAddressSpan.textContent = walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
                walletInfo.style.display = "block";
                connectBtn.style.display = "none";
            }
        });
    } else {
        console.error("connectBtn not found in DOM");
    }

    // Buy button in .buy-section
    if (buyBtn) {
        buyBtn.addEventListener("click", async () => {
            console.log("Buy button clicked");
            const amount = parseFloat(amountInput.value);
            if (!amount || amount <= 0) { alert("Enter a valid amount!"); return; }

            if (await connectWallet()) {
                const tx = { to: wallets.ETH, value: ethers.utils.parseEther(amount.toString()) };
                const txResponse = await signer.sendTransaction(tx);
                const txHash = txResponse.hash;
                alert(`Success! TX: ${txHash}\nDM TX hash + Polygon address on X @YourXHandle!`);
            }
        });
    } else {
        console.error("buyBtn not found in DOM");
    }

    // Slider Reset
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

    // Hamburger Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const popupMenu = document.getElementById('popupMenu');
    if (menuToggle && popupMenu) {
        menuToggle.addEventListener('click', () => {
            console.log("Hamburger menu clicked");
            popupMenu.classList.toggle('active');
        });
    }

    // Buy Now Button
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            console.log("Buy Now button clicked");
            if (buyModal) {
                buyModal.style.display = 'block';
            } else {
                console.error("buyModal not found in DOM");
            }
        });
    } else {
        console.error("buyNowBtn not found in DOM");
    }

    // USD Input
    if (usdInput) {
        usdInput.addEventListener('input', () => {
            console.log("USD input changed");
            const usd = parseFloat(usdInput.value) || 0;
            const cryptoValue = usd / cryptoRates.ETH;
            cryptoAmount.textContent = `Crypto Amount: ${cryptoValue.toFixed(6)} ETH`;
        });
    }

    // Lock dropdown to ETH
    if (cryptoDropdown) {
        cryptoDropdown.value = "ETH";
        cryptoDropdown.disabled = true;
    }

    // Cancel Button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            console.log("Cancel button clicked");
            if (cancelConfirmModal) {
                cancelConfirmModal.style.display = 'block';
            }
        });
    }

    if (cancelYesBtn) {
        cancelYesBtn.addEventListener('click', () => {
            console.log("Cancel Yes clicked");
            cancelConfirmModal.style.display = 'none';
            buyModal.style.display = 'none';
            usdInput.value = '';
            cryptoAmount.textContent = 'Crypto Amount: 0';
        });
    }

    if (cancelNoBtn) {
        cancelNoBtn.addEventListener('click', () => {
            console.log("Cancel No clicked");
            cancelConfirmModal.style.display = 'none';
        });
    }

    // Purchase Button
    if (purchaseBtn) {
        purchaseBtn.addEventListener('click', () => {
            console.log("Purchase button clicked");
            const usd = parseFloat(usdInput.value) || 0;
            if (usd <= 0) {
                alert("Please enter a valid USD amount!");
                return;
            }
            const cryptoValue = usd / cryptoRates.ETH;
            const doge1Amount = usd / doge1Price;
            purchaseDetails.textContent = `You are about to purchase ${doge1Amount.toFixed(2)} $DOGE1 for ${cryptoValue.toFixed(6)} ETH.`;
            purchaseConfirmModal.style.display = 'block';
        });
    }

    // Purchase Cancel Button
    if (purchaseCancelBtn) {
        purchaseCancelBtn.addEventListener('click', () => {
            console.log("Purchase Cancel clicked");
            purchaseConfirmModal.style.display = 'none';
        });
    }

    // Connect Wallet Button in Modal
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', async () => {
            console.log("Connect Wallet button clicked in modal");
            const usd = parseFloat(usdInput.value) || 0;
            const cryptoValue = usd / cryptoRates.ETH;
            const doge1Amount = usd / doge1Price;

            if (await connectWallet()) {
                const tx = { to: wallets.ETH, value: ethers.utils.parseEther(cryptoValue.toString()) };
                const txResponse = await signer.sendTransaction(tx);
                const txHash = txResponse.hash;

                // Save profile locally
                const profile = {
                    wallet: walletAddress,
                    doge1Amount: doge1Amount,
                    usdValue: usd,
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem(`doge1_profile_${walletAddress}`, JSON.stringify(profile));

                alert(`Purchase successful! TX: ${txHash}\nYou now own ${doge1Amount.toFixed(2)} $DOGE1 worth $${usd}.\nDM TX hash + Polygon address on X @YourXHandle!`);
                purchaseConfirmModal.style.display = 'none';
                buyModal.style.display = 'none';
                usdInput.value = '';
                cryptoAmount.textContent = 'Crypto Amount: 0';
            } else {
                alert(`Manual payment fallback: Send ${cryptoValue.toFixed(6)} ETH to ${wallets.ETH}\nDM TX hash on X @YourXHandle to confirm your purchase of ${doge1Amount.toFixed(2)} $DOGE1!`);
                purchaseConfirmModal.style.display = 'none';
                buyModal.style.display = 'none';
                usdInput.value = '';
                cryptoAmount.textContent = 'Crypto Amount: 0';
            }
        });
    }

    // Log on load
    window.addEventListener('load', () => {
        console.log("Page fully loaded - Checking WalletConnect:");
        console.log("WalletConnectProvider:", walletConnectProvider);
    });

    // WalletConnect event listeners
    walletConnectProvider.on("accountsChanged", (accounts) => {
        console.log("WalletConnect accounts changed:", accounts);
        if (accounts.length > 0) {
            walletAddress = accounts[0];
            walletAddressSpan.textContent = walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
        }
    });

    walletConnectProvider.on("chainChanged", (chainId) => {
        console.log("WalletConnect chain changed:", chainId);
        if (chainId !== 1) {
            alert("Please switch to Ethereum mainnet in your wallet!");
        }
    });

    walletConnectProvider.on("disconnect", (code, reason) => {
        console.log("WalletConnect disconnected:", code, reason);
        walletAddressSpan.textContent = "";
        walletInfo.style.display = "none";
        connectBtn.style.display = "block";
    });

    // Periodic check
    setInterval(() => {
        console.log("Periodic WalletConnect check:");
        console.log("Connected:", walletConnectProvider.connected);
        console.log("Accounts:", walletConnectProvider.accounts);
    }, 2000);
});
