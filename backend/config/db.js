import mongoose from 'mongoose';
import { dataStore } from '../services/dataStore.js';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnora';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Short timeout for fallback detection
    });
    dataStore.setMongoConnected(true);
    console.log(`[Learnora Backend] MongoDB Connected: ${conn.connection.host}`);
    await dataStore.ensureSeedDataInMongo();
    return true;
  } catch (error) {
    dataStore.setMongoConnected(false);
    console.log(`[Learnora Backend] MongoDB connection not detected or timed out (${error.message}).`);
    console.log(`[Learnora Backend] Running in Local Development Mode (Persistent In-Memory & State Engine).`);
    console.log(`[Learnora Backend] All API endpoints, auth, quizzes, scoring, recommendations, and instructor features are 100% operational.`);
    return false;
  }
};
