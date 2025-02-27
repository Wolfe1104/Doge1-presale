document.addEventListener("DOMContentLoaded", () => {
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

    const wallets = {
        ETH: "0xD780c0B3a47c3FCA0090FC2153a80d15A4F286E3"
    };

    const cryptoRates = {
        ETH: 2000  // $2,000 per ETH
    };

    const doge1Price = 0.00050; // Starting presale price
    let provider, signer, walletAddress;

    // Function to connect wallet (ETH via Trust Wallet or MetaMask)
    async function connectWallet() {
        console.log("Attempting to connect wallet for ETH...");
        console.log("window.ethereum:", window.ethereum);

        if (window.ethereum) {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                console.log("ETH accounts:", accounts);
                if (accounts.length > 0) {
                    signer = provider.getSigner();
                    walletAddress = await signer.getAddress();
                    console.log("Connected ETH wallet:", walletAddress);
                    return true;
                } else {
                    console.log("No accounts returned from wallet.");
                    alert("No accounts found. Please unlock Trust Wallet (or MetaMask) and ensure it’s set to Ethereum mainnet.");
                    return false;
                }
            } catch (error) {
                console.error("ETH connection error:", error);
                alert("Failed to connect wallet: " + error.message + "\nEnsure Trust Wallet (or MetaMask) is unlocked and set to Ethereum mainnet.");
                return false;
            }
        } else {
            console.log("Ethereum provider (Trust Wallet/MetaMask) not detected.");
            alert("Trust Wallet (or MetaMask) not detected!\n1. Ensure Trust Wallet is installed and active.\n2. Unlock it (enter password).\n3. Set to Ethereum mainnet.\n4. Refresh the page (F5).\nIf issues persist, send ETH manually to: " + wallets.ETH);
            return false;
        }
    }

    // Wallet connection for .buy-section
    connectBtn.addEventListener("click", async () => {
        if (await connectWallet()) {
            walletAddressSpan.textContent = walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
            walletInfo.style.display = "block";
            connectBtn.style.display = "none";
        }
    });

    buyBtn.addEventListener("click", async () => {
        const amount = parseFloat(amountInput.value);
        if (!amount || amount <= 0) { alert("Enter a valid amount!"); return; }

        if (await connectWallet()) {
            const tx = { to: wallets.ETH, value: ethers.utils.parseEther(amount.toString()) };
            const txResponse = await signer.sendTransaction(tx);
            const txHash = txResponse.hash;
            alert(`Success! TX: ${txHash}\nDM TX hash + Polygon address on X @YourXHandle!`);
        }
    });

    // Slider Reset
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

    // Hamburger Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const popupMenu = document.getElementById('popupMenu');
    menuToggle.addEventListener('click', () => {
        popupMenu.classList.toggle('active');
    });

    // Buy Now Modal Logic
    buyNowBtn.addEventListener('click', () => {
        buyModal.style.display = 'block';
    });

    usdInput.addEventListener('input', () => {
        const usd = parseFloat(usdInput.value) || 0;
        const cryptoValue = usd / cryptoRates.ETH;
        cryptoAmount.textContent = `Crypto Amount: ${cryptoValue.toFixed(6)} ETH`;
    });

    // Lock dropdown to ETH
    cryptoDropdown.value = "ETH";
    cryptoDropdown.disabled = true;

    cancelBtn.addEventListener('click', () => {
        cancelConfirmModal.style.display = 'block';
    });

    cancelYesBtn.addEventListener('click', () => {
        cancelConfirmModal.style.display = 'none';
        buyModal.style.display = 'none';
        usdInput.value = '';
        cryptoAmount.textContent = 'Crypto Amount: 0';
    });

    cancelNoBtn.addEventListener('click', () => {
        cancelConfirmModal.style.display = 'none';
    });

    purchaseBtn.addEventListener('click', () => {
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

    purchaseCancelBtn.addEventListener('click', () => {
        purchaseConfirmModal.style.display = 'none';
    });

    connectWalletBtn.addEventListener('click', async () => {
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
            // Manual fallback for ETH if wallet connect fails
            alert(`Manual payment fallback: Send ${cryptoValue.toFixed(6)} ETH to ${wallets.ETH}\nDM TX hash on X @YourXHandle to confirm your purchase of ${doge1Amount.toFixed(2)} $DOGE1!`);
            purchaseConfirmModal.style.display = 'none';
            buyModal.style.display = 'none';
            usdInput.value = '';
            cryptoAmount.textContent = 'Crypto Amount: 0';
        }
    });

    // Log wallet availability on load
    window.addEventListener('load', () => {
        console.log("Page fully loaded - Checking wallets:");
        console.log("window.ethereum:", window.ethereum);
    });

    // Detect wallet changes
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            console.log("Accounts changed:", accounts);
        });
    }

    // Continuous wallet check
    setInterval(() => {
        console.log("Periodic wallet check:");
        console.log("window.ethereum:", window.ethereum);
    }, 2000);
});
