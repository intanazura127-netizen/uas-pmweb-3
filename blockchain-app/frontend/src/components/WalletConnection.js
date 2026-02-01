import React from 'react';
import './WalletConnection.css';

function WalletConnection({ account, balance, onConnect, onDisconnect, loading }) {
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="wallet-connection">
      <div className="wallet-header">
        <h2>👛 Wallet Connection</h2>
        <span className="network-badge">Sepolia Testnet</span>
      </div>

      {account ? (
        <div className="wallet-connected">
          <div className="wallet-info-grid">
            <div className="wallet-info-item">
              <label>Connected Address</label>
              <div className="wallet-address">
                <span className="address-full">{account}</span>
                <span className="address-short">{truncateAddress(account)}</span>
              </div>
            </div>
            <div className="wallet-info-item">
              <label>Wallet Balance</label>
              <div className="wallet-balance">
                <span className="balance-value">{parseFloat(balance).toFixed(4)}</span>
                <span className="balance-unit">ETH</span>
              </div>
            </div>
          </div>
          <button
            className="disconnect-btn"
            onClick={onDisconnect}
            disabled={loading}
          >
            🔓 Disconnect Wallet
          </button>
        </div>
      ) : (
        <div className="wallet-disconnected">
          <p>No wallet connected yet</p>
          <button
            className="connect-btn"
            onClick={onConnect}
            disabled={loading}
          >
            {loading ? '⏳ Connecting...' : '🔗 Connect MetaMask'}
          </button>
        </div>
      )}
    </div>
  );
}

export default WalletConnection;
