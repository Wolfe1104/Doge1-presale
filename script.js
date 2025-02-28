document.addEventListener("DOMContentLoaded", () => {
    const connectBtn = document.getElementById("connectBtn");
    const walletInfo = document.getElementById("walletInfo");
    const walletAddressSpan = document.getElementById("walletAddress");
    const cryptoSelect = document.getElementById("cryptoSelect");

    let provider, signer, walletAddress;

    // Original connectWallet function (MetaMask/Solana)
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
            return true; // Manual payment mode
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
    const popupMenu = document.getElementById("popupMenu");
    menuToggle.addEventListener('click', () => {
        popupMenu.classList.toggle('active');
    });
});
