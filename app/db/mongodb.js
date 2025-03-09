import mongoose from 'mongoose';

// MongoDB connection string
// Replace with your actual MongoDB connection string from MongoDB Atlas or your local MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookclub';

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Cache the database connection
let cachedConnection = null;

export async function connectToDatabase() {
  // If we have a connection already, return it
  if (cachedConnection) {
    return cachedConnection;
  }

  // If no connection exists, create a new one
  try {
    const connection = await mongoose.connect(MONGODB_URI, options);
    console.log('MongoDB connected successfully');
    
    // Cache the connection
    cachedConnection = connection;
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Create a function to close the connection (useful for testing)
export async function disconnectFromDatabase() {
  if (mongoose.connection.readyState) {
    await mongoose.disconnect();
    cachedConnection = null;
    console.log('MongoDB disconnected');
  }
}

// Handle connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Log when connection is established
mongoose.connection.once('open', () => {
  console.log('MongoDB connection established');
}); 