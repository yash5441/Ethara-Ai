# MongoDB Setup Guide

This project uses MongoDB as the database. Choose one setup option below:

## Option 1: MongoDB Atlas (Cloud) - RECOMMENDED ✅

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click **Sign Up** (or Sign In if you have an account)
3. Create your account with email/password or Google/GitHub

### Step 2: Create a Project
1. After signing in, click **Create Project**
2. Name it `atlas-project-manager`
3. Click **Create Project**

### Step 3: Create a Cluster
1. Click **Create** to create a cluster
2. Select **M0 Free** tier (free forever)
3. Select your region (closest to you)
4. Click **Create Cluster**
5. Wait for cluster to be created (2-3 minutes)

### Step 4: Get Connection String
1. Click **Connect**
2. Choose **Drivers** option
3. Select **Node.js** driver
4. Copy the connection string (starts with `mongodb+srv://`)
5. It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/databaseName`

### Step 5: Update .env File
Replace the `MONGODB_URI` in `server/.env`:
```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/atlas_tms
```

**Important:** Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your actual credentials (set when creating the cluster)

---

## Option 2: MongoDB Local Installation

### Windows
1. Download: https://www.mongodb.com/try/download/community
2. Run installer and follow setup wizard
3. Choose "Install MongoDB as a Windows Service"
4. MongoDB will run automatically

### macOS (with Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu)
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

Your `.env` file already has the local connection string:
```
MONGODB_URI=mongodb://localhost:27017/atlas_tms
```

---

## Verify Connection

After setup, run the server:
```bash
cd server
npm run dev
```

You should see output like:
```
✅ MongoDB connected successfully
📝 Seeding database with demo data...
✅ Database seeded successfully
Server running on http://localhost:4000
```

## Demo Accounts

After successful setup, you can login with:
- **Admin**: `admin@atlas.local` / `Admin123!`
- **Member**: `lena@atlas.local` / `Member123!`

---

## Troubleshooting

### "MongoDB connection timeout"
- Verify MongoDB is running
- Check connection string in `.env`
- For Atlas: Ensure IP whitelist includes your IP (in Atlas dashboard)

### "Authentication failed"
- Verify username/password in connection string
- Check database name in connection string

### "Cannot connect to local MongoDB"
- Ensure MongoDB service is running: `mongod` command
- Check if MongoDB is listening on port 27017

