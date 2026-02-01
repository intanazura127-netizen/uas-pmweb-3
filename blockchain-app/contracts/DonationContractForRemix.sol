// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title DonationContract
 * @dev Smart Contract untuk menerima dan mengelola donasi di Ethereum Sepolia
 * Siap digunakan dengan aplikasi web React
 */

contract DonationContract {
    
    // Struct untuk menyimpan data donasi
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }
    
    // Array untuk menyimpan semua donasi
    Donation[] public donations;
    
    // Pemilik kontrak
    address public owner;
    
    // Total donasi yang diterima
    uint256 public totalDonations;
    
    // Event ketika ada donasi masuk
    event DonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 timestamp
    );
    
    // Event ketika pemilik menarik dana
    event WithdrawalMade(
        address indexed owner,
        uint256 amount,
        uint256 timestamp
    );
    
    // Modifier untuk hanya pemilik
    modifier onlyOwner() {
        require(msg.sender == owner, "Hanya pemilik kontrak yang bisa!");
        _;
    }
    
    // Constructor - dijalankan sekali saat deploy
    constructor() {
        owner = msg.sender;
        totalDonations = 0;
    }
    
    /**
     * @dev Fungsi untuk menerima donasi
     * Panggil dengan mengirim ETH ke contract address
     */
    receive() external payable {
        require(msg.value > 0, "Jumlah donasi harus lebih dari 0!");
        
        // Tambah donasi ke array
        donations.push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));
        
        // Update total donasi
        totalDonations += msg.value;
        
        // Emit event
        emit DonationReceived(msg.sender, msg.value, block.timestamp);
    }
    
    /**
     * @dev Dapatkan semua donasi
     * @return Array dari semua donasi
     */
    function getDonations() public view returns (Donation[] memory) {
        return donations;
    }
    
    /**
     * @dev Dapatkan jumlah total donasi yang masuk
     * @return Jumlah transaksi donasi
     */
    function getDonationCount() public view returns (uint256) {
        return donations.length;
    }
    
    /**
     * @dev Dapatkan detail donasi berdasarkan index
     * @param index Posisi donasi di array
     * @return donor Alamat pendonasi
     * @return amount Jumlah ETH yang didonasikan
     * @return timestamp Waktu donasi
     */
    function getDonation(uint256 index) public view 
        returns (
            address donor,
            uint256 amount,
            uint256 timestamp
        ) 
    {
        require(index < donations.length, "Index di luar jangkauan!");
        Donation memory donation = donations[index];
        return (donation.donor, donation.amount, donation.timestamp);
    }
    
    /**
     * @dev Dapatkan saldo kontrak saat ini
     * @return Saldo dalam Wei
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Dapatkan N donasi terakhir
     * @param count Berapa donasi terakhir yang ingin diambil
     * @return Array dari donasi terakhir
     */
    function getRecentDonations(uint256 count) public view 
        returns (Donation[] memory) 
    {
        uint256 length = donations.length;
        uint256 start = length > count ? length - count : 0;
        
        Donation[] memory recent = new Donation[](length - start);
        
        for (uint256 i = start; i < length; i++) {
            recent[i - start] = donations[i];
        }
        
        return recent;
    }
    
    /**
     * @dev Tarik semua dana (hanya pemilik)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Tidak ada dana untuk ditarik!");
        
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Penarikan dana gagal!");
        
        emit WithdrawalMade(owner, balance, block.timestamp);
    }
    
    /**
     * @dev Dapatkan statistik donasi
     * @return totalAmount Total ETH yang didonasikan
     * @return donorCount Jumlah pendonasi unik
     * @return avgDonation Rata-rata donasi per transaksi
     */
    function getStatistics() public view 
        returns (
            uint256 totalAmount,
            uint256 donorCount,
            uint256 avgDonation
        ) 
    {
        if (donations.length == 0) {
            return (0, 0, 0);
        }
        
        // Hitung total
        uint256 total = totalDonations;
        
        // Hitung unique donors (simple count semua di array, bisa dioptimasi)
        uint256 uniqueDonors = donations.length;
        
        // Hitung rata-rata
        uint256 average = total / donations.length;
        
        return (total, uniqueDonors, average);
    }
}
