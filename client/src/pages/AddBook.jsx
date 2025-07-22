import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { booksAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AddBook() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await booksAPI.getCategories();
        setCategories(res.data.data || []);
      } catch {
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await booksAPI.create(data);
      toast.success('Book added successfully!');
      reset();
      navigate('/admin/books');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto card p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Add New Book</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="form-label">Title *</label>
          <input
            type="text"
            className={`input-field ${errors.title ? 'border-red-500' : ''}`}
            {...register('title', { required: 'Title is required' })}
            placeholder="Book Title"
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="form-label">Author *</label>
          <input
            type="text"
            className={`input-field ${errors.author ? 'border-red-500' : ''}`}
            {...register('author', { required: 'Author is required' })}
            placeholder="Author Name"
          />
          {errors.author && <p className="text-red-600 text-sm mt-1">{errors.author.message}</p>}
        </div>
        <div>
          <label className="form-label">ISBN *</label>
          <input
            type="text"
            className={`input-field ${errors.isbn ? 'border-red-500' : ''}`}
            {...register('isbn', { required: 'ISBN is required' })}
            placeholder="ISBN Number"
          />
          {errors.isbn && <p className="text-red-600 text-sm mt-1">{errors.isbn.message}</p>}
        </div>
        <div>
          <label className="form-label">Category *</label>
          <select
            className={`input-field ${errors.category ? 'border-red-500' : ''}`}
            {...register('category', { required: 'Category is required' })}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
        </div>
        <div>
          <label className="form-label">Publication Year *</label>
          <input
            type="number"
            className={`input-field ${errors.publicationYear ? 'border-red-500' : ''}`}
            {...register('publicationYear', {
              required: 'Publication year is required',
              min: { value: 1000, message: 'Enter a valid year' },
              max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' }
            })}
            placeholder="e.g. 2020"
          />
          {errors.publicationYear && <p className="text-red-600 text-sm mt-1">{errors.publicationYear.message}</p>}
        </div>
        <div>
          <label className="form-label">Publisher</label>
          <input
            type="text"
            className="input-field"
            {...register('publisher')}
            placeholder="Publisher Name"
          />
        </div>
        <div>
          <label className="form-label">Total Copies *</label>
          <input
            type="number"
            className={`input-field ${errors.totalCopies ? 'border-red-500' : ''}`}
            {...register('totalCopies', {
              required: 'Total copies is required',
              min: { value: 1, message: 'At least 1 copy required' }
            })}
            placeholder="e.g. 5"
          />
          {errors.totalCopies && <p className="text-red-600 text-sm mt-1">{errors.totalCopies.message}</p>}
        </div>
        <div>
          <label className="form-label">Available Copies *</label>
          <input
            type="number"
            className={`input-field ${errors.availableCopies ? 'border-red-500' : ''}`}
            {...register('availableCopies', {
              required: 'Available copies is required',
              min: { value: 0, message: 'Cannot be negative' }
            })}
            placeholder="e.g. 5"
          />
          {errors.availableCopies && <p className="text-red-600 text-sm mt-1">{errors.availableCopies.message}</p>}
        </div>
        <div>
          <label className="form-label">Location</label>
          <input
            type="text"
            className="input-field"
            {...register('location')}
            placeholder="e.g. Fiction Section A1"
          />
        </div>
        <div>
          <label className="form-label">Description</label>
          <textarea
            className="input-field"
            {...register('description')}
            rows={3}
            placeholder="Book description..."
          />
        </div>
        <div>
          <label className="form-label">Cover Image URL</label>
          <input
            type="url"
            className="input-field"
            {...register('coverImage')}
            placeholder="https://..."
          />
        </div>
        <button
          type="submit"
          className="btn-primary w-full mt-4"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
} 