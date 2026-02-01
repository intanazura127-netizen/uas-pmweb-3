import React from 'react';
import './DonationHistory.css';

function DonationHistory({ donations, loading }) {
  const truncateAddress = (address) => {
    if (!address || address === 'Anonymous') return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('id-ID');
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(4);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading riwayat donasi...</p>
      </div>
    );
  }

  if (!donations || donations.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 Belum ada donasi</p>
      </div>
    );
  }

  return (
    <div className="donation-history">
      <h2>📜 Riwayat Donasi</h2>

      {/* Desktop View - Table */}
      <div className="table-wrapper">
        <table className="donations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pendonasi</th>
              <th>Jumlah (ETH)</th>
              <th>Tanggal & Waktu</th>
              <th>Pesan</th>
              <th>TX Hash</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id} className="donation-row">
                <td className="id-cell">#{donation.id}</td>
                <td className="address-cell">
                  <span className="address-full" title={donation.donor}>{donation.donor}</span>
                  <span className="address-short">{truncateAddress(donation.donor)}</span>
                </td>
                <td className="amount-cell">
                  <strong>{formatAmount(donation.amount)}</strong> ETH
                </td>
                <td className="date-cell">{formatDate(donation.timestamp)}</td>
                <td className="message-cell">
                  {donation.message ? (
                    <span className="message-text">{donation.message}</span>
                  ) : (
                    <span className="no-message">-</span>
                  )}
                </td>
                <td className="hash-cell">
                  <a
                    href={`https://sepolia.etherscan.io/tx/${donation.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hash-link"
                    title={donation.txHash}
                  >
                    {donation.txHash.substring(0, 10)}...
                  </a>
                </td>
                <td className="status-cell">
                  <span className={`status-badge status-${donation.status}`}>
                    ✓ {donation.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Cards */}
      <div className="mobile-cards">
        {donations.map((donation) => (
          <div key={donation.id} className="donation-card">
            <div className="card-header">
              <span className="card-id">Donasi #{donation.id}</span>
              <span className={`status-badge status-${donation.status}`}>
                ✓ {donation.status}
              </span>
            </div>
            <div className="card-content">
              <div className="card-row">
                <label>Pendonasi:</label>
                <span className="address-short" title={donation.donor}>
                  {truncateAddress(donation.donor)}
                </span>
              </div>
              <div className="card-row">
                <label>Jumlah:</label>
                <span className="amount-value">{formatAmount(donation.amount)} ETH</span>
              </div>
              <div className="card-row">
                <label>Waktu:</label>
                <span>{formatDate(donation.timestamp)}</span>
              </div>
              {donation.message && (
                <div className="card-row">
                  <label>Pesan:</label>
                  <span className="message-text">{donation.message}</span>
                </div>
              )}
              <div className="card-row">
                <label>TX:</label>
                <a
                  href={`https://sepolia.etherscan.io/tx/${donation.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hash-link"
                >
                  Lihat di Etherscan
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="total-info">
        <p>Total donasi tercatat: <strong>{donations.length}</strong></p>
      </div>
    </div>
  );
}

export default DonationHistory;
