import mongoose from 'mongoose';
import User from './models/User.js';
import Book from './models/Book.js';
import Borrow from './models/Borrow.js';
import Category from './models/Category.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Function to hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Categories data
const categories = [
  { name: 'Fiction' },
  { name: 'Science Fiction' },
  { name: 'Romance' },
  { name: 'Mystery' },
  { name: 'Biography' },
  { name: 'History' },
  { name: 'Self-Help' },
  { name: 'Philosophy' },
  { name: 'Business' },
  { name: 'Technology' },
  { name: 'Science' },
  { name: 'Poetry' },
  { name: 'Drama' },
  { name: 'Travel' },
  { name: 'Cooking' }
];

// Function to create users with hashed passwords
const createUsersWithHashedPasswords = async () => {
  const hashedPassword = await hashPassword('password123');
  const hashedAdminPassword = await hashPassword('admin123');
  
  return [
    {
      name: 'Shruti Singh',
      email: 'shruti.singh@email.com',
      password: hashedPassword,
      role: 'user',
      membershipNumber: 'MEM20240001',
      phone: '+919876543210',
      address: {
        street: '123 MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001'
      }
    },
    {
      name: 'Sandip Kushwaha',
      email: 'sandip.kushwaha@email.com',
      password: hashedPassword,
      role: 'user',
      membershipNumber: 'MEM20240002',
      phone: '+919876543211',
      address: {
        street: '456 Nehru Street',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001'
      }
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      password: hashedPassword,
      role: 'user',
      membershipNumber: 'MEM20240003',
      phone: '+919876543212',
      address: {
        street: '789 Gandhi Road',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001'
      }
    },
    {
      name: 'Rahul Patel',
      email: 'rahul.patel@email.com',
      password: hashedPassword,
      role: 'user',
      membershipNumber: 'MEM20240004',
      phone: '+919876543213',
      address: {
        street: '321 Tagore Lane',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zipCode: '600001'
      }
    },
    {
      name: 'Anjali Gupta',
      email: 'anjali.gupta@email.com',
      password: hashedPassword,
      role: 'user',
      membershipNumber: 'MEM20240005',
      phone: '+919876543214',
      address: {
        street: '654 Bose Avenue',
        city: 'Kolkata',
        state: 'West Bengal',
        zipCode: '700001'
      }
    },
    {
      name: 'Vikram Malhotra',
      email: 'vikram.malhotra@email.com',
      password: hashedPassword,
      role: 'user',
      membershipNumber: 'MEM20240006',
      phone: '+919876543215',
      address: {
        street: '987 Tilak Marg',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500001'
      }
    },
    {
      name: 'Meera Reddy',
      email: 'meera.reddy@email.com',
      password: hashedPassword,
      role: 'user',
      membershipNumber: 'MEM20240007',
      phone: '+919876543216',
      address: {
        street: '147 Ambedkar Road',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '411001'
      }
    },
    {
      name: 'Arjun Verma',
      email: 'arjun.verma@email.com',
      password: hashedPassword,
      role: 'user',
      membershipNumber: 'MEM20240008',
      phone: '+919876543217',
      address: {
        street: '258 Subhash Chowk',
        city: 'Ahmedabad',
        state: 'Gujarat',
        zipCode: '380001'
      }
    },
    {
      name: 'Kavya Iyer',
      email: 'kavya.iyer@email.com',
      password: hashedPassword,
      role: 'user',
      membershipNumber: 'MEM20240009',
      phone: '+919876543218',
      address: {
        street: '369 Nehru Place',
        city: 'Jaipur',
        state: 'Rajasthan',
        zipCode: '302001'
      }
    },
    {
      name: 'Aditya Kapoor',
      email: 'aditya.kapoor@email.com',
      password: hashedPassword,
      role: 'user',
      membershipNumber: 'MEM20240010',
      phone: '+919876543219',
      address: {
        street: '741 Patel Nagar',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        zipCode: '226001'
      }
    },
    {
      name: 'Zara Khan',
      email: 'zara.khan@email.com',
      password: hashedPassword,
      role: 'user',
      membershipNumber: 'MEM20240011',
      phone: '+919876543220',
      address: {
        street: '852 Azad Colony',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        zipCode: '462001'
      }
    },
    {
      name: 'Admin User',
      email: 'admin@library.com',
      password: hashedAdminPassword,
      role: 'admin',
      membershipNumber: 'MEM20240012',
      phone: '+919876543221',
      address: {
        street: '999 Library Road',
        city: 'Library City',
        state: 'LC',
        zipCode: '00001'
      }
    }
  ];
};



const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    category: 'Fiction',
    description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    publicationYear: 1925,
    publisher: 'Scribner',
    totalCopies: 5,
    availableCopies: 3,
    location: 'Fiction Section A1',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780446310789',
    category: 'Fiction',
    description: 'The story of young Scout Finch and her father Atticus in a racially divided Alabama town.',
    publicationYear: 1960,
    publisher: 'Grand Central Publishing',
    totalCopies: 4,
    availableCopies: 2,
    location: 'Fiction Section A2',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '9780451524935',
    category: 'Science Fiction',
    description: 'A dystopian novel about totalitarianism and surveillance society.',
    publicationYear: 1949,
    publisher: 'Signet Classic',
    totalCopies: 6,
    availableCopies: 4,
    location: 'Science Fiction Section B1',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '9780141439518',
    category: 'Romance',
    description: 'The story of Elizabeth Bennet and Mr. Darcy in early 19th century England.',
    publicationYear: 1813,
    publisher: 'Penguin Classics',
    totalCopies: 3,
    availableCopies: 1,
    location: 'Romance Section C1',
    coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '9780547928241',
    category: 'Fiction',
    description: 'The adventure of Bilbo Baggins, a hobbit who embarks on a quest with thirteen dwarves.',
    publicationYear: 1937,
    publisher: 'Houghton Mifflin Harcourt',
    totalCopies: 7,
    availableCopies: 5,
    location: 'Fiction Section A3',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '9780316769488',
    category: 'Fiction',
    description: 'The story of Holden Caulfield, a teenager navigating the complexities of growing up.',
    publicationYear: 1951,
    publisher: 'Little, Brown and Company',
    totalCopies: 4,
    availableCopies: 2,
    location: 'Fiction Section A4',
    coverImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: 'Lord of the Flies',
    author: 'William Golding',
    isbn: '9780399501487',
    category: 'Fiction',
    description: 'A group of British boys stranded on an uninhabited island and their attempt to govern themselves.',
    publicationYear: 1954,
    publisher: 'Penguin Books',
    totalCopies: 5,
    availableCopies: 3,
    location: 'Fiction Section A5',
    coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: 'Animal Farm',
    author: 'George Orwell',
    isbn: '9780451526342',
    category: 'Fiction',
    description: 'An allegorical novella about a group of farm animals who rebel against their human farmer.',
    publicationYear: 1945,
    publisher: 'Signet',
    totalCopies: 6,
    availableCopies: 4,
    location: 'Fiction Section A6',
    coverImage: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    isbn: '9780062315007',
    category: 'Fiction',
    description: 'A novel about a young Andalusian shepherd who dreams of finding a worldly treasure.',
    publicationYear: 1988,
    publisher: 'HarperOne',
    totalCopies: 4,
    availableCopies: 2,
    location: 'Fiction Section A7',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    isbn: '9780156013987',
    category: 'Fiction',
    description: 'A poetic tale about a young prince who visits various planets in space.',
    publicationYear: 1943,
    publisher: 'Harcourt, Inc.',
    totalCopies: 3,
    availableCopies: 1,
    location: 'Fiction Section A8',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    isbn: '9780307474278',
    category: 'Mystery',
    description: 'A murder mystery novel about a murder in the Louvre Museum and a religious mystery.',
    publicationYear: 2003,
    publisher: 'Anchor',
    totalCopies: 5,
    availableCopies: 3,
    location: 'Mystery Section D1',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    isbn: '9780307588364',
    category: 'Mystery',
    description: 'A psychological thriller about a woman who disappears on her fifth wedding anniversary.',
    publicationYear: 2012,
    publisher: 'Crown',
    totalCopies: 4,
    availableCopies: 2,
    location: 'Mystery Section D2',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    isbn: '9781451648539',
    category: 'Biography',
    description: 'The biography of Steve Jobs, the co-founder of Apple Inc.',
    publicationYear: 2011,
    publisher: 'Simon & Schuster',
    totalCopies: 3,
    availableCopies: 1,
    location: 'Biography Section E1',
    coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '9780062316097',
    category: 'History',
    description: 'A book about the history of human evolution and civilization.',
    publicationYear: 2014,
    publisher: 'Harper',
    totalCopies: 4,
    availableCopies: 2,
    location: 'History Section F1',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: 'The Power of Habit',
    author: 'Charles Duhigg',
    isbn: '9780812981605',
    category: 'Self-Help',
    description: 'Why we do what we do in life and business.',
    publicationYear: 2012,
    publisher: 'Random House',
    totalCopies: 5,
    availableCopies: 3,
    location: 'Self-Help Section G1',
    coverImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: 'The Art of War',
    author: 'Sun Tzu',
    isbn: '9780140439199',
    category: 'Philosophy',
    description: 'An ancient Chinese text on military strategy and tactics.',
    publicationYear: 1910,
    publisher: 'Penguin Classics',
    totalCopies: 3,
    availableCopies: 2,
    location: 'Philosophy Section H1',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    isbn: '9780307887894',
    category: 'Business',
    description: 'How today\'s entrepreneurs use continuous innovation to create radically successful businesses.',
    publicationYear: 2011,
    publisher: 'Crown Business',
    totalCopies: 4,
    availableCopies: 3,
    location: 'Business Section I1',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    isbn: '9780857197689',
    category: 'Business',
    description: 'Timeless lessons on wealth, greed, and happiness.',
    publicationYear: 2020,
    publisher: 'Harriman House',
    totalCopies: 5,
    availableCopies: 4,
    location: 'Business Section I2',
    coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop&crop=center'
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '9780735211292',
    category: 'Self-Help',
    description: 'An easy and proven way to build good habits and break bad ones.',
    publicationYear: 2018,
    publisher: 'Avery',
    totalCopies: 6,
    availableCopies: 5,
    location: 'Self-Help Section G2',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&crop=center'
  }
];

// Function to create borrow records
const createBorrows = (users, books) => {
  const borrows = [];
  const statuses = ['borrowed', 'returned', 'overdue'];
  
  // Create 15 borrow records
  for (let i = 0; i < 15; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const book = books[Math.floor(Math.random() * books.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const borrowDate = new Date();
    borrowDate.setDate(borrowDate.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
    
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14); // 14 days from borrow date
    
    let returnDate = null;
    if (status === 'returned') {
      returnDate = new Date(borrowDate);
      returnDate.setDate(returnDate.getDate() + Math.floor(Math.random() * 14)); // Random return within 14 days
    }
    
    const fine = status === 'overdue' ? Math.floor(Math.random() * 20) + 1 : 0;
    
    borrows.push({
      user: user._id,
      book: book._id,
      borrowDate,
      dueDate,
      returnDate,
      status,
      fine,
      notes: status === 'overdue' ? 'Book is overdue' : status === 'returned' ? 'Book returned on time' : 'Currently borrowed'
    });
  }
  
  return borrows;
};

// Main seeding function
const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/library_management');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Borrow.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data');

    // Create categories first
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // Create users with hashed passwords
    const users = await createUsersWithHashedPasswords();
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    // Update books to use category IDs instead of category names
    const booksWithCategoryIds = books.map(book => {
      const category = createdCategories.find(cat => cat.name === book.category);
      return {
        ...book,
        category: category ? category._id : createdCategories[0]._id // fallback to first category
      };
    });

    // Seed books
    const createdBooks = await Book.insertMany(booksWithCategoryIds);
    console.log(`Created ${createdBooks.length} books`);

    // Create borrow records
    const borrows = createBorrows(createdUsers, createdBooks);
    const createdBorrows = await Borrow.insertMany(borrows);
    console.log(`Created ${createdBorrows.length} borrow records`);

    console.log('Database seeded successfully!');
    console.log('\nSample data created:');
    console.log(`- Categories: ${createdCategories.length}`);
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Books: ${createdBooks.length}`);
    console.log(`- Borrows: ${createdBorrows.length}`);

    // Display some sample data
    console.log('\nSample Categories:');
    createdCategories.slice(0, 5).forEach(category => {
      console.log(`- ${category.name}`);
    });

    console.log('\nSample Users:');
    createdUsers.slice(0, 3).forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    console.log('\nSample Books:');
    createdBooks.slice(0, 3).forEach(book => {
      console.log(`- ${book.title} by ${book.author} - Available: ${book.availableCopies}/${book.totalCopies}`);
    });

    console.log('\nSample Borrows:');
    createdBorrows.slice(0, 3).forEach(borrow => {
      const user = createdUsers.find(u => u._id.equals(borrow.user));
      const book = createdBooks.find(b => b._id.equals(borrow.book));
      console.log(`- ${user.name} borrowed "${book.title}" - Status: ${borrow.status}`);
    });

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeding function
seedData(); 