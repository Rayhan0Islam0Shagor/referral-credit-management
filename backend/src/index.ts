import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './modules/authentication/auth.routes';
import userRoutes from './modules/user/user.routes';
import referralRoutes from './modules/referral/referral.routes';
import purchaseRoutes from './modules/purchase/purchase.routes';
import { connectDatabase } from './config/db';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/purchases', purchaseRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  },
);

// Start server and connect to database
const startServer = async () => {
  try {
    // Connect to database first
    await connectDatabase();

    // Start the server
    app.listen(PORT, () =>
      console.log(`🚀 Backend server running on port ${PORT}`),
    );
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
