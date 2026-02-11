# Injective Market Intelligence API

> A developer-friendly REST API providing market analytics, trading signals, and risk metrics for Injective blockchain

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Injective](https://img.shields.io/badge/Injective-SDK-green.svg)](https://injective.com/)

## 🎯 Overview

The **Injective Market Intelligence API** is a computation and derived data API built for the [Ninja API Forge](https://hackquest.io/en/hackathons/ninja-api-forge) hackathon. Instead of providing raw blockchain data, this API delivers **pre-computed market insights** that developers can immediately use to build trading bots, analytics dashboards, and DeFi applications.

### Why This API?

- **⚡ Pre-computed Metrics** - Get instant volatility, liquidity, and momentum scores without processing raw data
- **📊 Market Intelligence** - Access trading signals and risk analysis across all Injective markets
- **🚀 Developer-First** - Clean REST endpoints with consistent JSON responses
- **💾 Performance Optimized** - Built-in caching for sub-second response times
- **🔧 Easy Integration** - Simple HTTP requests, no blockchain knowledge required

## 🌟 Features

### Market Analytics
- **Market Overview** - Aggregated statistics across all Injective markets
- **Detailed Analytics** - Price stats, volume metrics, liquidity scores, volatility indices
- **Orderbook Depth** - Simplified orderbook visualization with spread analysis

### Trading Signals
- **Momentum Signals** - Identify markets with strong price and volume momentum
- **Liquidity Opportunities** - Find markets with high liquidity and tight spreads
- **Volatility Alerts** - Track markets experiencing unusual volatility

### Developer Utilities
- **Cache Status** - Monitor API health and data freshness
- **Market Search** - Find markets by name, ticker, or ID

## 📋 API Endpoints

### Markets

#### `GET /api/v1/markets/overview`
Get aggregated overview of all Injective markets.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalMarkets": 156,
    "totalVolume24h": "12500000.00",
    "topGainers": [...],
    "topLosers": [...],
    "marketHealthScore": 85
  },
  "timestamp": 1707654321000
}
```

#### `GET /api/v1/markets/:marketId/analytics`
Get detailed analytics for a specific market.

**Query Parameters:**
- `type` (optional): `spot` or `derivative` (default: `spot`)

**Example:**
```bash
curl http://localhost:3000/api/v1/markets/0x01edfab47f124748dc89998eb33144af734484ba07099014594321729a0ca16b/analytics?type=spot
```

**Response:**
```json
{
  "success": true,
  "data": {
    "marketId": "0x01edfab...",
    "ticker": "INJ/USDT",
    "priceStats": {
      "current": "25.450000",
      "high24h": "26.100000",
      "low24h": "24.800000",
      "change24h": 0.65,
      "changePercent24h": 2.62
    },
    "volumeMetrics": {
      "volume24h": "1250000.00",
      "volumeTrend": "increasing"
    },
    "liquidityScore": 78.5,
    "volatilityIndex": 3.42
  },
  "timestamp": 1707654321000
}
```

#### `GET /api/v1/markets/:marketId/orderbook-depth`
Get orderbook depth analysis for a market.

**Query Parameters:**
- `type` (optional): `spot` or `derivative` (default: `spot`)

**Response:**
```json
{
  "success": true,
  "data": {
    "marketId": "0x01edfab...",
    "ticker": "INJ/USDT",
    "spread": "0.010000",
    "spreadPercent": 0.0393,
    "bidDepth": [
      { "price": "25.440000", "quantity": "100.0000", "total": "2544.00" },
      ...
    ],
    "askDepth": [
      { "price": "25.450000", "quantity": "95.0000", "total": "2417.75" },
      ...
    ],
    "liquidityConcentration": 15.2
  },
  "timestamp": 1707654321000
}
```

### Signals

#### `GET /api/v1/signals/momentum`
Get momentum signals across markets.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "marketId": "0x01edfab...",
      "ticker": "INJ/USDT",
      "momentumScore": 8.5,
      "priceChange24h": 2.62,
      "volumeChange24h": 15.3,
      "signal": "buy"
    },
    ...
  ],
  "timestamp": 1707654321000
}
```

### Utilities

#### `GET /api/v1/cache/status`
Get cache status and API health.

**Response:**
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "lastUpdate": 1707654321000,
    "cacheHitRate": 78.5,
    "uptime": 3600,
    "entries": 42
  },
  "timestamp": 1707654321000
}
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/injective-market-intelligence-api.git
cd injective-market-intelligence-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` if needed (defaults work for mainnet).

4. **Run the API**
```bash
# Development mode with auto-reload
npm run dev

# Production build
npm run build
npm start
```

The API will be available at `http://localhost:3000`

### Test the API

```bash
# Get market overview
curl http://localhost:3000/api/v1/markets/overview

# Get cache status
curl http://localhost:3000/api/v1/cache/status

# Get momentum signals
curl http://localhost:3000/api/v1/signals/momentum
```

## 🔧 Configuration

Environment variables (`.env`):

```env
# Server
PORT=3000
NODE_ENV=development

# Injective Network
INJECTIVE_NETWORK=mainnet  # or testnet

# Injective Endpoints (Mainnet)
INDEXER_GRPC_ENDPOINT=https://sentry.exchange.grpc-web.injective.network:443
CHAIN_GRPC_ENDPOINT=https://sentry.chain.grpc-web.injective.network:443

# Cache
CACHE_TTL_SECONDS=30
ENABLE_CACHE=true

# Rate Limiting (optional)
RATE_LIMIT_ENABLED=false
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

## 📊 Injective Data Sources Used

This API integrates with the following Injective infrastructure:

1. **Indexer API** - Market data, orderbooks, and trade history
   - Endpoint: `https://sentry.exchange.grpc-web.injective.network:443`
   - Used for: Fetching markets, orderbooks, and recent trades

2. **Chain API** - Blockchain state queries
   - Endpoint: `https://sentry.chain.grpc-web.injective.network:443`
   - Used for: Network information and validation

3. **Official SDK** - `@injectivelabs/sdk-ts`
   - Provides typed interfaces for all Injective data
   - Handles gRPC communication and data transformation

## 🏗️ Architecture

```
┌─────────────────┐
│   REST API      │  ← Express.js with TypeScript
│  (Express.js)   │
└────────┬────────┘
         │
    ┌────▼────┐
    │  Cache  │     ← In-memory cache with TTL
    │ (Memory)│
    └────┬────┘
         │
┌────────▼─────────────┐
│  Analytics Engine    │  ← Computes metrics
│  (TypeScript)        │
└────────┬─────────────┘
         │
┌────────▼──────────────┐
│ Injective SDK Client  │  ← Official SDK
│  (@injectivelabs)     │
└────────┬──────────────┘
         │
┌────────▼──────────────┐
│ Injective Indexer API │  ← Blockchain data
└───────────────────────┘
```

## 📁 Project Structure

```
injective-market-intelligence-api/
├── src/
│   ├── server.ts                    # Express app entry point
│   ├── config/
│   │   └── injective.config.ts      # Environment configuration
│   ├── routes/
│   │   ├── markets.routes.ts        # Market endpoints
│   │   ├── signals.routes.ts        # Signal endpoints
│   │   └── utils.routes.ts          # Utility endpoints
│   ├── services/
│   │   ├── injective-data.service.ts  # Injective API client
│   │   ├── analytics.service.ts       # Analytics engine
│   │   └── cache.service.ts           # Cache manager
│   ├── types/
│   │   └── api.types.ts             # TypeScript interfaces
│   └── utils/
│       └── calculations.ts          # Math utilities
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🧪 Testing

```bash
# Run tests (coming soon)
npm test

# Manual testing with curl
curl http://localhost:3000/api/v1/markets/overview
```

## 🎯 Use Cases

### For Trading Bot Developers
```typescript
// Get markets with strong momentum
const response = await fetch('http://localhost:3000/api/v1/signals/momentum');
const { data } = await response.json();

// Filter for strong buy signals
const buySignals = data.filter(s => s.signal === 'strong_buy');
```

### For Analytics Dashboards
```typescript
// Get market overview for dashboard
const overview = await fetch('http://localhost:3000/api/v1/markets/overview');
const { data } = await overview.json();

// Display top gainers and losers
console.log('Top Gainers:', data.topGainers);
console.log('Top Losers:', data.topLosers);
```

### For Risk Management Tools
```typescript
// Monitor volatility across markets
const analytics = await fetch(`http://localhost:3000/api/v1/markets/${marketId}/analytics`);
const { data } = await analytics.json();

// Alert if volatility is too high
if (data.volatilityIndex > 10) {
  console.warn('High volatility detected!');
}
```

## 🚧 Roadmap

- [ ] WebSocket support for real-time updates
- [ ] Historical data endpoints
- [ ] Advanced risk metrics (VaR, correlation analysis)
- [ ] Multi-market comparison endpoints
- [ ] Rate limiting implementation
- [ ] API key authentication
- [ ] Docker containerization

## 🤝 Contributing

This project was built for the Ninja API Forge hackathon. Contributions, issues, and feature requests are welcome!

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built for [Ninja API Forge](https://hackquest.io/en/hackathons/ninja-api-forge) hackathon
- Powered by [Injective Protocol](https://injective.com/)
- Uses [@injectivelabs/sdk-ts](https://github.com/InjectiveLabs/injective-ts)

## 📞 Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Twitter: [@yourhandle](https://twitter.com/yourhandle)

---

**Built with ❤️ for the Injective ecosystem**
