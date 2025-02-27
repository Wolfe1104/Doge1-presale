document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
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
            1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161" // Free Infura ID
        },
        chainId: 1 // Ethereum mainnet
    });

    // Log DOM elements
    console.log("DOM Loaded - Checking elements:");
    console.log("buyNowBtn:", buyNowBtn);
    console.log("buyModal:", buyModal);
    console.log("usdInput:", usdInput);
    console.log("cryptoDropdown:", cryptoDropdown);
    console.log("cryptoAmount:", cryptoAmount);
    console.log("purchaseBtn:", purchaseBtn);
    console.log("cancelBtn:", cancelBtn);
    console.log("cancelConfirmModal:", cancelConfirmModal);
    console.log("cancelYesBtn:", cancelYesBtn);
    console.log("cancelNoBtn:", cancelNoBtn);
    console.log("purchaseConfirmModal:", purchaseConfirmModal);
    console.log("purchaseDetails:", purchaseDetails);
    console.log("connectWalletBtn:", connectWalletBtn);
    console.log("purchaseCancelBtn:", purchaseCancelBtn);

    // Function to connect wallet via WalletConnect
    async function connectWallet() {
        console.log("Attempting WalletConnect for ETH...");
        try {
            if (!walletConnectProvider.connected) {
                console.log("Triggering WalletConnect enable...");
                await walletConnectProvider.enable(); // Should show QR code
            }
            walletProvider = new ethers.providers.Web3Provider(walletConnectProvider);
            signer = walletProvider.getSigner();
            walletAddress = await signer.getAddress();
            console.log("Connected ETH wallet:", walletAddress);
            return true;
        } catch (error) {
            console.error("WalletConnect error:", error);
            alert("Failed to connect: " + error.message + "\nScan QR with Trust Wallet or MetaMask.");
            return false;
        }
    }

    // Buy Now Button
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            console.log("Buy Now clicked");
            if (buyModal) {
                buyModal.style.display = 'block';
            } else {
                console.error("buyModal not found");
            }
        });
    } else {
        console.error("buyNowBtn not found");
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
            console.log("Cancel clicked");
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
            console.log("Purchase clicked");
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
            console.log("Connect Wallet clicked");
            const usd = parseFloat(usdInput.value) || 0;
            const cryptoValue = usd / cryptoRates.ETH;
            const doge1Amount = usd / doge1Price;

            if (await connectWallet()) {
                const tx = { to: wallets.ETH, value: ethers.utils.parseEther(cryptoValue.toString()) };
                const txResponse = await signer.sendTransaction(tx);
                const txHash = txResponse.hash;

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
                alert(`Manual payment: Send ${cryptoValue.toFixed(6)} ETH to ${wallets.ETH}\nDM TX hash on X @YourXHandle to confirm your purchase of ${doge1Amount.toFixed(2)} $DOGE1!`);
            }
        });
    }
});
