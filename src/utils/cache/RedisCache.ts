import { createClient, RedisClientType } from 'redis';
import { PredictionModel, Prediction, AnalysisProgress } from '../prediction/types';

// Fallback in-memory cache
class MemoryCache {
  private cache: Map<string, any> = new Map();

  async set(key: string, value: any, expireInSeconds?: number): Promise<void> {
    this.cache.set(key, {
      value,
      expires: expireInSeconds ? Date.now() + (expireInSeconds * 1000) : null
    });
  }

  async get(key: string): Promise<any> {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (item.expires && Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (item.expires && Date.now() > item.expires) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return Array.from(this.cache.keys()).filter(key => regex.test(key));
  }
}

class RedisCache {
  private client: RedisClientType | null = null;
  private memoryCache: MemoryCache = new MemoryCache();
  private isConnected = false;
  private useMemoryFallback = false;

  constructor() {
    this.initializeConnection();
  }

  private async initializeConnection() {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.client = createClient({
        url: redisUrl,
        password: process.env.REDIS_PASSWORD,
        database: parseInt(process.env.REDIS_DB || '0'),
      });

      this.client.on('error', (err) => {
        console.warn('Redis Client Error, switching to memory cache:', err.message);
        this.isConnected = false;
        this.useMemoryFallback = true;
      });

      this.client.on('connect', () => {
        console.log('Redis Client Connected');
        this.isConnected = true;
        this.useMemoryFallback = false;
      });

      await this.client.connect();
    } catch (error) {
      console.warn('Failed to initialize Redis connection, using memory cache:', error);
      this.isConnected = false;
      this.useMemoryFallback = true;
    }
  }

  private async ensureConnection() {
    if (this.useMemoryFallback) {
      return; // Use memory cache
    }

    if (!this.client || !this.isConnected) {
      try {
        await this.initializeConnection();
      } catch (error) {
        console.warn('Failed to connect to Redis, using memory cache:', error);
        this.useMemoryFallback = true;
      }
    }
  }

  async storeModel(leagueId: number, seasonYear: number, model: PredictionModel): Promise<void> {
    try {
      await this.ensureConnection();
      
      const key = `model:${leagueId}:${seasonYear}`;
      const value = JSON.stringify(model);
      const ttl = parseInt(process.env.PREDICTION_CACHE_TTL || '3600');

      if (this.useMemoryFallback) {
        await this.memoryCache.set(key, value, ttl);
      } else if (this.client) {
        await this.client.setEx(key, ttl, value);
      }
    } catch (error) {
      console.error('Error storing model:', error);
      // Fallback to memory cache
      this.useMemoryFallback = true;
      const key = `model:${leagueId}:${seasonYear}`;
      const value = JSON.stringify(model);
      const ttl = parseInt(process.env.PREDICTION_CACHE_TTL || '3600');
      await this.memoryCache.set(key, value, ttl);
    }
  }

  async getModel(leagueId: number, seasonYear: number): Promise<PredictionModel | null> {
    try {
      await this.ensureConnection();
      
      const key = `model:${leagueId}:${seasonYear}`;
      let data: string | null = null;

      if (this.useMemoryFallback) {
        data = await this.memoryCache.get(key);
      } else if (this.client) {
        data = await this.client.get(key);
      }
      
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting model:', error);
      // Fallback to memory cache
      this.useMemoryFallback = true;
      const key = `model:${leagueId}:${seasonYear}`;
      const data = await this.memoryCache.get(key);
      return data ? JSON.parse(data) : null;
    }
  }

  async storePrediction(prediction: Prediction): Promise<void> {
    try {
      await this.ensureConnection();
      if (!this.client) return;

      const key = `prediction:${prediction.fixture_id}`;
      const ttl = parseInt(process.env.PREDICTION_CACHE_TTL || '3600');
      
      await this.client.setEx(key, ttl, JSON.stringify(prediction));
    } catch (error) {
      console.error('Error storing prediction in Redis:', error);
    }
  }

  async getPrediction(fixtureId: number): Promise<Prediction | null> {
    try {
      await this.ensureConnection();
      if (!this.client) return null;

      const key = `prediction:${fixtureId}`;
      const data = await this.client.get(key);
      
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting prediction from Redis:', error);
      return null;
    }
  }

  async storePredictions(predictions: Prediction[]): Promise<void> {
    try {
      await this.ensureConnection();
      if (!this.client) return;

      const pipeline = this.client.multi();
      const ttl = parseInt(process.env.PREDICTION_CACHE_TTL || '3600');
      
      predictions.forEach(prediction => {
        const key = `prediction:${prediction.fixture_id}`;
        pipeline.setEx(key, ttl, JSON.stringify(prediction));
      });
      
      await pipeline.exec();
    } catch (error) {
      console.error('Error storing predictions in Redis:', error);
    }
  }

  async getAllPredictions(leagueId: number, seasonYear: number): Promise<Prediction[]> {
    try {
      await this.ensureConnection();
      if (!this.client) return [];

      const pattern = `prediction:*`;
      const keys = await this.client.keys(pattern);
      
      if (keys.length === 0) return [];
      
      const values = await this.client.mGet(keys);
      const predictions: Prediction[] = [];
      
      values.forEach(value => {
        if (value) {
          try {
            const prediction = JSON.parse(value);
            predictions.push(prediction);
          } catch (error) {
            console.error('Error parsing prediction:', error);
          }
        }
      });
      
      return predictions;
    } catch (error) {
      console.error('Error getting all predictions from Redis:', error);
      return [];
    }
  }

  async invalidateCache(pattern: string): Promise<void> {
    try {
      await this.ensureConnection();
      if (!this.client) return;

      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      console.error('Error invalidating cache:', error);
    }
  }

  async storeAnalysisProgress(leagueId: number, seasonYear: number, progress: any): Promise<void> {
    try {
      await this.ensureConnection();
      if (!this.client) return;

      const key = `analysis_progress:${leagueId}:${seasonYear}`;
      await this.client.setEx(key, 300, JSON.stringify(progress)); // 5 minutes TTL
    } catch (error) {
      console.error('Error storing analysis progress:', error);
    }
  }

  async getAnalysisProgress(leagueId: number, seasonYear: number): Promise<any | null> {
    try {
      await this.ensureConnection();
      if (!this.client) return null;

      const key = `analysis_progress:${leagueId}:${seasonYear}`;
      const data = await this.client.get(key);
      
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting analysis progress:', error);
      return null;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.disconnect();
        this.isConnected = false;
      }
    } catch (error) {
      console.error('Error disconnecting Redis:', error);
    }
  }
}

// Singleton instance
export const redisCache = new RedisCache();
export default RedisCache;
