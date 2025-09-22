# MongoDB Setup Guide

## Quick Setup with MongoDB Atlas (Recommended)

1. **Create a MongoDB Atlas Account**
   - Go to https://www.mongodb.com/atlas
   - Sign up for a free account
   - Create a new cluster (free tier is fine)

2. **Configure Database Access**
   - In Atlas Dashboard, go to "Database Access"
   - Click "Add New Database User"
   - Create a user with username/password
   - Give it "Read and write to any database" privileges

3. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development, you can click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, restrict to specific IPs

4. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `fiqh-web`

5. **Update Environment Variables**
   - Open `.env.local`
   - Replace the MONGODB_URI with your Atlas connection string
   - Example: `mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/fiqh-web?retryWrites=true&w=majority`

## Alternative: Local MongoDB Setup

If you prefer to run MongoDB locally:

1. **Install MongoDB Community Server**
   - Download from https://www.mongodb.com/try/download/community
   - Install and start the MongoDB service

2. **Update .env.local**
   ```
   MONGODB_URI=mongodb://localhost:27017/fiqh-web
   ```

## After Setup

1. **Seed the Database**
   ```bash
   npm run seed
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

3. **Test the API**
   - Visit http://localhost:3000/api/content to test the API
   - Visit http://localhost:3000/admin to access the admin interface

## Troubleshooting

- **Connection Refused**: Make sure MongoDB is running and the connection string is correct
- **Authentication Failed**: Check your username/password in the connection string
- **Network Error**: Check your IP whitelist in MongoDB Atlas
- **Database Not Found**: The database will be created automatically when you first insert data
