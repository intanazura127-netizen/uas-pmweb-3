import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import './App.css';
import WalletConnection from './components/WalletConnection';
import TransactionList from './components/TransactionList';
import Statistics from './components/Statistics';

// ⚠️ GANTI INI DENGAN ADDRESS CONTRACT DARI REMIX!
const CONTRACT_ADDRESS = '0x...';

// Contract ABI
const CONTRACT_ABI = [
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
    "name": "getStatistics",
    "outputs": [
      { "internalType": "uint256", "name": "totalAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "donorCount", "type": "uint256" },
      { "internalType": "uint256", "name": "avgDonation", "type": "uint256" }
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
  }
];

function App() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [provider, setProvider] = useState(null);
  const [useBlockchain, setUseBlockchain] = useState(true); // Toggle blockchain/backend

  const BACKEND_URL = 'http://localhost:5000/api';
  const SEPOLIA_CHAIN_ID = '0xaa36a7';

  // ==========================================
  // BACA DATA DARI SMART CONTRACT LANGSUNG
  // ==========================================
  const fetchTransactionsFromBlockchain = async (ethProvider) => {
    setLoading(true);
    try {
      if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x...') {
        throw new Error('⚠️ Contract address belum diset! Ganti di App.js');
      }

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        ethProvider
      );

      const donations = await contract.getDonations();
      
      // Format data
      const formattedDonations = donations.map((d, index) => ({
        id: index + 1,
        donor: d.donor,
        amount: ethers.formatEther(d.amount),
        timestamp: new Date(Number(d.timestamp) * 1000).getTime(),
        txHash: `0x${Math.random().toString(16).slice(2)}`, // Dummy hash
        status: 'confirmed'
      }));

      setTransactions(formattedDonations);
      setError('');
    } catch (err) {
      console.error('Error fetching from blockchain:', err);
      setError(`Blockchain error: ${err.message}`);
      // Fallback ke backend
      fetchTransactionsFromBackend();
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // BACA STATISTIK DARI SMART CONTRACT
  // ==========================================
  const fetchStatisticsFromBlockchain = async (ethProvider) => {
    try {
      if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x...') {
        return;
      }

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        ethProvider
      );

      const stats = await contract.getStatistics();
      
      setStatistics({
        totalDonations: ethers.formatEther(stats.totalAmount),
        donorCount: stats.donorCount.toString(),
        transactionCount: stats.donorCount.toString(),
        avgDonation: ethers.formatEther(stats.avgDonation)
      });
    } catch (err) {
      console.error('Error fetching statistics from blockchain:', err);
      // Fallback ke backend
      fetchStatisticsFromBackend();
    }
  };

  // ==========================================
  // FALLBACK: BACA DARI BACKEND
  // ==========================================
  const fetchTransactionsFromBackend = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/transactions`);
      if (response.data.success) {
        setTransactions(response.data.data);
        setError('');
      }
    } catch (err) {
      console.error('Error fetching from backend:', err);
      setError('Gagal load transaksi');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatisticsFromBackend = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/statistics`);
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  // Wrapper - pilih blockchain atau backend
  const fetchTransactions = async (ethProvider) => {
    if (useBlockchain && ethProvider && CONTRACT_ADDRESS !== '0x...') {
      await fetchTransactionsFromBlockchain(ethProvider);
    } else {
      await fetchTransactionsFromBackend();
    }
  };

  const fetchStatistics = async (ethProvider) => {
    if (useBlockchain && ethProvider && CONTRACT_ADDRESS !== '0x...') {
      await fetchStatisticsFromBlockchain(ethProvider);
    } else {
      await fetchStatisticsFromBackend();
    }
  };

  // ==========================================
  // CONNECT WALLET
  // ==========================================
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask belum terinstall!');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

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
            setError('Tambahkan Sepolia network di MetaMask');
          } else {
            throw switchError;
          }
        }
      }

      const userAccount = accounts[0];
      setAccount(userAccount);

      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);

      const userBalance = await ethProvider.getBalance(userAccount);
      setBalance(ethers.formatEther(userBalance));

      // Fetch data
      await fetchTransactions(ethProvider);
      await fetchStatistics(ethProvider);

      window.ethereum.on('accountsChanged', (newAccounts) => {
        if (newAccounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(newAccounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    } catch (err) {
      console.error('Error:', err);
      if (err.code === 4001) {
        setError('Koneksi ditolak');
      } else {
        setError(err.message || 'Gagal connect wallet');
      }
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setBalance('0');
    setProvider(null);
    setError('');
  };

  useEffect(() => {
    fetchTransactionsFromBackend();
    fetchStatisticsFromBackend();
  }, []);

  const handleRefresh = () => {
    if (account && provider) {
      fetchTransactions(provider);
      fetchStatistics(provider);
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
          <p className="subtitle">
            {useBlockchain ? '📊 Data dari Smart Contract' : '📡 Data dari Backend'}
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <div className="error-content">
                <strong>Error:</strong> {error}
              </div>
              <button className="error-close" onClick={() => setError('')}>✕</button>
            </div>
          )}

          <div className="wallet-section">
            <WalletConnection
              account={account}
              balance={balance}
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
              loading={loading}
            />
          </div>

          {/* Toggle Blockchain/Backend */}
          {account && (
            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={useBlockchain}
                  onChange={(e) => {
                    setUseBlockchain(e.target.checked);
                    if (provider) {
                      if (e.target.checked) {
                        fetchTransactionsFromBlockchain(provider);
                        fetchStatisticsFromBlockchain(provider);
                      } else {
                        fetchTransactionsFromBackend();
                        fetchStatisticsFromBackend();
                      }
                    }
                  }}
                  style={{ marginRight: '0.5rem' }}
                />
                📊 Baca dari Smart Contract (Sepolia)
              </label>
              {!useBlockchain && (
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                  💡 Jika ingin baca dari blockchain, deploy contract terlebih dahulu
                </p>
              )}
            </div>
          )}

          {statistics && (
            <Statistics statistics={statistics} />
          )}

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
                <p>🔒 Connect wallet untuk lihat transaksi</p>
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
