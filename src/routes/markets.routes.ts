import { Router, Request, Response } from 'express';
import analyticsService from '../services/analytics.service';
import { ApiResponse } from '../types/api.types';

const router = Router();

/**
 * GET /api/v1/markets/overview
 * Get aggregated market overview
 */
router.get('/overview', async (req: Request, res: Response) => {
    try {
        const overview = await analyticsService.getMarketOverview();

        const response: ApiResponse<typeof overview> = {
            success: true,
            data: overview,
            timestamp: Date.now(),
        };

        res.json(response);
    } catch (error: any) {
        const response: ApiResponse<null> = {
            success: false,
            error: error.message || 'Failed to fetch market overview',
            timestamp: Date.now(),
        };

        res.status(500).json(response);
    }
});

/**
 * GET /api/v1/markets/:marketId/analytics
 * Get detailed analytics for a specific market
 */
router.get('/:marketId/analytics', async (req: Request, res: Response) => {
    try {
        const { marketId } = req.params;
        const marketType = (req.query.type as 'spot' | 'derivative') || 'spot';

        const analytics = await analyticsService.getMarketAnalytics(marketId, marketType);

        const response: ApiResponse<typeof analytics> = {
            success: true,
            data: analytics,
            timestamp: Date.now(),
        };

        res.json(response);
    } catch (error: any) {
        const response: ApiResponse<null> = {
            success: false,
            error: error.message || 'Failed to fetch market analytics',
            timestamp: Date.now(),
        };

        res.status(500).json(response);
    }
});

/**
 * GET /api/v1/markets/:marketId/orderbook-depth
 * Get orderbook depth analysis
 */
router.get('/:marketId/orderbook-depth', async (req: Request, res: Response) => {
    try {
        const { marketId } = req.params;
        const marketType = (req.query.type as 'spot' | 'derivative') || 'spot';

        const depth = await analyticsService.getOrderbookDepth(marketId, marketType);

        const response: ApiResponse<typeof depth> = {
            success: true,
            data: depth,
            timestamp: Date.now(),
        };

        res.json(response);
    } catch (error: any) {
        const response: ApiResponse<null> = {
            success: false,
            error: error.message || 'Failed to fetch orderbook depth',
            timestamp: Date.now(),
        };

        res.status(500).json(response);
    }
});

export default router;
