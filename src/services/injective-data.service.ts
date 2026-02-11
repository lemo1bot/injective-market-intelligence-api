import { IndexerGrpcSpotApi, IndexerGrpcDerivativesApi, IndexerRestExplorerApi } from '@injectivelabs/sdk-ts';
import config from '../config/injective.config';

/**
 * Service for fetching data from Injective blockchain
 */
class InjectiveDataService {
    private spotApi: IndexerGrpcSpotApi;
    private derivativesApi: IndexerGrpcDerivativesApi;
    private explorerApi: IndexerRestExplorerApi;

    constructor() {
        const endpoint = config.injective.indexerGrpcEndpoint;

        this.spotApi = new IndexerGrpcSpotApi(endpoint);
        this.derivativesApi = new IndexerGrpcDerivativesApi(endpoint);
        this.explorerApi = new IndexerRestExplorerApi('https://sentry.lcd.injective.network');
    }

    /**
     * Fetch all spot markets
     */
    async getSpotMarkets() {
        try {
            const { markets } = await this.spotApi.fetchMarkets();
            return markets;
        } catch (error) {
            console.error('Error fetching spot markets:', error);
            throw new Error('Failed to fetch spot markets');
        }
    }

    /**
     * Fetch all derivative markets
     */
    async getDerivativeMarkets() {
        try {
            const { markets } = await this.derivativesApi.fetchMarkets();
            return markets;
        } catch (error) {
            console.error('Error fetching derivative markets:', error);
            throw new Error('Failed to fetch derivative markets');
        }
    }

    /**
     * Fetch spot market by ID
     */
    async getSpotMarket(marketId: string) {
        try {
            const market = await this.spotApi.fetchMarket(marketId);
            return market;
        } catch (error) {
            console.error(`Error fetching spot market ${marketId}:`, error);
            throw new Error(`Failed to fetch spot market ${marketId}`);
        }
    }

    /**
     * Fetch derivative market by ID
     */
    async getDerivativeMarket(marketId: string) {
        try {
            const market = await this.derivativesApi.fetchMarket(marketId);
            return market;
        } catch (error) {
            console.error(`Error fetching derivative market ${marketId}:`, error);
            throw new Error(`Failed to fetch derivative market ${marketId}`);
        }
    }

    /**
     * Fetch orderbook for a spot market
     */
    async getSpotOrderbook(marketId: string) {
        try {
            const orderbook = await this.spotApi.fetchOrderbookV2(marketId);
            return orderbook;
        } catch (error) {
            console.error(`Error fetching spot orderbook for ${marketId}:`, error);
            throw new Error(`Failed to fetch spot orderbook for ${marketId}`);
        }
    }

    /**
     * Fetch orderbook for a derivative market
     */
    async getDerivativeOrderbook(marketId: string) {
        try {
            const orderbook = await this.derivativesApi.fetchOrderbookV2(marketId);
            return orderbook;
        } catch (error) {
            console.error(`Error fetching derivative orderbook for ${marketId}:`, error);
            throw new Error(`Failed to fetch derivative orderbook for ${marketId}`);
        }
    }

    /**
     * Fetch recent trades for a spot market
     */
    async getSpotTrades(marketId: string, limit: number = 100) {
        try {
            const { trades } = await this.spotApi.fetchTrades({ marketIds: [marketId], limit });
            return trades;
        } catch (error) {
            console.error(`Error fetching spot trades for ${marketId}:`, error);
            throw new Error(`Failed to fetch spot trades for ${marketId}`);
        }
    }

    /**
     * Fetch recent trades for a derivative market
     */
    async getDerivativeTrades(marketId: string, limit: number = 100) {
        try {
            const { trades } = await this.derivativesApi.fetchTrades({ marketIds: [marketId], limit });
            return trades;
        } catch (error) {
            console.error(`Error fetching derivative trades for ${marketId}:`, error);
            throw new Error(`Failed to fetch derivative trades for ${marketId}`);
        }
    }
}

export const injectiveDataService = new InjectiveDataService();
export default injectiveDataService;
