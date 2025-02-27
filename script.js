document.addEventListener("DOMContentLoaded", () => {
    const connectBtn = document.getElementById("connectBtn");
    const buyBtn = document.getElementById("buyBtn");
    const walletInfo = document.getElementById("walletInfo");
    const walletAddressSpan = document.getElementById("walletAddress");
    const cryptoSelect = document.getElementById("cryptoSelect");
    const amountInput = document.getElementById("amountInput");

    const wallets = {
        ETH: "0xYourEthereumWalletHere",
        SOL: "YourSolanaWalletHere",
        BTC: "YourBitcoinWalletHere",
        USDT: "0xYourPolygonWalletHere",
        DOGE: "YourDogecoinWalletHere"
    };

    let provider, signer, walletAddress;

    connectBtn.addEventListener("click", async () => {
        const crypto = cryptoSelect.value;
        if (crypto === "ETH" || crypto === "USDT") {
            if (typeof window.ethereum !== "undefined") {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                signer = provider.getSigner();
                walletAddress = await signer.getAddress();
            } else {
                alert("Install MetaMask or Trust Wallet!");
                return;
            }
        } else if (crypto === "SOL" && window.solana) {
            await window.solana.connect();
            walletAddress = window.solana.publicKey.toString();
        } else {
            walletAddress = "Manual_" + crypto;
        }
        walletAddressSpan.textContent = walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
        walletInfo.style.display = "block";
        connectBtn.style.display = "none";
    });

    buyBtn.addEventListener("click", async () => {
        const crypto = cryptoSelect.value;
        const amount = parseFloat(amountInput.value);
        if (!amount || amount <= 0) { alert("Enter a valid amount!"); return; }

        let txHash;
        if (crypto === "ETH") {
            const tx = { to: wallets.ETH, value: ethers.utils.parseEther(amount.toString()) };
            const txResponse = await signer.sendTransaction(tx);
            txHash = txResponse.hash;
        } else if (crypto === "USDT") {
            const usdtContract = new ethers.Contract("0xc2132D05D31c914a87C6611C10748AEb04B58e8F", ["function transfer(address to, uint256 value)"], signer);
            const txResponse = await usdtContract.transfer(wallets.USDT, ethers.utils.parseUnits(amount.toString(), 6));
            txHash = txResponse.hash;
        } else if (crypto === "SOL") {
            const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"));
            const transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: window.solana.publicKey,
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
    });

    // Slider Reset for Seamless Loop
    const phaseSlider = document.querySelector('.phase-slider');
    phaseSlider.addEventListener('animationiteration', () => {
        phaseSlider.style.transition = 'none';
        phaseSlider.style.transform = 'translateX(0)';
        setTimeout(() => {
            phaseSlider.style.transition = 'transform 0s linear';
        }, 50);
    });

    // Tokenomics Pie Chart with Development and Marketing
    const chartCanvas = document.getElementById('tokenPieChart');
    if (!chartCanvas) {
        console.error("Pie chart canvas not found!");
        return;
    }
    const ctx = chartCanvas.getContext('2d');
    if (!ctx) {
        console.error("Failed to get 2D context for pie chart!");
        return;
    }

    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                'Presale (40%)',
                'Burned (10%)',
                'Liquidity (24%)',
                'Team (10%)',
                'Development (10%)',
                'Marketing (6%)'
            ],
            datasets: [{
                data: [200, 50, 120, 50, 50, 30], // Matches tokenomics list
                backgroundColor: ['#00ffcc', '#ff3366', '#33ccff', '#ffcc33', '#9966ff', '#ff6699'],
                borderColor: '#000',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right', // Move to right for better visibility
                    labels: {
                        color: '#fff',
                        font: { size: 12 }, // Smaller font to fit
                        boxWidth: 20, // Smaller color boxes
                        padding: 10, // Space between items
                        generateLabels: (chart) => {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: label,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                hidden: !chart.getDataVisibility(i),
                                index: i
                            }));
                        }
                    }
                }
            }
        }
    });
});
