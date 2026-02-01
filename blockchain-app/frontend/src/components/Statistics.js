import React from 'react';
import './Statistics.css';

function Statistics({ statistics }) {
  if (!statistics) {
    return null;
  }

  return (
    <div className="statistics-section">
      <h2>📈 Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Donations</h3>
            <p className="stat-value">{statistics.totalDonations} ETH</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Donors</h3>
            <p className="stat-value">{statistics.donorCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Transactions</h3>
            <p className="stat-value">{statistics.transactionCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-content">
            <h3>Avg Donation</h3>
            <p className="stat-value">{statistics.avgDonation} ETH</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
