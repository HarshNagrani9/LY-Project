# MediVault - Decentralized Health Record Management System

A comprehensive healthcare platform built with Next.js, Firebase, IPFS, Ethereum Blockchain, and AI-powered RAG (Retrieval-Augmented Generation) for secure, decentralized health record management with intelligent health assistance.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Firebase Configuration](#firebase-configuration)
- [Smart Contract Setup](#smart-contract-setup)
- [FAISS RAG Service Setup](#faiss-rag-service-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **User Authentication**: Secure login/signup with Firebase Auth
- **Role-Based Access**: Separate dashboards for Patients and Doctors
- **Health Record Management**: Create, view, and manage health records with PDF attachments
- **AI-Powered Analysis**: Automated health record analysis using Google Gemini
- **RAG Chatbot**: Intelligent health assistant with Retrieval-Augmented Generation
- **Blockchain Integration**: Ethereum smart contracts for immutable access control
- **IPFS Storage**: Decentralized file storage via Pinata
- **End-to-End Encryption**: AES-256-GCM encryption for sensitive data
- **Real-time Updates**: Firestore real-time synchronization

## 🛠 Tech Stack

- **Frontend/Backend**: Next.js 15, React 18, TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **File Storage**: IPFS (Pinata)
- **Blockchain**: Ethereum (Sepolia/Mainnet), Solidity, Ethers.js
- **AI/ML**: Google Gemini 2.0 Flash, Genkit, FAISS, Google Embeddings
- **Styling**: Tailwind CSS, shadcn/ui
- **PDF Processing**: pdf-parse-fixed, pdfjs-dist

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **Python** 3.8+ (for FAISS service)
- **MetaMask** browser extension (for blockchain integration)
- **Git**

### Required Accounts & API Keys

1. **Firebase Project** (Firestore + Authentication)
2. **Pinata Account** (IPFS storage) - [pinata.cloud](https://pinata.cloud)
3. **Google AI API Key** (Gemini) - [aistudio.google.com](https://aistudio.google.com)
4. **Ethereum Wallet** (MetaMask) with testnet/mainnet ETH

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd LY-Project
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Generate Encryption Key

Generate a base64-encoded 32-byte encryption key for AES-256-GCM:

```bash
openssl rand -base64 32
```

Save this key - you'll need it for the `ENCRYPTION_KEY` environment variable.

## ⚙️ Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Encryption
ENCRYPTION_KEY=your_base64_encoded_32_byte_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Pinata IPFS Configuration
PINATA_JWT=your_pinata_jwt_token
PINATA_API_KEY=your_pinata_api_key

# Smart Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress

# FAISS Service (optional, defaults to localhost:8000)
FAISS_SERVICE_URL=http://localhost:8000
```

## 🔥 Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Follow the setup wizard
4. Enable **Firestore Database** and **Authentication**

### Step 2: Configure Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. (Optional) Configure other providers

### Step 3: Set Up Firestore

1. Go to **Firestore Database** → **Create database**
2. Start in **Test mode** (or production mode with security rules)
3. Choose a location for your database

### Step 4: Get Firebase Config

1. Go to **Project Settings** → **General** → **Your apps**
2. Click **Web** icon (</>)
3. Register your app and copy the config values
4. Add them to your `.env.local` file

### Step 5: Firestore Security Rules (Recommended)

Add security rules in Firestore Console → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /healthRecords/{recordId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         exists(/databases/$(database)/documents/users/$(request.auth.uid)));
    }
  }
}
```

## 📜 Smart Contract Setup

### Option 1: Using Sepolia Testnet (Development)

1. **Install MetaMask** browser extension
2. **Get Sepolia ETH** from a faucet:
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com)
   - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

3. **Deploy Contract via Remix IDE**:
   - Go to [remix.ethereum.org](https://remix.ethereum.org)
   - Create your contract file (Solidity)
   - Compile the contract
   - Go to "Deploy & Run Transactions"
   - Select "Injected Provider - MetaMask"
   - Switch MetaMask to Sepolia Test Network
   - Click "Deploy"
   - Copy the deployed contract address

4. **Update Environment Variables**:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
   NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_key
   ```

### Option 2: Using Ethereum Mainnet (Production)

1. **Get Real ETH** from an exchange
2. **Deploy via Remix** (same process as above):
   - Switch MetaMask to Ethereum Mainnet
   - Deploy contract (will cost real ETH for gas fees)
   - Copy contract address

3. **Update Environment Variables**:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourMainnetContractAddress
   NEXT_PUBLIC_MAINNET_RPC_URL=https://mainnet.infura.io/v3/your_key
   ```

### Option 3: Using Layer 2 (Recommended for Production)

For lower costs, deploy to **Polygon** or **Base**:

1. **Add Network to MetaMask**:
   - **Polygon**: Chain ID 137, RPC: `https://polygon-rpc.com`
   - **Base**: Chain ID 8453, RPC: `https://mainnet.base.org`

2. **Bridge ETH** to the L2 network
3. **Deploy contract** via Remix
4. **Update contract.ts** to use L2 network configuration

## 🤖 FAISS RAG Service Setup

The FAISS service powers the AI chatbot with vector similarity search.

### Step 1: Navigate to FAISS Service Directory

```bash
cd src/ai/rag/faiss-service
```

### Step 2: Create Python Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Step 3: Install Python Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure FAISS Service Environment

Create a `.env` file in `src/ai/rag/faiss-service/`:

```env
# Google Gemini API Key (same as in .env.local)
GEMINI_API_KEY=your_gemini_api_key

# Embedding Model
EMBEDDING_MODEL=text-embedding-004

# Index File Paths (defaults shown)
DISEASES_INDEX_PATH=../indices/diseases_index.faiss
PATIENT_RECORDS_INDEX_PATH=../indices/patient_records_index.faiss
METADATA_DIR=../indices/metadata

# CSV Dataset Path
CSV_DATASET_PATH=../../../datasets/Diseases Symptoms.csv

# Server Configuration
PORT=8000
HOST=127.0.0.1
```

### Step 5: Initialize FAISS Indices

This creates the vector database from your CSV dataset (takes 5-10 minutes):

```bash
python initialize_indices.py
```

This will:
- Load the diseases CSV file
- Generate embeddings using Google's Embedding API
- Create FAISS indices
- Save indices to disk

### Step 6: Start FAISS Service

```bash
python main.py
```

The service will run on `http://localhost:8000`

**Verify it's running:**
```bash
curl http://localhost:8000/health
```

## 🏃 Running the Application

### Step 1: Start FAISS Service (Terminal 1)

```bash
cd src/ai/rag/faiss-service
source venv/bin/activate
python main.py
```

Keep this terminal running.

### Step 2: Start Next.js Development Server (Terminal 2)

```bash
# From project root
npm run dev
```

The application will be available at `http://localhost:3000`

### Step 3: Access the Application

1. Open `http://localhost:3000` in your browser
2. **Sign up** for a new account (creates a patient account)
3. **Log in** to access your dashboard

### Step 4: Connect MetaMask (Optional)

To use blockchain features:
1. Install MetaMask extension
2. Connect your wallet when prompted
3. Ensure you're on the correct network (Sepolia/Mainnet/L2)

## 📁 Project Structure

```
LY-Project/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/                # API routes
│   │   │   ├── chat/           # RAG chatbot API
│   │   │   ├── extract-pdf-text/
│   │   │   └── upload/
│   │   ├── dashboard/          # Patient dashboard
│   │   │   ├── chat/           # Health Assistant page
│   │   │   ├── my-records/
│   │   │   └── profile/
│   │   ├── doctor/             # Doctor dashboard
│   │   │   ├── diagnose/
│   │   │   ├── patients/
│   │   │   └── view-records/
│   │   ├── login/
│   │   └── signup/
│   ├── components/             # React components
│   │   ├── auth/               # Authentication components
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── HealthChatbot.tsx
│   │   │   ├── HealthTimeline.tsx
│   │   │   └── ...
│   │   └── ui/                 # shadcn/ui components
│   ├── lib/                    # Utility libraries
│   │   ├── firebase/           # Firebase config & Firestore
│   │   ├── contract.ts         # Smart contract interactions
│   │   ├── crypto.ts           # Encryption utilities
│   │   ├── pinata.ts           # IPFS/Pinata integration
│   │   └── types.ts            # TypeScript interfaces
│   ├── ai/                     # AI/ML functionality
│   │   ├── genkit.ts           # Genkit configuration
│   │   ├── flows/              # AI flows
│   │   │   ├── analyze-health-records.ts
│   │   │   └── chat-rag.ts
│   │   └── rag/                # RAG pipeline
│   │       └── faiss-service/  # Python FAISS service
│   │           ├── main.py
│   │           ├── embeddings.py
│   │           ├── faiss_manager.py
│   │           └── initialize_indices.py
│   └── hooks/                  # React hooks
├── datasets/
│   └── Diseases Symptoms.csv   # Medical knowledge base
├── public/                     # Static assets
├── .env.local                  # Environment variables (create this)
└── package.json
```

## 🐛 Troubleshooting

### FAISS Service Issues

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`
- **Solution**: Make sure virtual environment is activated and dependencies are installed:
  ```bash
  cd src/ai/rag/faiss-service
  source venv/bin/activate
  pip install -r requirements.txt
  ```

**Problem**: `FAISS service returned error`
- **Solution**: 
  - Verify FAISS service is running on port 8000
  - Check `FAISS_SERVICE_URL` in `.env.local`
  - Ensure indices are initialized (run `initialize_indices.py`)

### Firebase Issues

**Problem**: Firebase authentication not working
- **Solution**: 
  - Verify all `NEXT_PUBLIC_FIREBASE_*` variables are set correctly
  - Check Firebase Console → Authentication → Sign-in methods are enabled
  - Ensure domain is authorized in Firebase Console

### Smart Contract Issues

**Problem**: `Contract address not set` error
- **Solution**: 
  - Set `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`
  - Verify MetaMask is connected to the correct network
  - Check RPC URL is correct and accessible

**Problem**: Transactions failing
- **Solution**:
  - Ensure wallet has sufficient ETH for gas fees
  - Verify network matches contract deployment network
  - Check MetaMask is unlocked and connected

### AI/Gemini Issues

**Problem**: `Gemini API key is missing or invalid`
- **Solution**:
  - Verify `GEMINI_API_KEY` or `GOOGLE_GENAI_API_KEY` is set
  - Check API key is valid at [aistudio.google.com](https://aistudio.google.com)
  - Ensure API key has proper permissions

### General Issues

**Problem**: Environment variables not loading
- **Solution**:
  - Ensure file is named `.env.local` (not `.env`)
  - Restart Next.js dev server after changing env vars
  - Verify variables start with `NEXT_PUBLIC_` for client-side access

**Problem**: Build errors
- **Solution**:
  ```bash
  rm -rf .next node_modules
  npm install
  npm run build
  ```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Ethers.js Documentation](https://docs.ethers.org)
- [FAISS Documentation](https://github.com/facebookresearch/faiss)
- [Google AI Studio](https://aistudio.google.com)
- [Pinata Documentation](https://docs.pinata.cloud)

## 🔐 Security Notes

- **Never commit** `.env.local` or `.env` files to version control
- Keep API keys and private keys secure
- Use environment variables for all sensitive configuration
- Regularly rotate API keys and encryption keys
- Review Firestore security rules before production deployment
- Audit smart contracts before mainnet deployment

## 📝 License

[Your License Here]

## 👥 Contributors

[Your Name/Team]

---

**Need Help?** Check the troubleshooting section or open an issue in the repository.
