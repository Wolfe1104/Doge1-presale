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

    // Web3Modal Setup
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: "YOUR_INFURA_ID" // Replace with your Infura ID
            }
        }
    };

    const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions
    });

    // Connect Wallet Function
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

    // Wallet Connection Handler
    connectBtn.addEventListener("click", async () => {
        const crypto = cryptoSelect.value;
        if (await connectWallet(crypto)) {
            walletAddressSpan.textContent = walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
            walletInfo.style.display = "block";
            connectBtn.style.display = "none";
        }
    });

    // Buy Button Handler
    buyBtn.addEventListener("click", async () => {
        const crypto = cryptoSelect.value;
        const amount = parseFloat(amountInput.value);
        if (!amount || amount <= 0) {
            alert("Enter a valid amount!");
            return;
        }

        if (await connectWallet(crypto)) {
            let txHash;
            if (crypto === "ETH") {
                const tx = { to: wallets.ETH, value: ethers.parseEther(amount.toString()) };
                const txResponse = await signer.sendTransaction(tx);
                txHash = txResponse.hash;
            } else if (crypto === "USDT") {
                const usdtContract = new ethers.Contract(
                    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
                    ["function transfer(address to, uint256 value)"],
                    signer
                );
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
                const { signature } = await window.solana.signAndSendTransaction(transaction);
                txHash = signature;
            } else {
                alert(`Send ${amount} ${crypto} to: ${wallets[crypto]}\nDM TX hash on X @YourXHandle!`);
                return;
            }
            alert(`Success! TX: ${txHash}\nDM TX hash + Polygon address on X @YourXHandle!`);
            amountInput.value = "";
        }
    });

    // Buy Now Modal Handler (simplified for brevity)
    buyNowBtn.addEventListener("click", () => {
        buyModal.style.display = "block";
    });

    purchaseBtn.addEventListener("click", async () => {
        const usd = parseFloat(usdInput.value) || 0;
        const crypto = cryptoDropdown.value;
        const cryptoValue = usd / cryptoRates[crypto];
        if (await connectWallet(crypto)) {
            // Similar transaction logic as above
            alert(`Purchase initiated for ${cryptoValue} ${crypto}. Check wallet for confirmation.`);
            buyModal.style.display = "none";
        }
    });

    // Remaining logic (charts, slider, etc.) unchanged for brevity
});
