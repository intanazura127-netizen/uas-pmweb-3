# 🔗 Blockchain Transaction Dashboard
# NAMA : INTAN AZHURA BAHRAEN
# NIM : 24111094
# KELAS : INFORMATIKA C

A full-stack web application for displaying blockchain transactions from smart contracts on the Ethereum Sepolia testnet. Features MetaMask wallet integration, responsive UI, and a RESTful backend API.

## 📋 Features

- ✅ **MetaMask Integration**: Connect wallet with automatic network detection
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile devices
- ✅ **Transaction Display**: View transactions in table (desktop) or card (mobile) format
- ✅ **Wallet Information**: Display connected address and ETH balance
- ✅ **Statistics Dashboard**: Real-time donation statistics
- ✅ **Error Handling**: Comprehensive error messages for connection failures
- ✅ **RESTful API**: Backend endpoints for transaction data
- ✅ **Smart Contract Integration**: Read data from Sepolia testnet smart contracts
- ✅ **Ethers.js**: Modern Ethereum library for blockchain interaction

## 🏗️ Project Structure

```
blockchain-app/
├── backend/                 # Node.js/Express backend
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── .env.example        # Environment variables template
│   └── .gitignore
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.js         # Main application component
│   │   ├── App.css        # App styles
│   │   ├── index.js       # Entry point
│   │   ├── index.css      # Global styles
│   │   └── components/    # Reusable components
│   │       ├── WalletConnection.js
│   │       ├── WalletConnection.css
│   │       ├── TransactionList.js
│   │       ├── TransactionList.css
│   │       ├── Statistics.js
│   │       └── Statistics.css
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── package.json       # Frontend dependencies
│   └── .gitignore
├── contracts/             # Smart contracts
│   ├── DonationContract.sol        # Solidity smart contract
│   └── DonationContractABI.json    # Contract ABI
├── README.md             # This file
└── .gitignore

```

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MetaMask** browser extension
- **Git**

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/blockchain-app.git
cd blockchain-app
```

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# (Optional) Update .env with your Infura key for production
# SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Start backend server
npm start
# Server runs on http://localhost:5000
```

### Step 3: Setup Frontend

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
# App opens on http://localhost:3000
```

### Step 4: Configure MetaMask

1. Open MetaMask extension
2. Click network selector (top-right)
3. Click "Add network" (if Sepolia not visible)
4. Enter these details:
   - **Network name**: Sepolia
   - **RPC URL**: `https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`
   - **Chain ID**: `11155111`
   - **Currency symbol**: `ETH`
   - **Block explorer**: `https://sepolia.etherscan.io`

5. Switch to Sepolia network

### Step 5: Get Testnet ETH (Optional)

Visit faucets to get free Sepolia ETH:
- [Sepolia Faucet](https://www.sepoliaetherscan.io/faucet)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com)

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

### Get All Transactions
```
GET /api/transactions
```
Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "donor": "0x742d35Cc6634C0532925a3b844Bc9e7595f42e44",
      "amount": "1.5",
      "timestamp": 1700000000000,
      "txHash": "0x1234...",
      "status": "confirmed"
    }
  ],
  "count": 5,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Get Transaction by ID
```
GET /api/transactions/:id
```

### Get Statistics
```
GET /api/statistics
```
Response:
```json
{
  "success": true,
  "data": {
    "totalDonations": "8.55",
    "donorCount": 5,
    "transactionCount": 5,
    "avgDonation": "1.71"
  }
}
```

## 🔐 Smart Contract

### DonationContract.sol

A simple smart contract for managing donations on Ethereum.

**Key Functions:**
- `receive()` - Accept donations
- `getDonations()` - Get all donations
- `getDonationCount()` - Get total donation count
- `getDonation(index)` - Get specific donation
- `getBalance()` - Get contract balance
- `withdraw()` - Owner withdraws funds
- `getRecentDonations(count)` - Get recent N donations

### Deployment

To deploy on Sepolia testnet:

1. Use Remix IDE: https://remix.ethereum.org/
2. Copy `DonationContract.sol` content
3. Compile and deploy to Sepolia testnet
4. Note the deployed contract address
5. Update contract address in backend `server.js`

## 🎨 UI Components

### WalletConnection
Displays wallet connection status, address, and balance.

### TransactionList
