/**
 * Calculate standard deviation
 */
export function calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;

    return Math.sqrt(variance);
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Calculate volatility index from price data
 */
export function calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0;

    const returns = [];
    for (let i = 1; i < prices.length; i++) {
        const returnValue = (prices[i] - prices[i - 1]) / prices[i - 1];
        returns.push(returnValue);
    }

    const stdDev = calculateStandardDeviation(returns);
    return stdDev * 100; // Convert to percentage
}

/**
 * Calculate liquidity score based on orderbook depth
 */
export function calculateLiquidityScore(
    bidDepth: number,
    askDepth: number,
    spread: number
): number {
    // Higher depth and lower spread = better liquidity
    const totalDepth = bidDepth + askDepth;
    const spreadPenalty = Math.max(0, 1 - (spread / 100));

    // Normalize to 0-100 scale
    const score = Math.min(100, (totalDepth / 10000) * spreadPenalty * 100);
    return Math.round(score * 10) / 10;
}

/**
 * Calculate momentum score
 */
export function calculateMomentumScore(
    priceChange: number,
    volumeChange: number
): number {
    // Combine price and volume changes
    const priceWeight = 0.6;
    const volumeWeight = 0.4;

    const score = (priceChange * priceWeight) + (volumeChange * volumeWeight);
    return Math.round(score * 10) / 10;
}

/**
 * Determine momentum signal
 */
export function getMomentumSignal(score: number): 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell' {
    if (score > 10) return 'strong_buy';
    if (score > 3) return 'buy';
    if (score < -10) return 'strong_sell';
    if (score < -3) return 'sell';
    return 'neutral';
}

/**
 * Determine risk level based on volatility
 */
export function getRiskLevel(volatility: number): 'low' | 'medium' | 'high' | 'extreme' {
    if (volatility < 2) return 'low';
    if (volatility < 5) return 'medium';
    if (volatility < 10) return 'high';
    return 'extreme';
}

/**
 * Calculate concentration ratio
 */
export function calculateConcentrationRatio(marketShares: number[]): number {
    const total = marketShares.reduce((sum, share) => sum + share, 0);
    if (total === 0) return 0;

    const sortedShares = marketShares.sort((a, b) => b - a);
    const top3Share = sortedShares.slice(0, 3).reduce((sum, share) => sum + share, 0);

    return (top3Share / total) * 100;
}

/**
 * Safe number parsing
 */
export function parseNumber(value: string | number): number {
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format large numbers
 */
export function formatNumber(value: number): string {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toFixed(2);
}
