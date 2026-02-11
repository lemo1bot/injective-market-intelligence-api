import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import config from './config/injective.config';
import marketsRoutes from './routes/markets.routes';
import signalsRoutes from './routes/signals.routes';
import utilsRoutes from './routes/utils.routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        name: 'Injective Market Intelligence API',
        version: '1.0.0',
        status: 'running',
        description: 'Developer-friendly REST API providing market analytics, trading signals, and risk metrics for Injective blockchain',
        endpoints: {
            markets: '/api/v1/markets',
            signals: '/api/v1/signals',
            utils: '/api/v1/cache',
        },
        documentation: 'https://github.com/yourusername/injective-market-intelligence-api',
    });
});

// API Routes
app.use('/api/v1/markets', marketsRoutes);
app.use('/api/v1/signals', signalsRoutes);
app.use('/api/v1/cache', utilsRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        timestamp: Date.now(),
    });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error',
        timestamp: Date.now(),
    });
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 Injective Market Intelligence API');
    console.log('='.repeat(60));
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🌐 Network: ${config.injective.network}`);
    console.log(`💾 Cache enabled: ${config.cache.enabled}`);
    console.log('='.repeat(60));
    console.log('\n📋 Available endpoints:');
    console.log(`  GET  /api/v1/markets/overview`);
    console.log(`  GET  /api/v1/markets/:marketId/analytics`);
    console.log(`  GET  /api/v1/markets/:marketId/orderbook-depth`);
    console.log(`  GET  /api/v1/signals/momentum`);
    console.log(`  GET  /api/v1/cache/status`);
    console.log('\n✨ Ready to serve market intelligence!\n');
});

export default app;
