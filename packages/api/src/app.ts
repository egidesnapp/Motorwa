import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { globalLimiter } from './middleware/rateLimit.middleware';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import listingsRoutes from './routes/listings.routes';
import uploadsRoutes from './routes/uploads.routes';
import messagesRoutes from './routes/messages.routes';
import savedRoutes from './routes/saved.routes';
import reviewsRoutes from './routes/reviews.routes';
import dealersRoutes from './routes/dealers.routes';
import notificationsRoutes from './routes/notifications.routes';
import adminRoutes from './routes/admin.routes';
import paymentsRoutes from './routes/payments.routes';
import inspectionsRoutes from './routes/inspections.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.ADMIN_URL || 'http://localhost:3002',
  ],
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use(globalLimiter);

// Health check (no rate limiting)
app.use('/health', healthRoutes);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/listings', listingsRoutes);
app.use('/api/v1/uploads', uploadsRoutes);
app.use('/api/v1/conversations', messagesRoutes);
app.use('/api/v1/saved', savedRoutes);
app.use('/api/v1/reviews', reviewsRoutes);
app.use('/api/v1/dealers', dealersRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/payments', paymentsRoutes);
app.use('/api/v1/inspections', inspectionsRoutes);

// Phone reveal on listings (must be after listings routes)
import { reportListing, reportConversation } from './controllers/reports.controller';
import { requireAuth } from './middleware/auth.middleware';
app.post('/api/v1/listings/:id/report', requireAuth, reportListing);
app.post('/api/v1/conversations/:id/report', requireAuth, reportConversation);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;
