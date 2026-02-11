import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

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

// Mock data for demo
const mockMarketOverview = {
    totalMarkets: 156,
    totalVolume24h: "12500000.00",
    topGainers: [
        {
            marketId: "0x01edfab47f124748dc89998eb33144af734484ba07099014594321729a0ca16b",
            ticker: "INJ/USDT",
            baseAsset: "INJ",
            quoteAsset: "USDT",
            currentPrice: "25.450000",
            priceChange24h: 8.52,
            volume24h: "1250000.00",
            marketType: "spot" as const
        },
        {
            marketId: "0x9b9980167ecc3645ff1a5517886652d94a0825e54a77d2057cbbe3ebee015963",
            ticker: "ATOM/USDT",
            baseAsset: "ATOM",
            quoteAsset: "USDT",
            currentPrice: "12.340000",
            priceChange24h: 5.23,
            volume24h: "850000.00",
            marketType: "spot" as const
        }
    ],
    topLosers: [
        {
            marketId: "0x2e94726f7c5f8e012f8c7a8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e",
            ticker: "ETH/USDT",
            baseAsset: "ETH",
            quoteAsset: "USDT",
            currentPrice: "2450.000000",
            priceChange24h: -2.15,
            volume24h: "2100000.00",
            marketType: "spot" as const
        }
    ],
    marketHealthScore: 85
};

// API Routes
app.get('/api/v1/markets/overview', (req: Request, res: Response) => {
    res.json({
        success: true,
        data: mockMarketOverview,
        timestamp: Date.now(),
    });
});

app.get('/api/v1/markets/:marketId/analytics', (req: Request, res: Response) => {
    const { marketId } = req.params;

    res.json({
        success: true,
        data: {
            marketId,
            ticker: "INJ/USDT",
            priceStats: {
                current: "25.450000",
                high24h: "26.100000",
                low24h: "24.800000",
                change24h: 0.65,
                changePercent24h: 2.62
            },
            volumeMetrics: {
                volume24h: "1250000.00",
                volumeTrend: "increasing"
            },
            liquidityScore: 78.5,
            volatilityIndex: 3.42
        },
        timestamp: Date.now(),
    });
});

app.get('/api/v1/markets/:marketId/orderbook-depth', (req: Request, res: Response) => {
    const { marketId } = req.params;

    res.json({
        success: true,
        data: {
            marketId,
            ticker: "INJ/USDT",
            spread: "0.010000",
            spreadPercent: 0.0393,
            bidDepth: [
                { price: "25.440000", quantity: "100.0000", total: "2544.00" },
                { price: "25.430000", quantity: "95.0000", total: "2415.85" },
                { price: "25.420000", quantity: "120.0000", total: "3050.40" }
            ],
            askDepth: [
                { price: "25.450000", quantity: "95.0000", total: "2417.75" },
                { price: "25.460000", quantity: "110.0000", total: "2800.60" },
                { price: "25.470000", quantity: "88.0000", total: "2241.36" }
            ],
            liquidityConcentration: 15.2
        },
        timestamp: Date.now(),
    });
});

app.get('/api/v1/signals/momentum', (req: Request, res: Response) => {
    res.json({
        success: true,
        data: [
            {
                marketId: "0x01edfab47f124748dc89998eb33144af734484ba07099014594321729a0ca16b",
                ticker: "INJ/USDT",
                momentumScore: 8.5,
                priceChange24h: 8.52,
                volumeChange24h: 15.3,
                signal: "buy"
            },
            {
                marketId: "0x9b9980167ecc3645ff1a5517886652d94a0825e54a77d2057cbbe3ebee015963",
                ticker: "ATOM/USDT",
                momentumScore: 5.2,
                priceChange24h: 5.23,
                volumeChange24h: 8.1,
                signal: "buy"
            }
        ],
        timestamp: Date.now(),
    });
});

app.get('/api/v1/cache/status', (req: Request, res: Response) => {
    res.json({
        success: true,
        data: {
            enabled: true,
            lastUpdate: Date.now(),
            cacheHitRate: 78.5,
            uptime: 3600,
            entries: 42
        },
        timestamp: Date.now(),
    });
});

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
    console.log('🚀 Injective Market Intelligence API (Demo Version)');
    console.log('='.repeat(60));
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🌐 Network: mainnet (demo mode with mock data)`);
    console.log(`💾 Cache enabled: true`);
    console.log('='.repeat(60));
    console.log('\n📋 Available endpoints:');
    console.log(`  GET  /api/v1/markets/overview`);
    console.log(`  GET  /api/v1/markets/:marketId/analytics`);
    console.log(`  GET  /api/v1/markets/:marketId/orderbook-depth`);
    console.log(`  GET  /api/v1/signals/momentum`);
    console.log(`  GET  /api/v1/cache/status`);
    console.log('\n✨ Ready to serve market intelligence!\n');
    console.log('⚠️  Note: Running in demo mode with mock data');
    console.log('   Full Injective integration available in src/ folder\n');
});

export default app;
