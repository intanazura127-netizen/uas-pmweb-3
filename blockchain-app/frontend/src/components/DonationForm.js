import React, { useState } from 'react';
import { ethers } from 'ethers';
import './DonationForm.css';

function DonationForm({ account, provider, contractAddress, contractABI, onDonationSuccess }) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!account) {
      setError('Hubungkan wallet Anda terlebih dahulu');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Masukkan jumlah donasi yang valid (> 0)');
      return;
    }

    if (parseFloat(amount) < 0.001) {
      setError('Minimum donasi adalah 0.001 ETH');
      return;
    }

    try {
      setLoading(true);

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Send donation
      const donationAmount = ethers.parseEther(amount);
      const tx = await contract.donate(message, isAnonymous, { value: donationAmount });

      setSuccess('Mengirim transaksi... harap tunggu');

      const receipt = await tx.wait();

      if (receipt) {
        setSuccess('✅ Donasi berhasil! Terima kasih telah berkontribusi');
        setAmount('');
        setMessage('');
        setIsAnonymous(false);

        // Notify parent component
        if (onDonationSuccess) {
          onDonationSuccess({
            donor: account,
            amount,
            message,
            isAnonymous,
            txHash: receipt.transactionHash
          });
        }

        // Tutup notifikasi success setelah 5 detik
        setTimeout(() => setSuccess(''), 5000);
      }
    } catch (err) {
      console.error('Donation error:', err);
      if (err.reason) {
        setError(err.reason);
      } else if (err.message.includes('user rejected')) {
        setError('Transaksi dibatalkan oleh pengguna');
      } else {
        setError('Gagal mengirim donasi: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donation-form-container">
      <div className="donation-form">
        <h2>💝 Buat Donasi</h2>

        {error && (
          <div className="alert alert-error">
            <span>❌</span>
            <div>
              <strong>Error:</strong> {error}
            </div>
            <button onClick={() => setError('')}>✕</button>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>✅</span>
            <div>
              <strong>Sukses!</strong> {success}
            </div>
            <button onClick={() => setSuccess('')}>✕</button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Jumlah Donasi (ETH) *</label>
            <div className="input-with-button">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Contoh: 0.5"
                step="0.001"
                min="0.001"
                disabled={loading || !account}
                required
              />
              <span className="eth-label">ETH</span>
            </div>
            <small>Minimum: 0.001 ETH</small>
          </div>

          <div className="form-group">
            <label htmlFor="message">Pesan Donasi (Opsional)</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan pesan atau niat donasi Anda..."
              rows="3"
              maxLength="200"
              disabled={loading || !account}
            />
            <small>{message.length}/200 karakter</small>
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              disabled={loading || !account}
            />
            <label htmlFor="anonymous">
              🔒 Donasi secara anonim
            </label>
          </div>

          <button
            type="submit"
            className="donate-btn"
            disabled={loading || !account}
          >
            {loading ? '⏳ Sedang Memproses...' : '💳 Kirim Donasi'}
          </button>

          {!account && (
            <p className="connect-reminder">🔗 Hubungkan wallet Anda terlebih dahulu untuk melakukan donasi</p>
          )}
        </form>

        <div className="donation-info">
          <h3>ℹ️ Informasi</h3>
          <ul>
            <li>Donasi Anda akan disimpan di smart contract Ethereum</li>
            <li>Minimum donasi adalah 0.001 ETH</li>
            <li>Anda dapat memberi pesan dengan donasi Anda</li>
            <li>Pilih anonim untuk menyembunyikan alamat Anda</li>
            <li>Semua donasi dapat diverifikasi di Etherscan</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DonationForm;
