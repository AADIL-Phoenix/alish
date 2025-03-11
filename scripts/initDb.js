require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Book = require('../models/Book');
const UserBook = require('../models/UserBook');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Sample data
const users = [
  {
    username: 'jane_austen',
    email: 'jane@example.com',
    password: 'password123',
    bio: 'Avid reader and classic literature enthusiast',
    profile_picture: 'https://randomuser.me/api/portraits/women/1.jpg',
    favorite_genre: 'Classic Literature'
  },
  {
    username: 'book_worm',
    email: 'bookworm@example.com',
    password: 'password123',
    bio: 'Reading is my escape from reality',
    profile_picture: 'https://randomuser.me/api/portraits/men/2.jpg',
    favorite_genre: 'Science Fiction'
  },
  {
    username: 'mystery_lover',
    email: 'mystery@example.com',
    password: 'password123',
    bio: 'Always looking for the next great mystery novel',
    profile_picture: 'https://randomuser.me/api/portraits/women/3.jpg',
    favorite_genre: 'Mystery'
  }
];

const books = [
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Classic',
    description: 'A romantic novel of manners...',
    cover_image: 'https://covers.openlibrary.org/b/id/6424059-L.jpg'
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    description: 'The story of racial injustice...',
    cover_image: 'https://covers.openlibrary.org/b/id/8314135-L.jpg'
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    description: 'A story of wealth, love, and tragedy...',
    cover_image: 'https://covers.openlibrary.org/b/id/8432047-L.jpg'
  }
];

// Initialize database
const initDb = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await UserBook.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create users with hashed passwords
    const createdUsers = [];
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
    }
    
    console.log('Created users');
    
    // Create books
    const createdBooks = [];
    for (const bookData of books) {
      const book = new Book(bookData);
      const savedBook = await book.save();
      createdBooks.push(savedBook);
    }
    
    console.log('Created books');
    
    // Create some user-book relationships
    await UserBook.create({
      user: createdUsers[0]._id,
      book: createdBooks[0]._id,
      status: 'read',
      rating: 5,
      review: 'One of my all-time favorites!'
    });
    
    await UserBook.create({
      user: createdUsers[1]._id,
      book: createdBooks[1]._id,
      status: 'currently_reading'
    });
    
    await UserBook.create({
      user: createdUsers[2]._id,
      book: createdBooks[2]._id,
      status: 'want_to_read'
    });
    
    console.log('Created user-book relationships');
    
    // Create some follow relationships
    await User.findByIdAndUpdate(
      createdUsers[0]._id,
      { $push: { following: createdUsers[1]._id } }
    );
    
    await User.findByIdAndUpdate(
      createdUsers[1]._id,
      { $push: { followers: createdUsers[0]._id } }
    );
    
    console.log('Created follow relationships');
    
    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDb(); 