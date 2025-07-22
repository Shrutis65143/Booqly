import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { booksAPI, borrowsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  BookOpen, 
  User, 
  Clock,
  AlertTriangle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [showBorrowForm, setShowBorrowForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await booksAPI.getById(id);
      setBook(response.data.data);
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitBorrow = async (data) => {
    if (!isAuthenticated) {
      toast.error('Please login to borrow books');
      navigate('/login');
      return;
    }

    setBorrowing(true);
    try {
      const borrowData = {
        bookId: id,
        dueDate: data.dueDate,
        notes: data.notes || ''
      };

      await borrowsAPI.borrow(borrowData);
      toast.success('Book borrowed successfully!');
      setShowBorrowForm(false);
      reset();
      fetchBook(); // Refresh book data to update availability
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to borrow book';
      toast.error(message);
    } finally {
      setBorrowing(false);
    }
  };

  const handleBorrowClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to borrow books');
      navigate('/login');
      return;
    }
    setShowBorrowForm(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Book not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The book you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/books')}
            className="btn-primary"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/books')}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Books
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Cover and Basic Info */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="aspect-[3/4] mb-6">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => { 
                  e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center'; 
                }}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Available Copies</span>
                <span className="text-lg font-semibold text-gray-900">
                  {book.availableCopies}/{book.totalCopies}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  book.availableCopies > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
                </span>
              </div>

              {book.availableCopies > 0 && (
                <button
                  onClick={handleBorrowClick}
                  className="w-full btn-primary"
                >
                  Borrow This Book
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Author */}
          <div className="card">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {book.title}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              by {book.author}
            </p>
            
            {book.description && (
              <p className="text-gray-700 leading-relaxed">
                {book.description}
              </p>
            )}
          </div>

          {/* Book Information */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Book Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium text-gray-900">{book.category?.name || 'Unknown'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Publication Year</p>
                  <p className="font-medium text-gray-900">{book.publicationYear}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Publisher</p>
                  <p className="font-medium text-gray-900">{book.publisher || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{book.location}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">ISBN</p>
                  <p className="font-medium text-gray-900">{book.isbn}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Borrow Form */}
          {showBorrowForm && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Borrow Book</h2>
              <form onSubmit={handleSubmit(onSubmitBorrow)} className="space-y-4">
                <div>
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    {...register('dueDate', {
                      required: 'Due date is required',
                      validate: (value) => {
                        const selectedDate = new Date(value);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return selectedDate > today || 'Due date must be in the future';
                      }
                    })}
                    className={`input-field ${errors.dueDate ? 'border-red-500' : ''}`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.dueDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Notes (Optional)</label>
                  <textarea
                    {...register('notes')}
                    rows="3"
                    className="input-field"
                    placeholder="Any additional notes..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={borrowing}
                    className="btn-primary flex-1"
                  >
                    {borrowing ? 'Borrowing...' : 'Confirm Borrow'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBorrowForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Borrowing Guidelines */}
          <div className="card bg-blue-50 border-blue-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Borrowing Guidelines
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• Books can be borrowed for up to 14 days</p>
                              <p>• Late returns incur a fine of ₹1 per day</p>
              <p>• You can borrow up to 5 books at a time</p>
              <p>• Please return books in good condition</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail; 