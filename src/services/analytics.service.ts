import injectiveDataService from './injective-data.service';
import cacheService from './cache.service';
import {
    MarketOverview,
    MarketSummary,
    MarketAnalytics,
    OrderbookDepth,
    MomentumSignal,
    LiquidityOpportunity,
    VolatilityAlert,
    MarketHealth,
    ConcentrationRisk,
    PriceLevel,
} from '../types/api.types';
import {
    calculateVolatility,
    calculateLiquidityScore,
    calculateMomentumScore,
    getMomentumSignal,
    getRiskLevel,
    calculateConcentrationRatio,
    parseNumber,
    calculatePercentageChange,
} from '../utils/calculations';

/**
 * Analytics engine for processing Injective market data
 */
class AnalyticsService {
    /**
     * Get market overview with aggregated statistics
     */
    async getMarketOverview(): Promise<MarketOverview> {
        const cacheKey = 'market_overview';
        const cached = cacheService.get<MarketOverview>(cacheKey);
        if (cached) return cached;

        try {
            const [spotMarkets, derivativeMarkets] = await Promise.all([
                injectiveDataService.getSpotMarkets(),
                injectiveDataService.getDerivativeMarkets(),
            ]);

            const allMarkets = [...spotMarkets, ...derivativeMarkets];

            // Calculate total volume (simplified - using market data)
            let totalVolume = 0;
            const marketSummaries: MarketSummary[] = [];

            for (const market of allMarkets.slice(0, 20)) { // Limit to top 20 for performance
                try {
                    const summary = await this.getMarketSummary(market);
                    marketSummaries.push(summary);
                    totalVolume += parseNumber(summary.volume24h);
                } catch (error) {
                    // Skip markets that fail
                    continue;
                }
            }

            // Sort by price change
            const sortedByChange = [...marketSummaries].sort((a, b) => b.priceChange24h - a.priceChange24h);

            const overview: MarketOverview = {
                totalMarkets: allMarkets.length,
                totalVolume24h: totalVolume.toFixed(2),
                topGainers: sortedByChange.slice(0, 5),
                topLosers: sortedByChange.slice(-5).reverse(),
                marketHealthScore: this.calculateMarketHealthScore(marketSummaries),
            };

            cacheService.set(cacheKey, overview);
            return overview;
        } catch (error) {
            console.error('Error getting market overview:', error);
            throw error;
        }
    }

    /**
     * Get detailed analytics for a specific market
     */
    async getMarketAnalytics(marketId: string, marketType: 'spot' | 'derivative' = 'spot'): Promise<MarketAnalytics> {
        const cacheKey = `market_analytics_${marketId}`;
        const cached = cacheService.get<MarketAnalytics>(cacheKey);
        if (cached) return cached;

        try {
            const [market, trades, orderbook] = await Promise.all([
                marketType === 'spot'
                    ? injectiveDataService.getSpotMarket(marketId)
                    : injectiveDataService.getDerivativeMarket(marketId),
                marketType === 'spot'
                    ? injectiveDataService.getSpotTrades(marketId, 100)
                    : injectiveDataService.getDerivativeTrades(marketId, 100),
                marketType === 'spot'
                    ? injectiveDataService.getSpotOrderbook(marketId)
                    : injectiveDataService.getDerivativeOrderbook(marketId),
            ]);

            // Calculate price statistics from trades
            const prices = trades.map((t: any) => parseNumber(t.price));
            const volumes = trades.map((t: any) => parseNumber(t.quantity));

            const currentPrice = prices[0] || 0;
            const high24h = Math.max(...prices);
            const low24h = Math.min(...prices);
            const oldPrice = prices[prices.length - 1] || currentPrice;
            const change24h = currentPrice - oldPrice;
            const changePercent24h = calculatePercentageChange(oldPrice, currentPrice);

            // Calculate volume metrics
            const volume24h = volumes.reduce((sum: number, v: number) => sum + v, 0);
            const recentVolume = volumes.slice(0, 10).reduce((sum: number, v: number) => sum + v, 0);
            const olderVolume = volumes.slice(-10).reduce((sum: number, v: number) => sum + v, 0);
            const volumeTrend = recentVolume > olderVolume * 1.1 ? 'increasing' :
                recentVolume < olderVolume * 0.9 ? 'decreasing' : 'stable';

            // Calculate liquidity and volatility
            const bidDepth = orderbook.buys.reduce((sum: number, order: any) => sum + parseNumber(order.quantity), 0);
            const askDepth = orderbook.sells.reduce((sum: number, order: any) => sum + parseNumber(order.quantity), 0);
            const spread = orderbook.sells[0] ? parseNumber(orderbook.sells[0].price) - parseNumber(orderbook.buys[0]?.price || 0) : 0;

            const liquidityScore = calculateLiquidityScore(bidDepth, askDepth, spread);
            const volatilityIndex = calculateVolatility(prices);

            const analytics: MarketAnalytics = {
                marketId,
                ticker: market.ticker,
                priceStats: {
                    current: currentPrice.toFixed(6),
                    high24h: high24h.toFixed(6),
                    low24h: low24h.toFixed(6),
                    change24h: parseFloat(change24h.toFixed(6)),
                    changePercent24h: parseFloat(changePercent24h.toFixed(2)),
                },
                volumeMetrics: {
                    volume24h: volume24h.toFixed(2),
                    volumeTrend,
                },
                liquidityScore,
                volatilityIndex: parseFloat(volatilityIndex.toFixed(2)),
            };

            cacheService.set(cacheKey, analytics);
            return analytics;
        } catch (error) {
            console.error(`Error getting market analytics for ${marketId}:`, error);
            throw error;
        }
    }

    /**
     * Get orderbook depth analysis
     */
    async getOrderbookDepth(marketId: string, marketType: 'spot' | 'derivative' = 'spot'): Promise<OrderbookDepth> {
        const cacheKey = `orderbook_depth_${marketId}`;
        const cached = cacheService.get<OrderbookDepth>(cacheKey);
        if (cached) return cached;

        try {
            const [market, orderbook] = await Promise.all([
                marketType === 'spot'
                    ? injectiveDataService.getSpotMarket(marketId)
                    : injectiveDataService.getDerivativeMarket(marketId),
                marketType === 'spot'
                    ? injectiveDataService.getSpotOrderbook(marketId)
                    : injectiveDataService.getDerivativeOrderbook(marketId),
            ]);

            const bestBid = parseNumber(orderbook.buys[0]?.price || 0);
            const bestAsk = parseNumber(orderbook.sells[0]?.price || 0);
            const spread = bestAsk - bestBid;
            const spreadPercent = (spread / bestBid) * 100;

            // Process bid depth
            const bidDepth: PriceLevel[] = orderbook.buys.slice(0, 10).map((order: any) => ({
                price: parseNumber(order.price).toFixed(6),
                quantity: parseNumber(order.quantity).toFixed(4),
                total: (parseNumber(order.price) * parseNumber(order.quantity)).toFixed(2),
            }));

            // Process ask depth
            const askDepth: PriceLevel[] = orderbook.sells.slice(0, 10).map((order: any) => ({
                price: parseNumber(order.price).toFixed(6),
                quantity: parseNumber(order.quantity).toFixed(4),
                total: (parseNumber(order.price) * parseNumber(order.quantity)).toFixed(2),
            }));

            // Calculate liquidity concentration
            const totalBidVolume = bidDepth.reduce((sum, level) => sum + parseNumber(level.total), 0);
            const topBidVolume = parseNumber(bidDepth[0]?.total || 0);
            const liquidityConcentration = totalBidVolume > 0 ? (topBidVolume / totalBidVolume) * 100 : 0;

            const depth: OrderbookDepth = {
                marketId,
                ticker: market.ticker,
                spread: spread.toFixed(6),
                spreadPercent: parseFloat(spreadPercent.toFixed(4)),
                bidDepth,
                askDepth,
                liquidityConcentration: parseFloat(liquidityConcentration.toFixed(2)),
            };

            cacheService.set(cacheKey, depth);
            return depth;
        } catch (error) {
            console.error(`Error getting orderbook depth for ${marketId}:`, error);
            throw error;
        }
    }

    /**
     * Get momentum signals across markets
     */
    async getMomentumSignals(): Promise<MomentumSignal[]> {
        const cacheKey = 'momentum_signals';
        const cached = cacheService.get<MomentumSignal[]>(cacheKey);
        if (cached) return cached;

        try {
            const overview = await this.getMarketOverview();
            const signals: MomentumSignal[] = [];

            // Analyze top markets for momentum
            const marketsToAnalyze = [...overview.topGainers, ...overview.topLosers].slice(0, 10);

            for (const market of marketsToAnalyze) {
                const momentumScore = calculateMomentumScore(market.priceChange24h, 0); // Simplified

                signals.push({
                    marketId: market.marketId,
                    ticker: market.ticker,
                    momentumScore,
                    priceChange24h: market.priceChange24h,
                    volumeChange24h: 0, // Would need historical data
                    signal: getMomentumSignal(momentumScore),
                });
            }

            // Sort by momentum score
            signals.sort((a, b) => b.momentumScore - a.momentumScore);

            cacheService.set(cacheKey, signals);
            return signals;
        } catch (error) {
            console.error('Error getting momentum signals:', error);
            throw error;
        }
    }

    /**
     * Helper: Get market summary
     */
    private async getMarketSummary(market: any): Promise<MarketSummary> {
        try {
            const trades = await (market.marketType === 'spot' || !market.marketType
                ? injectiveDataService.getSpotTrades(market.marketId, 50)
                : injectiveDataService.getDerivativeTrades(market.marketId, 50));

            const prices = trades.map((t: any) => parseNumber(t.price));
            const currentPrice = prices[0] || 0;
            const oldPrice = prices[prices.length - 1] || currentPrice;
            const priceChange24h = calculatePercentageChange(oldPrice, currentPrice);

            const volume24h = trades.reduce((sum: number, t: any) => sum + parseNumber(t.quantity), 0);

            return {
                marketId: market.marketId,
                ticker: market.ticker,
                baseAsset: market.baseDenom || market.baseToken?.symbol || 'Unknown',
                quoteAsset: market.quoteDenom || market.quoteToken?.symbol || 'Unknown',
                currentPrice: currentPrice.toFixed(6),
                priceChange24h: parseFloat(priceChange24h.toFixed(2)),
                volume24h: volume24h.toFixed(2),
                marketType: market.marketType === 'derivative' ? 'derivative' : 'spot',
            };
        } catch (error) {
            // Return basic info if trades fail
            return {
                marketId: market.marketId,
                ticker: market.ticker,
                baseAsset: market.baseDenom || 'Unknown',
                quoteAsset: market.quoteDenom || 'Unknown',
                currentPrice: '0',
                priceChange24h: 0,
                volume24h: '0',
                marketType: market.marketType === 'derivative' ? 'derivative' : 'spot',
            };
        }
    }

    /**
     * Helper: Calculate market health score
     */
    private calculateMarketHealthScore(markets: MarketSummary[]): number {
        if (markets.length === 0) return 0;

        const avgVolume = markets.reduce((sum, m) => sum + parseNumber(m.volume24h), 0) / markets.length;
        const activeMarkets = markets.filter(m => parseNumber(m.volume24h) > 0).length;
        const activityRatio = activeMarkets / markets.length;

        // Simple health score: 0-100
        const score = Math.min(100, activityRatio * 100);
        return Math.round(score);
    }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
