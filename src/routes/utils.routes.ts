import { Router, Request, Response } from 'express';
import cacheService from '../services/cache.service';
import { ApiResponse } from '../types/api.types';

const router = Router();

/**
 * GET /api/v1/cache/status
 * Get cache status and API health
 */
router.get('/status', async (req: Request, res: Response) => {
    try {
        const status = cacheService.getStatus();

        const response: ApiResponse<typeof status> = {
            success: true,
            data: status,
            timestamp: Date.now(),
        };

        res.json(response);
    } catch (error: any) {
        const response: ApiResponse<null> = {
            success: false,
            error: error.message || 'Failed to fetch cache status',
            timestamp: Date.now(),
        };

        res.status(500).json(response);
    }
});

export default router;
