// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: number;
}

// Market Types
export interface MarketOverview {
    totalMarkets: number;
    totalVolume24h: string;
    topGainers: MarketSummary[];
    topLosers: MarketSummary[];
    marketHealthScore: number;
}

export interface MarketSummary {
    marketId: string;
    ticker: string;
    baseAsset: string;
    quoteAsset: string;
    currentPrice: string;
    priceChange24h: number;
    volume24h: string;
    marketType: 'spot' | 'derivative';
}

export interface MarketAnalytics {
    marketId: string;
    ticker: string;
    priceStats: {
        current: string;
        high24h: string;
        low24h: string;
        change24h: number;
        changePercent24h: number;
    };
    volumeMetrics: {
        volume24h: string;
        volumeTrend: 'increasing' | 'decreasing' | 'stable';
    };
    liquidityScore: number;
    volatilityIndex: number;
}

export interface OrderbookDepth {
    marketId: string;
    ticker: string;
    spread: string;
    spreadPercent: number;
    bidDepth: PriceLevel[];
    askDepth: PriceLevel[];
    liquidityConcentration: number;
}

export interface PriceLevel {
    price: string;
    quantity: string;
    total: string;
}

// Trading Signal Types
export interface MomentumSignal {
    marketId: string;
    ticker: string;
    momentumScore: number;
    priceChange24h: number;
    volumeChange24h: number;
    signal: 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell';
}

export interface LiquidityOpportunity {
    marketId: string;
    ticker: string;
    liquidityScore: number;
    spread: string;
    spreadPercent: number;
    estimatedSlippage: number;
}

export interface VolatilityAlert {
    marketId: string;
    ticker: string;
    volatilityIndex: number;
    riskLevel: 'low' | 'medium' | 'high' | 'extreme';
    priceDeviation: number;
}

// Risk Analysis Types
export interface MarketHealth {
    overallScore: number;
    totalLiquidity: string;
    activeMarkets: number;
    tradingActivityTrend: 'increasing' | 'decreasing' | 'stable';
    marketDiversityScore: number;
}

export interface ConcentrationRisk {
    volumeConcentration: {
        topMarketShare: number;
        top3MarketShare: number;
        top10MarketShare: number;
    };
    concentrationRatio: number;
    riskLevel: 'low' | 'medium' | 'high';
    dominantMarkets: MarketSummary[];
}

// Cache Types
export interface CacheStatus {
    enabled: boolean;
    lastUpdate: number;
    cacheHitRate: number;
    uptime: number;
}

// Injective SDK Types (simplified)
export interface InjectiveMarket {
    marketId: string;
    ticker: string;
    baseDenom: string;
    quoteDenom: string;
    marketType: string;
}

export interface InjectiveTrade {
    price: string;
    quantity: string;
    timestamp: number;
}
