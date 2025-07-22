import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a book title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true,
    maxlength: [50, 'Author name cannot be more than 50 characters']
  },
  isbn: {
    type: String,
    required: [true, 'Please add an ISBN'],
    unique: true,
    match: [/^(?:\d{10}|\d{13})$/, 'Please add a valid 10 or 13 digit ISBN']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please add a category']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  publicationYear: {
    type: Number,
    min: [1800, 'Publication year must be after 1800'],
    max: [new Date().getFullYear(), 'Publication year cannot be in the future']
  },
  publisher: {
    type: String,
    trim: true
  },
  totalCopies: {
    type: Number,
    required: [true, 'Please add total number of copies'],
    min: [1, 'Total copies must be at least 1']
  },
  availableCopies: {
    type: Number,
    required: [true, 'Please add available number of copies'],
    min: [0, 'Available copies cannot be negative']
  },
  location: {
    type: String,
    required: [true, 'Please add book location'],
    trim: true
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center'
  },
  isActive: {
    type: Boolean,
    default: true
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

// Update the updatedAt field before saving
bookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for checking if book is available
bookSchema.virtual('isAvailable').get(function() {
  return this.availableCopies > 0;
});

// Ensure virtuals are serialized
bookSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Book', bookSchema); 