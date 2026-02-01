const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Constants
const SEPOLIA_RPC_URL = 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
const DONATION_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Example
const DONATION_CONTRACT_ABI = [
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
  }
];

// Initialize provider
const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);

// Dummy donation history (dalam production, gunakan database)
let donationHistory = [
  {
    id: 1,
    donor: "0x742d35Cc6634C0532925a3b844Bc9e7595f42e44",
    amount: "1.5",
    timestamp: Date.now() - 3600000,
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    message: "Untuk pendidikan anak bangsa",
    isAnonymous: false,
    status: "confirmed"
  },
  {
    id: 2,
    donor: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    amount: "2.0",
    timestamp: Date.now() - 7200000,
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    message: "Donasi untuk sesama",
    isAnonymous: false,
    status: "confirmed"
  }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Get transactions endpoint
app.get('/api/transactions', async (req, res) => {
  try {
    res.json({
      success: true,
      data: donationHistory,
      count: donationHistory.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions',
      message: error.message
    });
  }
});

// Create new donation
app.post('/api/donations', async (req, res) => {
  try {
    const { donor, amount, txHash, message, isAnonymous } = req.body;

    // Validasi input
    if (!donor || !amount || !txHash) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: donor, amount, txHash'
      });
    }

    const donation = {
      id: donationHistory.length + 1,
      donor: isAnonymous ? "Anonymous" : donor,
      amount: amount.toString(),
      timestamp: Date.now(),
      txHash: txHash,
      message: message || "",
      isAnonymous: isAnonymous || false,
      status: "confirmed"
    };

    donationHistory.push(donation);

    res.json({
      success: true,
      data: donation,
      message: 'Donation recorded successfully'
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create donation',
      message: error.message
    });
  }
});

// Get donation history for specific address
// Get all donations
app.get('/api/donations', async (req, res) => {
  try {
    res.json({
      success: true,
      data: donationHistory,
      count: donationHistory.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch donations',
      message: error.message
    });
  }
});

app.get('/api/donations/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const donations = donationHistory.filter(d => 
      d.donor.toLowerCase() === address.toLowerCase()
    );

    res.json({
      success: true,
      data: donations,
      count: donations.length
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch donations',
      message: error.message
    });
  }
});

// Get contract statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const totalDonations = donationHistory.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    const donorCount = new Set(donationHistory.map(tx => tx.donor)).size;

    res.json({
      success: true,
      data: {
        totalDonations: totalDonations.toFixed(2),
        donorCount,
        transactionCount: donationHistory.length,
        avgDonation: (totalDonations / donationHistory.length).toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/transactions`);
});
