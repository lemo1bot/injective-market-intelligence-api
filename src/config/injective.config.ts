import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',

    injective: {
        network: process.env.INJECTIVE_NETWORK || 'mainnet',
        indexerGrpcEndpoint: process.env.INDEXER_GRPC_ENDPOINT || 'https://sentry.exchange.grpc-web.injective.network:443',
        chainGrpcEndpoint: process.env.CHAIN_GRPC_ENDPOINT || 'https://sentry.chain.grpc-web.injective.network:443',
    },

    cache: {
        ttlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '30', 10),
        enabled: process.env.ENABLE_CACHE === 'true',
    },

    rateLimit: {
        enabled: process.env.RATE_LIMIT_ENABLED === 'true',
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    },
};

export default config;
