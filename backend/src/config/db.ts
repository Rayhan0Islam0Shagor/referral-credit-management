import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.DATABASE_URI ||
  'mongodb://localhost:27017/referral-credit-management';

/**
 * Database connection configuration
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    // Connection options - compatible with newer MongoDB driver versions
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      retryReads: true,
    };

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, options);

    console.log('✅ Connected to MongoDB successfully');

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

/**
 * Disconnect from database
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
  }
};

export default connectDatabase;
