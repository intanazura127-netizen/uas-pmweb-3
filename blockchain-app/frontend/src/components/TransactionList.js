import React from 'react';
import './TransactionList.css';

function TransactionList({ transactions, loading }) {
  const truncateHash = (hash) => {
    if (!hash) return '';
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(4);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 No transactions found</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      {/* Desktop View - Table */}
      <div className="table-wrapper">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Donor Address</th>
              <th>Amount (ETH)</th>
              <th>Date & Time</th>
              <th>Transaction Hash</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="transaction-row">
                <td className="id-cell">{tx.id}</td>
                <td className="address-cell">
                  <span className="address-full">{tx.donor}</span>
                  <span className="address-short">{truncateAddress(tx.donor)}</span>
                </td>
                <td className="amount-cell">
                  <strong>{formatAmount(tx.amount)}</strong> ETH
                </td>
                <td className="date-cell">{formatDate(tx.timestamp)}</td>
                <td className="hash-cell">
                  <a
                    href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hash-link"
                  >
                    {truncateHash(tx.txHash)}
                  </a>
                </td>
                <td className="status-cell">
                  <span className={`status-badge status-${tx.status}`}>
                    {tx.status === 'confirmed' ? '✓' : '⏳'} {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Cards */}
      <div className="mobile-cards">
        {transactions.map((tx) => (
          <div key={tx.id} className="transaction-card">
            <div className="card-header">
              <span className="card-id">Transaction #{tx.id}</span>
              <span className={`status-badge status-${tx.status}`}>
                {tx.status === 'confirmed' ? '✓' : '⏳'} {tx.status}
              </span>
            </div>
            <div className="card-content">
              <div className="card-row">
                <label>Donor:</label>
                <span className="address-short">{truncateAddress(tx.donor)}</span>
              </div>
              <div className="card-row">
                <label>Amount:</label>
                <span className="amount-value">{formatAmount(tx.amount)} ETH</span>
              </div>
              <div className="card-row">
                <label>Date:</label>
                <span>{formatDate(tx.timestamp)}</span>
              </div>
              <div className="card-row">
                <label>Hash:</label>
                <a
                  href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hash-link"
                >
                  {truncateHash(tx.txHash)}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;
