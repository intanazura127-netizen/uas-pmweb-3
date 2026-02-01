#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Blockchain App - Quick Start Setup${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check Node.js
echo -e "${BLUE}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "  Please install Node.js from https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}\n"

# Install dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}\n"
else
    echo -e "${RED}✗ Failed to install backend dependencies${NC}"
    exit 1
fi

echo -e "${BLUE}Installing frontend dependencies...${NC}"
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}\n"
else
    echo -e "${RED}✗ Failed to install frontend dependencies${NC}"
    exit 1
fi

cd ..

# Create .env files if they don't exist
if [ ! -f backend/.env ]; then
    echo -e "${BLUE}Creating backend .env file...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ .env created${NC}\n"
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${BLUE}Next steps:${NC}"
echo "1. Update MetaMask network settings (see README.md)"
echo "2. Start backend:   cd backend && npm start"
echo "3. Start frontend:  cd frontend && npm start"
echo "4. Open http://localhost:3000 in your browser\n"

echo -e "${BLUE}Or use concurrently:${NC}"
echo "npm run dev"
