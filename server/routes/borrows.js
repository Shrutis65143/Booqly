import express from 'express';
import { body, validationResult } from 'express-validator';
import Borrow from '../models/Borrow.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all borrows (admin) or user's borrows
// @route   GET /api/borrows
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let query = {};

    // If not admin, only show user's borrows
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    const borrows = await Borrow.find(query)
      .populate('user', 'name email membershipNumber')
      .populate('book', 'title author isbn coverImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Borrow.countDocuments(query);

    res.json({
      success: true,
      data: borrows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalBorrows: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get overdue books
// @route   GET /api/borrows/overdue
// @access  Private (Admin only)
router.get('/overdue', protect, admin, async (req, res) => {
  try {
    const overdueBorrows = await Borrow.find({
      status: { $in: ['borrowed', 'overdue'] },
      dueDate: { $lt: new Date() }
    })
      .populate('user', 'name email membershipNumber')
      .populate('book', 'title author isbn coverImage')
      .sort({ dueDate: 1 });

    // Calculate fines for overdue books
    const updatedBorrows = overdueBorrows.map(borrow => {
      borrow.checkOverdue();
      return borrow;
    });

    res.json({
      success: true,
      data: updatedBorrows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get borrowing statistics
// @route   GET /api/borrows/stats
// @access  Private (Admin only)
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalBorrows = await Borrow.countDocuments();
    const activeBorrows = await Borrow.countDocuments({ status: 'borrowed' });
    const overdueBorrows = await Borrow.countDocuments({ status: 'overdue' });
    const returnedBorrows = await Borrow.countDocuments({ status: 'returned' });

    const totalFines = await Borrow.aggregate([
      { $group: { _id: null, total: { $sum: '$fine' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalBorrows,
        activeBorrows,
        overdueBorrows,
        returnedBorrows,
        totalFines: totalFines[0]?.total || 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Borrow a book
// @route   POST /api/borrows
// @access  Private
router.post('/', protect, [
  body('bookId').notEmpty().withMessage('Book ID is required'),
  body('dueDate').isISO8601().withMessage('Please provide a valid due date')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  try {
    const { bookId, dueDate, notes } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing'
      });
    }

    // Check if user already has this book borrowed
    const existingBorrow = await Borrow.findOne({
      user: req.user.id,
      book: bookId,
      status: { $in: ['borrowed', 'overdue'] }
    });

    if (existingBorrow) {
      return res.status(400).json({
        success: false,
        message: 'You already have this book borrowed'
      });
    }

    // Create borrow record
    const borrow = await Borrow.create({
      user: req.user.id,
      book: bookId,
      dueDate,
      notes
    });

    // Update book available copies
    book.availableCopies -= 1;
    await book.save();

    // Populate the borrow record
    await borrow.populate('user', 'name email membershipNumber');
    await borrow.populate('book', 'title author isbn coverImage');

    res.status(201).json({
      success: true,
      data: borrow
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single borrow
// @route   GET /api/borrows/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id)
      .populate('user', 'name email membershipNumber')
      .populate('book', 'title author isbn coverImage');

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found'
      });
    }

    // Check if user can access this borrow record
    if (req.user.role !== 'admin' && borrow.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this record'
      });
    }

    res.json({
      success: true,
      data: borrow
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Return a book
// @route   PUT /api/borrows/:id/return
// @access  Private (Admin only)
router.put('/:id/return', protect, admin, async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id)
      .populate('book', 'title author isbn coverImage');

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found'
      });
    }

    if (borrow.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Book is already returned'
      });
    }

    // Update borrow record
    borrow.status = 'returned';
    borrow.returnDate = new Date();
    borrow.calculateFine();
    await borrow.save();

    // Update book available copies
    const book = borrow.book;
    book.availableCopies += 1;
    await book.save();

    // Populate the updated borrow record
    await borrow.populate('user', 'name email membershipNumber');
    await borrow.populate('book', 'title author isbn coverImage');

    res.json({
      success: true,
      data: borrow
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router; 