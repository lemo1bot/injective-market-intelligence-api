/**
 * Simple in-memory cache implementation
 */
class CacheService {
    private cache: Map<string, { data: any; timestamp: number }> = new Map();
    private ttlSeconds: number;
    private enabled: boolean;
    private hits: number = 0;
    private misses: number = 0;
    private startTime: number = Date.now();

    constructor(ttlSeconds: number = 30, enabled: boolean = true) {
        this.ttlSeconds = ttlSeconds;
        this.enabled = enabled;
    }

    set(key: string, data: any): void {
        if (!this.enabled) return;

        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }

    get<T>(key: string): T | null {
        if (!this.enabled) {
            this.misses++;
            return null;
        }

        const cached = this.cache.get(key);

        if (!cached) {
            this.misses++;
            return null;
        }

        const age = (Date.now() - cached.timestamp) / 1000;

        if (age > this.ttlSeconds) {
            this.cache.delete(key);
            this.misses++;
            return null;
        }

        this.hits++;
        return cached.data as T;
    }

    clear(): void {
        this.cache.clear();
    }

    getStatus() {
        const total = this.hits + this.misses;
        return {
            enabled: this.enabled,
            lastUpdate: Date.now(),
            cacheHitRate: total > 0 ? (this.hits / total) * 100 : 0,
            uptime: Math.floor((Date.now() - this.startTime) / 1000),
            entries: this.cache.size,
        };
    }
}

export const cacheService = new CacheService(30, true);
export default cacheService;
