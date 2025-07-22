import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { booksAPI } from '../services/api';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookResponse, categoriesResponse] = await Promise.all([
          booksAPI.getById(id),
          booksAPI.getCategories()
        ]);
        
        const bookData = bookResponse.data.data;
        setBook(bookData);
        setCategories(categoriesResponse.data.data || []);
        
        // Pre-fill form with existing book data
        setValue('title', bookData.title);
        setValue('author', bookData.author);
        setValue('isbn', bookData.isbn);
        setValue('category', bookData.category._id || bookData.category);
        setValue('description', bookData.description || '');
        setValue('publicationYear', bookData.publicationYear || '');
        setValue('publisher', bookData.publisher || '');
        setValue('totalCopies', bookData.totalCopies);
        setValue('availableCopies', bookData.availableCopies);
        setValue('location', bookData.location);
        setValue('coverImage', bookData.coverImage || '');
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load book data');
        navigate('/admin/books');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, setValue]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await booksAPI.update(id, data);
      toast.success('Book updated successfully!');
      navigate('/admin/books');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update book';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/books')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Books</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Edit Book</h1>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                {...register('title', { 
                  required: 'Title is required',
                  maxLength: { value: 100, message: 'Title cannot exceed 100 characters' }
                })}
                className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Enter book title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                id="author"
                {...register('author', { 
                  required: 'Author is required',
                  maxLength: { value: 50, message: 'Author name cannot exceed 50 characters' }
                })}
                className={`input-field ${errors.author ? 'border-red-500' : ''}`}
                placeholder="Enter author name"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
              )}
            </div>

            {/* ISBN */}
            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-2">
                ISBN *
              </label>
              <input
                type="text"
                id="isbn"
                {...register('isbn', { 
                  required: 'ISBN is required',
                  pattern: { 
                    value: /^(?:\d{10}|\d{13})$/,
                    message: 'Please provide a valid 10 or 13 digit ISBN'
                  }
                })}
                className={`input-field ${errors.isbn ? 'border-red-500' : ''}`}
                placeholder="Enter ISBN (10 or 13 digits)"
              />
              {errors.isbn && (
                <p className="mt-1 text-sm text-red-600">{errors.isbn.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                {...register('category', { required: 'Category is required' })}
                className={`input-field ${errors.category ? 'border-red-500' : ''}`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Publication Year */}
            <div>
              <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700 mb-2">
                Publication Year
              </label>
              <input
                type="number"
                id="publicationYear"
                {...register('publicationYear', {
                  min: { value: 1800, message: 'Publication year must be after 1800' },
                  max: { value: new Date().getFullYear(), message: 'Publication year cannot be in the future' }
                })}
                className={`input-field ${errors.publicationYear ? 'border-red-500' : ''}`}
                placeholder="Enter publication year"
              />
              {errors.publicationYear && (
                <p className="mt-1 text-sm text-red-600">{errors.publicationYear.message}</p>
              )}
            </div>

            {/* Publisher */}
            <div>
              <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-2">
                Publisher
              </label>
              <input
                type="text"
                id="publisher"
                {...register('publisher')}
                className="input-field"
                placeholder="Enter publisher name"
              />
            </div>

            {/* Total Copies */}
            <div>
              <label htmlFor="totalCopies" className="block text-sm font-medium text-gray-700 mb-2">
                Total Copies *
              </label>
              <input
                type="number"
                id="totalCopies"
                {...register('totalCopies', { 
                  required: 'Total copies is required',
                  min: { value: 1, message: 'Total copies must be at least 1' }
                })}
                className={`input-field ${errors.totalCopies ? 'border-red-500' : ''}`}
                placeholder="Enter total number of copies"
              />
              {errors.totalCopies && (
                <p className="mt-1 text-sm text-red-600">{errors.totalCopies.message}</p>
              )}
            </div>

            {/* Available Copies */}
            <div>
              <label htmlFor="availableCopies" className="block text-sm font-medium text-gray-700 mb-2">
                Available Copies *
              </label>
              <input
                type="number"
                id="availableCopies"
                {...register('availableCopies', { 
                  required: 'Available copies is required',
                  min: { value: 0, message: 'Available copies cannot be negative' }
                })}
                className={`input-field ${errors.availableCopies ? 'border-red-500' : ''}`}
                placeholder="Enter available number of copies"
              />
              {errors.availableCopies && (
                <p className="mt-1 text-sm text-red-600">{errors.availableCopies.message}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                {...register('location', { required: 'Location is required' })}
                className={`input-field ${errors.location ? 'border-red-500' : ''}`}
                placeholder="Enter book location (e.g., Shelf A1, Row 3)"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            {/* Cover Image URL */}
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL
              </label>
              <input
                type="url"
                id="coverImage"
                {...register('coverImage')}
                className="input-field"
                placeholder="https://example.com/book-cover.jpg"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description', {
                maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
              })}
              className={`input-field ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Enter book description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Cover Image Preview */}
          {book?.coverImage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Cover Image
              </label>
              <div className="flex items-center space-x-4">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-32 w-24 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center';
                  }}
                />
                <div className="text-sm text-gray-500">
                  <p>Current cover image for "{book.title}"</p>
                  <p className="mt-1">Update the URL above to change the cover image</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/books')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 