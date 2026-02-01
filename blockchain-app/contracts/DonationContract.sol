// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title DonationContract
 * @dev Advanced donation contract for Ethereum Sepolia testnet with tracking
 */
contract DonationContract {
    
    struct Donation {
        uint256 id;
        address donor;
        uint256 amount;
        uint256 timestamp;
        string message;
        bool isAnonymous;
    }
    
    Donation[] public donations;
    mapping(address => uint256[]) public donorHistory;
    mapping(address => uint256) public donorTotalAmount;
    mapping(address => uint256) public donorCount;
    
    address public owner;
    uint256 public totalDonations;
    uint256 public totalDonationCount;
    uint256 private donationCounter;
    
    event DonationReceived(
        uint256 indexed donationId,
        address indexed donor,
        uint256 amount,
        uint256 timestamp,
        string message
    );
    
    event WithdrawalMade(
        address indexed owner,
        uint256 amount,
        uint256 timestamp
    );
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        totalDonations = 0;
        totalDonationCount = 0;
        donationCounter = 0;
    }
    
    /**
     * @dev Accept donations with optional message
     */
    function donate(string memory _message, bool _anonymous) public payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        require(msg.value >= 0.001 ether, "Minimum donation is 0.001 ETH");
        
        donationCounter++;
        
        Donation memory newDonation = Donation({
            id: donationCounter,
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message,
            isAnonymous: _anonymous
        });
        
        donations.push(newDonation);
        donorHistory[msg.sender].push(donationCounter - 1);
        donorTotalAmount[msg.sender] += msg.value;
        donorCount[msg.sender]++;
        totalDonations += msg.value;
        totalDonationCount++;
        
        emit DonationReceived(donationCounter, msg.sender, msg.value, block.timestamp, _message);
    }
    
    /**
     * @dev Alternative receive function (no message, not anonymous)
     */
    receive() external payable {
        donate("", false);
    }
    
    /**
     * @dev Get all donations
     */
    function getDonations() public view returns (Donation[] memory) {
        return donations;
    }
    
    /**
     * @dev Get donation count
     */
    function getDonationCount() public view returns (uint256) {
        return donations.length;
    }
    
    /**
     * @dev Get specific donation
     */
    function getDonation(uint256 index) public view returns (
        address donor,
        uint256 amount,
        uint256 timestamp
    ) {
        require(index < donations.length, "Index out of bounds");
        Donation memory donation = donations[index];
        return (donation.donor, donation.amount, donation.timestamp);
    }
    
    /**
     * @dev Get contract balance
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Withdraw donations (owner only)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit WithdrawalMade(owner, balance, block.timestamp);
    }
    
    /**
     * @dev Get recent donations with limit
     */
    function getRecentDonations(uint256 count) public view returns (Donation[] memory) {
        uint256 length = donations.length;
        uint256 start = length > count ? length - count : 0;
        
        Donation[] memory recent = new Donation[](length - start);
        
        for (uint256 i = start; i < length; i++) {
            recent[i - start] = donations[i];
        }
        
        return recent;
    }
    
    /**
     * @dev Get donor's donation history
     */
    function getDonorHistory(address _donor) public view returns (Donation[] memory) {
        uint256[] memory historyIndices = donorHistory[_donor];
        Donation[] memory history = new Donation[](historyIndices.length);
        
        for (uint256 i = 0; i < historyIndices.length; i++) {
            history[i] = donations[historyIndices[i]];
        }
        
        return history;
    }
    
    /**
     * @dev Get donor statistics
     */
    function getDonorStats(address _donor) public view returns (
        uint256 totalAmount,
        uint256 donationCount,
        uint256 averageAmount
    ) {
        totalAmount = donorTotalAmount[_donor];
        donationCount = donorCount[_donor];
        averageAmount = donationCount > 0 ? totalAmount / donationCount : 0;
    }
    
    /**
     * @dev Get top donors
     */
    function getTopDonors(uint256 limit) public view returns (address[] memory, uint256[] memory) {
        address[] memory topDonors = new address[](limit);
        uint256[] memory amounts = new uint256[](limit);
        
        for (uint256 i = 0; i < donations.length && i < limit; i++) {
            topDonors[i] = donations[i].donor;
            amounts[i] = donations[i].amount;
        }
        
        return (topDonors, amounts);
    }
    
    /**
     * @dev Get contract statistics
     */
    function getStatistics() public view returns (
        uint256 totalAmount,
        uint256 totalCount,
        uint256 contractBalance,
        uint256 averageAmount
    ) {
        totalAmount = totalDonations;
        totalCount = totalDonationCount;
        contractBalance = address(this).balance;
        averageAmount = totalCount > 0 ? totalAmount / totalCount : 0;
    }
}
