// ==========================================
// KODE UNTUK INTEGRASI SMART CONTRACT
// Copy-paste ke App.js jika perlu integrasi lebih lanjut
// ==========================================

import { ethers } from 'ethers';

// CONTRACT CONFIG
const CONTRACT_ADDRESS = '0x...'; // GANTI DENGAN ADDRESS DARI REMIX
const CONTRACT_ABI = [
  // View Functions
  {
    "inputs": [],
    "name": "getDonations",
    "outputs": [
      {
        "components": [
          { "name": "donor", "type": "address" },
          { "name": "amount", "type": "uint256" },
          { "name": "timestamp", "type": "uint256" }
        ],
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDonationCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }],
    "name": "getDonation",
    "outputs": [
      { "internalType": "address", "name": "donor", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "count", "type": "uint256" }],
    "name": "getRecentDonations",
    "outputs": [
      {
        "components": [
          { "name": "donor", "type": "address" },
          { "name": "amount", "type": "uint256" },
          { "name": "timestamp", "type": "uint256" }
        ],
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getStatistics",
    "outputs": [
      { "internalType": "uint256", "name": "totalAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "donorCount", "type": "uint256" },
      { "internalType": "uint256", "name": "avgDonation", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // State-changing functions
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// ==========================================
// FUNGSI-FUNGSI HELPER
// ==========================================

/**
 * Dapatkan contract instance
 */
export const getContractInstance = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask tidak terinstall');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      provider
    );

    return contract;
  } catch (error) {
    console.error('Error getting contract:', error);
    throw error;
  }
};

/**
 * Baca donasi dari blockchain
 */
export const readDonationsFromBlockchain = async () => {
  try {
    const contract = await getContractInstance();
    const donations = await contract.getDonations();
    
    // Format untuk ditampilkan
    return donations.map((d) => ({
      donor: d.donor,
      amount: ethers.formatEther(d.amount),
      timestamp: new Date(Number(d.timestamp) * 1000).toLocaleString(),
    }));
  } catch (error) {
    console.error('Error reading donations:', error);
    throw error;
  }
};

/**
 * Baca statistik dari blockchain
 */
export const readStatisticsFromBlockchain = async () => {
  try {
    const contract = await getContractInstance();
    const stats = await contract.getStatistics();
    
    return {
      totalDonations: ethers.formatEther(stats.totalAmount),
      donorCount: stats.donorCount.toString(),
      avgDonation: ethers.formatEther(stats.avgDonation),
      transactionCount: stats.donorCount.toString(),
    };
  } catch (error) {
    console.error('Error reading statistics:', error);
    throw error;
  }
};

/**
 * Baca saldo kontrak
 */
export const readContractBalance = async () => {
  try {
    const contract = await getContractInstance();
    const balance = await contract.getBalance();
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error reading balance:', error);
    throw error;
  }
};

/**
 * Kirim donasi ke kontrak
 */
export const sendDonationToContract = async (amountInETH) => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask tidak terinstall');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Konversi ETH ke Wei
    const amountInWei = ethers.parseEther(amountInETH.toString());

    // Kirim transaksi
    const tx = await signer.sendTransaction({
      to: CONTRACT_ADDRESS,
      value: amountInWei,
    });

    // Tunggu konfirmasi
    const receipt = await tx.wait();
    
    console.log('Donasi berhasil! Hash:', receipt.transactionHash);
    return receipt.transactionHash;
  } catch (error) {
    console.error('Error sending donation:', error);
    throw error;
  }
};

/**
 * Listen ke event DonationReceived
 */
export const listenToDonationEvents = (callback) => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask tidak terinstall');
    }

    const provider = new ethers.WebSocketProvider(
      'wss://sepolia.infura.io/ws/v3/9aa3d95b3bc440fa88ea12eaa4456161'
    );
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      provider
    );

    // Listen ke event
    contract.on('DonationReceived', (donor, amount, timestamp) => {
      callback({
        donor,
        amount: ethers.formatEther(amount),
        timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
      });
    });

    console.log('Listening to donation events...');
  } catch (error) {
    console.error('Error listening to events:', error);
  }
};

// ==========================================
// CONTOH PENGGUNAAN DI COMPONENT
// ==========================================

/*
import {
  readDonationsFromBlockchain,
  readStatisticsFromBlockchain,
  sendDonationToContract,
  listenToDonationEvents,
} from './blockchainFunctions';

// Di useEffect
useEffect(() => {
  const fetchData = async () => {
    try {
      // Baca donasi dari blockchain
      const donations = await readDonationsFromBlockchain();
      setTransactions(donations);

      // Baca statistik
      const stats = await readStatisticsFromBlockchain();
      setStatistics(stats);

      // Listen ke event baru
      listenToDonationEvents((newDonation) => {
        console.log('Donasi baru:', newDonation);
        setTransactions((prev) => [newDonation, ...prev]);
      });
    } catch (error) {
      setError(error.message);
    }
  };

  if (account) {
    fetchData();
  }
}, [account]);

// Untuk mengirim donasi
const handleDonate = async (amount) => {
  try {
    const txHash = await sendDonationToContract(amount);
    alert('Donasi berhasil! Hash: ' + txHash);
    
    // Refresh data
    const donations = await readDonationsFromBlockchain();
    setTransactions(donations);
  } catch (error) {
    setError(error.message);
  }
};
*/

// ==========================================
// STEP-BY-STEP SETUP
// ==========================================

/*
1. DEPLOY DI REMIX:
   - Buka https://remix.ethereum.org
   - Copy kode DonationContractForRemix.sol
   - Compile & Deploy ke Sepolia
   - Copy address dari hasil deploy

2. UPDATE CONTRACT_ADDRESS:
   const CONTRACT_ADDRESS = '0x...'; // PASTE ADDRESS DARI REMIX

3. IMPORT DI APP.JS:
   import {
     readDonationsFromBlockchain,
     readStatisticsFromBlockchain,
   } from './blockchainFunctions';

4. GUNAKAN DI COMPONENT:
   useEffect(() => {
     const donations = await readDonationsFromBlockchain();
     setTransactions(donations);
   }, []);

5. TEST:
   - Buka http://localhost:3000
   - Connect MetaMask
   - Lihat donasi dari blockchain
*/
