import * as dotenv from 'dotenv';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testDatabaseConnection() {
  console.log('Testing MongoDB connection...');
  console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.log('Please check your .env.local file');
    process.exit(1);
  }
  
  try {
    // Test the connection
    await connectToDatabase();
    console.log('✅ Successfully connected to MongoDB!');
    console.log('Connection state:', mongoose.connection.readyState);
    console.log('Database name:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
    
    // Test basic database operations
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      console.log('\n📁 Available collections:');
      collections.forEach(collection => {
        console.log(`  - ${collection.name}`);
      });
      
      if (collections.length === 0) {
        console.log('  (No collections found - database is empty)');
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:');
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error:', errorMessage);
    
    if (errorMessage.includes('ECONNREFUSED')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('  1. Make sure MongoDB is running locally');
      console.log('  2. Check if the MongoDB service is started');
      console.log('  3. Verify the connection string in .env.local');
      console.log('  4. Consider using MongoDB Atlas for easier setup');
    }
    
    if (errorMessage.includes('authentication')) {
      console.log('\n💡 Authentication error:');
      console.log('  1. Check your username and password');
      console.log('  2. Verify database user permissions');
    }
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    process.exit(0);
  }
}

// Run the test
testDatabaseConnection();
