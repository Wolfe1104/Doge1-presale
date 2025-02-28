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
        ETH: "0xD780c0B3a47c3FCA0090FC2153a80d15A4F286E3",
        SOL: "7p2ypSRWV2iXxMxyVhFYLsXRcZNqDzfeJtq56nH2VcLN",
        BTC: "bc1q84y0dcmfvfueyysug3u7w0hj3asl8dqlxql5sq",
        USDT: "0xD780c0B3a47c3FCA0090FC2153a80d15A4F286E3",
        DOGE: "DNgCHoNxAjH63nf2L7893qiqbu2TYp5CoX"
    };

    const cryptoRates = {
        ETH: 2000,  // $2,000 per ETH
        SOL: 100,   // $100 per SOL
        BTC: 60000, // $60,000 per BTC
        USDT: 1,    // $1 per USDT
        DOGE: 0.15  // $0.15 per DOGE
    };

    const doge1Price = 0.00050; // Starting presale price
    let provider, signer, walletAddress;

    // Web3Modal Setup with your Infura Project ID
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: "7a8ed9926f0e4c4da7bdb336342171cf" // Your Project ID
            }
        }
    };

    const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions
    });

    // Updated Connect Wallet Function
    async function connectWallet(crypto) {
        try {
            if (crypto === "ETH" || crypto === "USDT") {
                const instance = await web3Modal.connect();
                provider = new ethers.providers.Web3Provider(instance);
                signer = provider.getSigner();
                walletAddress = await signer.getAddress();
                console.log("Connected Wallet:", walletAddress);
                return true;
            } else if (crypto === "SOL" && window.solana) {
                await window.solana.connect();
                walletAddress = window.solana.publicKey.toString();
                console.log("Connected Solana Wallet:", walletAddress);
                return true;
            } else if (crypto === "SOL") {
                console.log("Solana wallet not detected.");
                alert("Please install a Solana wallet (e.g., Phantom) to connect for SOL!");
                return false;
            } else {
                walletAddress = "Manual_" + crypto;
                console.log("Manual payment selected for:", crypto);
                return true; // Manual payment mode
            }
        } catch (error) {
            console.error("Wallet Connection Failed:", error);
            alert("Failed to connect wallet: " + error.message);
            return false;
        }
    }

    // Wallet connection for .buy-section
    connectBtn.addEventListener("click", async () => {
        const crypto = cryptoSelect.value;
        if (await connectWallet(crypto)) {
            walletAddressSpan.textContent = walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
            walletInfo.style.display = "block";
            connectBtn.style.display = "none";
        }
    });

    buyBtn.addEventListener("click", async () => {
        const crypto = cryptoSelect.value;
        const amount = parseFloat(amountInput.value);
        if (!amount || amount <= 0) { alert("Enter a valid amount!"); return; }

        if (await connectWallet(crypto)) {
            let txHash;
            if (crypto === "ETH") {
                const tx = { to: wallets.ETH, value: ethers.parseEther(amount.toString()) };
                const txResponse = await signer.sendTransaction(tx);
                txHash = txResponse.hash;
            } else if (crypto === "USDT") {
                const usdtContract = new ethers.Contract("0xc2132D05D31c914a87C6611C10748AEb04B58e8F", ["function transfer(address to, uint256 value)"], signer);
                const txResponse = await usdtContract.transfer(wallets.USDT, ethers.parseUnits(amount.toString(), 6));
                txHash = txResponse.hash;
            } else if (crypto === "SOL") {
                const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"));
                const transaction = new solanaWeb3.Transaction().add(
                    solanaWeb3.SystemProgram.transfer({
                        fromPubkey: new solanaWeb3.PublicKey(walletAddress),
                        toPubkey: new solanaWeb3.PublicKey(wallets.SOL),
                        lamports: Math.floor(amount * solanaWeb3.LAMPORTS_PER_SOL),
                    })
                );
                const signature = await window.solana.signAndSendTransaction(transaction);
                txHash = signature;
            } else {
                alert(`Send ${amount} ${crypto} to: ${wallets[crypto]}\nDM TX hash on X @YourXHandle!`);
                return;
            }
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

    // Buy Now Button
    buyNowBtn.addEventListener("click", () => {
        console.log("Buy Now clicked");
        buyModal.style.display = 'block';
    });

    usdInput.addEventListener('input', () => {
        const usd = parseFloat(usdInput.value) || 0;
        const crypto = cryptoDropdown.value;
        const cryptoValue = usd / cryptoRates[crypto];
        cryptoAmount.textContent = `Crypto Amount: ${cryptoValue.toFixed(6)} ${crypto}`;
    });

    cryptoDropdown.addEventListener('change', () => {
        const usd = parseFloat(usdInput.value) || 0;
        const crypto = cryptoDropdown.value;
        const cryptoValue = usd / cryptoRates[crypto];
        cryptoAmount.textContent = `Crypto Amount: ${cryptoValue.toFixed(6)} ${crypto}`;
    });

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
        const crypto = cryptoDropdown.value;
        const cryptoValue = usd / cryptoRates[crypto];
        const doge1Amount = usd / doge1Price;
        purchaseDetails.textContent = `You are about to purchase ${doge1Amount.toFixed(2)} $DOGE1 for ${cryptoValue.toFixed(6)} ${crypto}.`;
        purchaseConfirmModal.style.display = 'block';
    });

    purchaseCancelBtn.addEventListener('click', () => {
        purchaseConfirmModal.style.display = 'none';
    });

    connectWalletBtn.addEventListener('click', async () => {
        const usd = parseFloat(usdInput.value) || 0;
        const crypto = cryptoDropdown.value;
        const cryptoValue = usd / cryptoRates[crypto];
        const doge1Amount = usd / doge1Price;

        if (await connectWallet(crypto)) {
            let txHash;
            if (crypto === "ETH") {
                const tx = { to: wallets.ETH, value: ethers.parseEther(cryptoValue.toString()) };
                const txResponse = await signer.sendTransaction(tx);
                txHash = txResponse.hash;
            } else if (crypto === "USDT") {
                const usdtContract = new ethers.Contract("0xc2132D05D31c914a87C6611C10748AEb04B58e8F", ["function transfer(address to, uint256 value)"], signer);
                const txResponse = await usdtContract.transfer(wallets.USDT, ethers.parseUnits(cryptoValue.toString(), 6));
                txHash = txResponse.hash;
            } else if (crypto === "SOL") {
                const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"));
                const transaction = new solanaWeb3.Transaction().add(
                    solanaWeb3.SystemProgram.transfer({
                        fromPubkey: new solanaWeb3.PublicKey(walletAddress),
                        toPubkey: new solanaWeb3.PublicKey(wallets.SOL),
                        lamports: Math.floor(cryptoValue * solanaWeb3.LAMPORTS_PER_SOL),
                    })
                );
                const signature = await window.solana.signAndSendTransaction(transaction);
                txHash = signature;
            } else {
                alert(`Manual payment: Send ${cryptoValue.toFixed(6)} ${crypto} to: ${wallets[crypto]}\nDM TX hash on X @YourXHandle to confirm your purchase of ${doge1Amount.toFixed(2)} $DOGE1!`);
                purchaseConfirmModal.style.display = 'none';
                buyModal.style.display = 'none';
                usdInput.value = '';
                cryptoAmount.textContent = 'Crypto Amount: 0';
                return;
            }
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
        }
    });
});
