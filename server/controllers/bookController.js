import Book from '../models/Book.js';
import { getBestCoverImage, getCoverImageByCategory } from '../utils/bookCoverService.js';

// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, sortBy = 'title', sortOrder = 'asc' } = req.query;

    // Build query
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const books = await Book.find(query)
      .populate('category', 'name')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Book.countDocuments(query);

    res.json({
      success: true,
      data: books,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalBooks: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get book categories (deprecated)
// @route   GET /api/books/categories
// @access  Public
export const getBookCategories = async (req, res) => {
  try {
    // This route is deprecated - use /api/categories instead
    res.json({
      success: false,
      message: 'Use /api/categories endpoint instead'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private (Admin only)
export const createBook = async (req, res) => {
  try {
    let bookData = { ...req.body };
    
    // If no cover image is provided, try to fetch one
    if (!bookData.coverImage) {
      try {
        const coverImage = await getBestCoverImage(bookData.isbn, bookData.title);
        bookData.coverImage = coverImage;
      } catch (error) {
        console.error('Error fetching cover image:', error);
        // Fallback to category-based image
        bookData.coverImage = getCoverImageByCategory(bookData.category);
      }
    }
    
    const book = await Book.create(bookData);
    
    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Book with this ISBN already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('category', 'name');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Admin only)
export const updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('category', 'name');

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Admin only)
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Soft delete - set isActive to false
    book.isActive = false;
    await book.save();

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update book cover image
// @route   PUT /api/books/:id/cover
// @access  Private (Admin only)
export const updateBookCover = async (req, res) => {
  try {
    const { coverImage } = req.body;
    if (!coverImage) return res.status(400).json({ success: false, message: 'Cover image URL required' });
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { coverImage },
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}; 