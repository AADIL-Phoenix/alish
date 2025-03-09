import { connectToDatabase } from '../../app/db/mongodb';

export default async function handler(req, res) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // If we get here, the connection was successful
    res.status(200).json({ success: true, message: 'Connected to MongoDB successfully' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ success: false, message: 'Failed to connect to MongoDB', error: error.message });
  }
} 