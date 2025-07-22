import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
console.log('Mongo URL:', process.env.MONGODB_URL);


const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error('MONGODB_URL environment variable is not defined');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB; 