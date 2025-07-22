import React, { useEffect, useState } from 'react';
import { categoriesAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data.data);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return toast.error('Category name required');
    try {
      await categoriesAPI.create({ name: newCategory });
      toast.success('Category added');
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category');
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setEditingName(cat.name);
  };

  const handleUpdate = async (id) => {
    if (!editingName.trim()) return toast.error('Category name required');
    try {
      await categoriesAPI.update(id, { name: editingName });
      toast.success('Category updated');
      setEditingId(null);
      setEditingName('');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await categoriesAPI.delete(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="max-w-xl mx-auto card p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Manage Categories</h1>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          className="input-field flex-1"
          placeholder="New category name"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
        />
        <button type="submit" className="btn-primary">Add</button>
      </form>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map(cat => (
              <tr key={cat._id}>
                <td className="px-4 py-2">
                  {editingId === cat._id ? (
                    <input
                      type="text"
                      className="input-field"
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleUpdate(cat._id)}
                      autoFocus
                    />
                  ) : (
                    <span>{cat.name}</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingId === cat._id ? (
                    <>
                      <button className="btn-primary mr-2" onClick={() => handleUpdate(cat._id)}>Save</button>
                      <button className="btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-secondary mr-2" onClick={() => handleEdit(cat)}>Edit</button>
                      <button className="btn-danger" onClick={() => handleDelete(cat._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={2} className="text-center py-8 text-gray-500">No categories found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
} 