import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';
import { getBestCoverImage, getCoverImageByCategory } from './utils/bookCoverService.js';

dotenv.config();

const updateBookCovers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all books
    const books = await Book.find({});
    console.log(`Found ${books.length} books to update`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const book of books) {
      try {
        console.log(`Updating cover for: ${book.title}`);
        
        // Try to get a better cover image
        const coverImage = await getBestCoverImage(book.isbn, book.title);
        
        // Update the book
        book.coverImage = coverImage;
        await book.save();
        
        updatedCount++;
        console.log(`✓ Updated: ${book.title}`);
        
        // Add a small delay to avoid overwhelming external APIs
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`✗ Error updating ${book.title}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\nUpdate complete!`);
    console.log(`Successfully updated: ${updatedCount} books`);
    console.log(`Errors: ${errorCount} books`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
updateBookCovers(); 