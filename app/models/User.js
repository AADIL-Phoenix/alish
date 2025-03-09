import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  photoURL: String,
  communities: [String],
  groups: [String],
  books: {
    type: Map,
    of: {
      title: String,
      author: String,
      status: String,
      updatedAt: Date
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Check if the model already exists to prevent overwriting
export default mongoose.models.User || mongoose.model('User', UserSchema); 