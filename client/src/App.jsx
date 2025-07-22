import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

// Components
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Borrows from './pages/Borrows';
import AdminPanel from './pages/AdminPanel';
import Users from './pages/Users';
import UserEdit from './pages/UserEdit';
import LoadingSpinner from './components/LoadingSpinner';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import ManageBooks from './pages/ManageBooks';
import ManageCategories from './pages/ManageCategories';
import UpdateBookCovers from './pages/UpdateBookCovers';
import OverdueBooks from './pages/OverdueBooks';
import ManageRoles from './pages/ManageRoles';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route 
                path="/borrows" 
                element={
                  <ProtectedRoute>
                    <Borrows />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute adminOnly>
                    <Users />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users/:id" 
                element={
                  <ProtectedRoute adminOnly>
                    <UserEdit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/books/add" 
                element={
                  <ProtectedRoute adminOnly>
                    <AddBook />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/books/edit/:id" 
                element={
                  <ProtectedRoute adminOnly>
                    <EditBook />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/books" 
                element={
                  <ProtectedRoute adminOnly>
                    <ManageBooks />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/categories" 
                element={
                  <ProtectedRoute adminOnly>
                    <ManageCategories />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/books/update-covers" 
                element={
                  <ProtectedRoute adminOnly>
                    <UpdateBookCovers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/overdue" 
                element={
                  <ProtectedRoute adminOnly>
                    <OverdueBooks />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/roles" 
                element={
                  <ProtectedRoute adminOnly>
                    <ManageRoles />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
