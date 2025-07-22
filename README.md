# Library Management System

A modern, full-stack library management application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Tailwind CSS.

## 🚀 Features

### For Users
- **User Authentication**: Secure registration and login with JWT
- **Book Browsing**: Search, filter, and browse the library catalog
- **Book Borrowing**: Borrow books with due date selection
- **Borrow History**: Track all borrowed books and their status
- **Dashboard**: Overview of borrowing statistics and recent activity
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### For Administrators
- **Admin Panel**: Comprehensive dashboard with library statistics
- **Book Management**: Add, edit, and manage books in the catalog
- **User Management**: View and manage user accounts
- **Borrowing Management**: Process book returns and track overdue items
- **Fine Calculation**: Automatic fine calculation for overdue books
- **Reports**: Generate borrowing and fine reports

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing
- **morgan** - HTTP request logger

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **date-fns** - Date manipulation

## 📁 Project Structure

```
Library Management/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # App entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Backend Node.js application
│   ├── config/             # Configuration files
│   ├── middleware/         # Express middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── index.js            # Server entry point
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Library-Management
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/library_management
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   NODE_ENV=development
   ```

5. **Start the development servers**

   **Backend:**
   ```bash
   cd server
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Books
- `GET /api/books` - Get all books (with pagination, search, filters)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create new book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)
- `GET /api/books/categories` - Get book categories

### Borrows
- `GET /api/borrows` - Get user's borrows (or all for admin)
- `GET /api/borrows/:id` - Get single borrow
- `POST /api/borrows` - Borrow a book
- `PUT /api/borrows/:id/return` - Return a book (admin only)
- `GET /api/borrows/overdue` - Get overdue books (admin only)
- `GET /api/borrows/stats` - Get borrowing statistics (admin only)

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Responsive Layout**: Mobile-first design approach
- **Interactive Elements**: Hover effects, transitions, and animations
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: User feedback for actions
- **Form Validation**: Real-time validation with error messages
- **Accessibility**: ARIA labels and keyboard navigation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Server-side validation with express-validator
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Configured CORS for security
- **Helmet.js**: Security headers middleware
- **Environment Variables**: Secure configuration management

## 📊 Database Schema

### User Model
- Name, email, password
- Role (user/admin)
- Membership number
- Contact information
- Address details

### Book Model
- Title, author, ISBN
- Category, description
- Publication details
- Copy management (total/available)
- Location information

### Borrow Model
- User and book references
- Borrow and due dates
- Status tracking
- Fine calculation
- Notes and metadata

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku account
2. Install Heroku CLI
3. Create a new Heroku app
4. Set environment variables in Heroku dashboard
5. Deploy using Git

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your preferred platform

## ✍️ Author: Shruti Singh

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request



