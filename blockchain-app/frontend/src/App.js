import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import './App.css';
import WalletConnection from './components/WalletConnection';
import TransactionList from './components/TransactionList';
import Statistics from './components/Statistics';
import DonationForm from './components/DonationForm';
import DonationHistory from './components/DonationHistory';

function App() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [provider, setProvider] = useState(null);

  const BACKEND_URL = 'http://localhost:5000/api';
  const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex
  const DONATION_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Ganti dengan contract address Anda
  const DONATION_CONTRACT_ABI = [
    {
      "inputs": [
        { "internalType": "string", "name": "_message", "type": "string" },
        { "internalType": "bool", "name": "_anonymous", "type": "bool" }
      ],
      "name": "donate",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getDonations",
      "outputs": [
        {
          "components": [
            { "internalType": "uint256", "name": "id", "type": "uint256" },
            { "internalType": "address", "name": "donor", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
            { "internalType": "string", "name": "message", "type": "string" },
            { "internalType": "bool", "name": "isAnonymous", "type": "bool" }
          ],
          "internalType": "struct DonationContract.Donation[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/transactions`);
      if (response.data.success) {
        setTransactions(response.data.data);
        setError('');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions from backend');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/statistics`);
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  // Fetch donations
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/donations`);
      if (response.data.success) {
        setDonations(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install it to continue.');
      return;
    }

    try {
      setError('');
      setLoading(true);

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Check if on Sepolia network
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      if (chainId !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            setError('Sepolia network not found in MetaMask. Please add it manually.');
          } else {
            throw switchError;
          }
        }
      }

      const userAccount = accounts[0];
      setAccount(userAccount);

      // Get balance
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);

      const userBalance = await ethProvider.getBalance(userAccount);
      setBalance(ethers.formatEther(userBalance));

      // Fetch transactions and statistics
      await fetchTransactions();
      await fetchStatistics();
      await fetchDonations();

      // Listen for account changes
      window.ethereum.on('accountsChanged', (newAccounts) => {
        if (newAccounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(newAccounts[0]);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    } catch (err) {
      console.error('Error connecting to wallet:', err);
      if (err.code === -32603) {
        setError('RPC error. Please ensure MetaMask is properly configured.');
      } else if (err.code === 4001) {
        setError('You rejected the connection request.');
      } else {
        setError(err.message || 'Failed to connect wallet');
      }
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount('');
    setBalance('0');
    setProvider(null);
    setError('');
  };

  // Initial load
  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
  }, []);

  // Refresh data
  const handleRefresh = () => {
    fetchTransactions();
    fetchStatistics();
    if (account && provider) {
      provider.getBalance(account).then((bal) => {
        setBalance(ethers.formatEther(bal));
      });
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>⛓️ Blockchain Transaction Dashboard</h1>
          <p className="subtitle">View donations and transactions from smart contracts on Sepolia testnet</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {/* Error Alert */}
          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <div className="error-content">
                <strong>Error:</strong> {error}
              </div>
              <button className="error-close" onClick={() => setError('')}>✕</button>
            </div>
          )}

          {/* Wallet Connection Section */}
          <div className="wallet-section">
            <WalletConnection
              account={account}
              balance={balance}
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
              loading={loading}
            />
          </div>

          {/* Donation Form Section */}
          {account && (
            <DonationForm
              account={account}
              provider={provider}
              contractAddress={DONATION_CONTRACT_ADDRESS}
              contractABI={DONATION_CONTRACT_ABI}
              onDonationSuccess={() => {
                fetchTransactions();
                fetchStatistics();
              }}
            />
          )}

          {/* Statistics Section */}
          {statistics && (
            <Statistics statistics={statistics} />
          )}

          {/* Transactions Section */}
          <div className="transactions-section">
            <div className="section-header">
              <h2>📊 Recent Transactions</h2>
              <button 
                className="refresh-btn" 
                onClick={handleRefresh}
                disabled={loading}
              >
                {loading ? '⏳ Loading...' : '🔄 Refresh'}
              </button>
            </div>
            {account ? (
              <TransactionList 
                transactions={transactions}
                loading={loading}
              />
            ) : (
              <div className="connect-prompt">
                <p>🔒 Connect your wallet to view transactions</p>

                        {/* Donation History Section */}
                        <div className="donation-history-section">
                          <div className="section-header">
                            <h2>💝 Donation History</h2>
                            <button 
                              className="refresh-btn" 
                              onClick={() => fetchDonations()}
                              disabled={loading}
                            >
                              {loading ? '⏳ Loading...' : '🔄 Refresh'}
                            </button>
                          </div>
                          {account ? (
                            <DonationHistory 
                              donations={donations}
                              loading={loading}
                            />
                          ) : (
                            <div className="connect-prompt">
                              <p>🔒 Connect your wallet to view donation history</p>
                            </div>
                          )}
                        </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Connected to <strong>Sepolia Testnet</strong> | Built with React & Ethers.js</p>
      </footer>
    </div>
  );
}

export default App;