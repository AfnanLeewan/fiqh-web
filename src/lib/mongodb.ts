import { MongoClient } from "mongodb";
import mongoose from "mongoose";

function getMongodbUri(): string {
  return process.env.MONGODB_URI || "mongodb://localhost:27017/web-fiqh";
}

// Extend the global type for development mode
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// MongoDB Native Client (for advanced operations)
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the connection
  if (!global._mongoClientPromise) {
    client = new MongoClient(getMongodbUri());
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client for each connection
  client = new MongoClient(getMongodbUri());
  clientPromise = client.connect();
}

// Mongoose Connection (for schema-based operations)
let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const uri = getMongodbUri();
    await mongoose.connect(uri);
    isConnected = true;
    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export default clientPromise;
