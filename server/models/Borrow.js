import mongoose from 'mongoose';

const borrowSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrowDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed'
  },
  fine: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot be more than 200 characters']
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
borrowSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate fine if overdue
borrowSchema.methods.calculateFine = function() {
  if (this.status === 'returned' || this.status === 'overdue') {
    const today = new Date();
    const dueDate = new Date(this.dueDate);
    const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
    
    if (daysOverdue > 0) {
      this.fine = daysOverdue * 1; // ₹1 per day
    }
  }
  return this.fine;
};

// Check if overdue
borrowSchema.methods.checkOverdue = function() {
  const today = new Date();
  const dueDate = new Date(this.dueDate);
  
  if (today > dueDate && this.status === 'borrowed') {
    this.status = 'overdue';
    this.calculateFine();
  }
  
  return this.status === 'overdue';
};

export default mongoose.model('Borrow', borrowSchema); 