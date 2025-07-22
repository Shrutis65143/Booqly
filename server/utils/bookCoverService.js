import axios from 'axios';

// Multiple image sources for book covers
const COVER_IMAGES = [
  // High-quality book cover images from Unsplash
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center',
  // Additional book-themed images
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop&crop=center'
];

/**
 * Get a random cover image from the predefined list
 * @returns {string} A random cover image URL
 */
export const getRandomCoverImage = () => {
  const randomIndex = Math.floor(Math.random() * COVER_IMAGES.length);
  return COVER_IMAGES[randomIndex];
};

/**
 * Get a cover image based on book title (deterministic)
 * @param {string} title - Book title
 * @returns {string} A cover image URL
 */
export const getCoverImageByTitle = (title) => {
  if (!title) return COVER_IMAGES[0];
  
  // Use title hash to get consistent image for same title
  const hash = title.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const index = Math.abs(hash) % COVER_IMAGES.length;
  return COVER_IMAGES[index];
};

/**
 * Try to fetch book cover from Google Books API
 * @param {string} isbn - Book ISBN
 * @returns {Promise<string|null>} Cover image URL or null if not found
 */
export const getGoogleBooksCover = async (isbn) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    
    if (response.data.items && response.data.items.length > 0) {
      const book = response.data.items[0];
      if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
        // Convert thumbnail to larger image
        return book.volumeInfo.imageLinks.thumbnail.replace('zoom=1', 'zoom=2');
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching Google Books cover:', error.message);
    return null;
  }
};

/**
 * Try to fetch book cover from OpenLibrary API
 * @param {string} isbn - Book ISBN
 * @returns {Promise<string|null>} Cover image URL or null if not found
 */
export const getOpenLibraryCover = async (isbn) => {
  try {
    const response = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
    
    const bookKey = `ISBN:${isbn}`;
    if (response.data[bookKey] && response.data[bookKey].cover) {
      return response.data[bookKey].cover.large || response.data[bookKey].cover.medium;
    }
    return null;
  } catch (error) {
    console.error('Error fetching OpenLibrary cover:', error.message);
    return null;
  }
};

/**
 * Get the best available cover image for a book
 * @param {string} isbn - Book ISBN
 * @param {string} title - Book title
 * @returns {Promise<string>} Best available cover image URL
 */
export const getBestCoverImage = async (isbn, title) => {
  // Try Google Books first
  const googleCover = await getGoogleBooksCover(isbn);
  if (googleCover) return googleCover;
  
  // Try OpenLibrary
  const openLibraryCover = await getOpenLibraryCover(isbn);
  if (openLibraryCover) return openLibraryCover;
  
  // Fallback to deterministic image based on title
  return getCoverImageByTitle(title);
};

/**
 * Get a cover image for a specific category
 * @param {string} category - Book category
 * @returns {string} A cover image URL appropriate for the category
 */
export const getCoverImageByCategory = (category) => {
  const categoryImages = {
    'Fiction': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center',
    'Non-Fiction': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=center',
    'Science Fiction': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&crop=center',
    'Mystery': 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop&crop=center',
    'Romance': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center',
    'Biography': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop&crop=center',
    'History': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop&crop=center',
    'Science': 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop&crop=center',
    'Technology': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&crop=center',
    'Philosophy': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center',
    'Religion': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=center',
    'Self-Help': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop&crop=center',
    'Business': 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop&crop=center',
    'Education': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop&crop=center',
    'Children': 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop&crop=center',
    'Other': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center'
  };
  
  return categoryImages[category] || categoryImages['Other'];
}; 