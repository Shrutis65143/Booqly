import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Route files
import authRoutes from './routes/auth.js';
import booksRoutes from './routes/books.js';
import borrowsRoutes from './routes/borrows.js';
import usersRoutes from './routes/users.js';

const app = express();

// Connect to DB
connectDB();

// CORS config
const allowedOrigins = [
  'http://localhost:5173',
  'https://booqly-frontend.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));

// Rate limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/borrows', borrowsRoutes);
app.use('/api/users', usersRoutes);

// Error handler
app.use(errorHandler);

// Port and server start
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
