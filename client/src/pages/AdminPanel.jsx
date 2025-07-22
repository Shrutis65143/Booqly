import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { borrowsAPI } from '../services/api';
import { 
  BookOpen, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  IndianRupee,
  Plus,
  Settings,
  BarChart3,
  Image
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalBorrows: 0,
    activeBorrows: 0,
    overdueBorrows: 0,
    returnedBorrows: 0,
    totalFines: 0
  });
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsResponse, overdueResponse] = await Promise.all([
        borrowsAPI.getStats(),
        borrowsAPI.getOverdue()
      ]);

      setStats(statsResponse.data.data);
      setOverdueBooks(overdueResponse.data.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (borrowId) => {
    try {
      await borrowsAPI.return(borrowId);
      toast.success('Book returned successfully!');
      fetchAdminData(); // Refresh data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to return book';
      toast.error(message);
    }
  };



  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage library operations and monitor statistics
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link
            to="/admin/books/add"
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Link>
          <Link
            to="/admin/users"
            className="btn-secondary flex items-center"
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Users
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Borrows</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBorrows}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeBorrows}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overdueBorrows}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Returned</p>
              <p className="text-2xl font-bold text-gray-900">{stats.returnedBorrows}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <IndianRupee className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Fines</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalFines}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
            Book Management
          </h2>
          <div className="space-y-3">
            <Link
              to="/admin/books/add"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">Add New Book</span>
              <Plus className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              to="/admin/books"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">Manage Books</span>
              <Settings className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              to="/admin/categories"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">Manage Categories</span>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              to="/admin/books/update-covers"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">Update Book Covers</span>
              <Image className="h-4 w-4 text-gray-400" />
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-600" />
            User Management
          </h2>
          <div className="space-y-3">
            <Link
              to="/admin/users"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">View All Users</span>
              <Users className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              to="/admin/users/new"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">Add New User</span>
              <Plus className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              to="/admin/roles"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">Manage Roles</span>
              <Settings className="h-4 w-4 text-gray-400" />
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
            Reports & Analytics
          </h2>
          <div className="space-y-3">
            <Link
              to="/admin/reports/borrows"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">Borrowing Reports</span>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              to="/admin/reports/fines"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">Fine Reports</span>
              <IndianRupee className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              to="/admin/reports/popular"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">Popular Books</span>
              <BookOpen className="h-4 w-4 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Overdue Books */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Overdue Books ({overdueBooks.length})
          </h2>
          <Link
            to="/admin/overdue"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View all
          </Link>
        </div>

        {overdueBooks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrower
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Overdue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {overdueBooks.slice(0, 5).map((borrow) => {
                  const daysOverdue = Math.ceil((new Date() - new Date(borrow.dueDate)) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <tr key={borrow._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-8 object-cover rounded"
                            src={borrow.book?.coverImage}
                            alt={borrow.book?.title}
                            onError={(e) => { 
                              e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center'; 
                            }}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {borrow.book?.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {borrow.book?.author}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{borrow.user?.name}</div>
                        <div className="text-sm text-gray-500">{borrow.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(borrow.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-red-600 font-medium">
                          {daysOverdue} days
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{borrow.fine || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleReturnBook(borrow._id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Mark Returned
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No overdue books</h3>
            <p className="mt-1 text-sm text-gray-500">
              All books are returned on time!
            </p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 rounded-full p-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New book added</p>
              <p className="text-xs text-gray-500">"The Great Gatsby" by F. Scott Fitzgerald</p>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-green-100 rounded-full p-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Book returned</p>
              <p className="text-xs text-gray-500">"1984" by George Orwell - John Doe</p>
            </div>
            <span className="text-xs text-gray-500">4 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-yellow-100 rounded-full p-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Overdue notification</p>
              <p className="text-xs text-gray-500">"To Kill a Mockingbird" - 3 days overdue</p>
            </div>
            <span className="text-xs text-gray-500">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 