import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

interface CacheEntry {
  response: HttpResponse<any>;
  timestamp: number;
}

// In-memory cache (simple approach - can be enhanced with IndexedDB for persistence)
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes default

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  // Don't cache auth endpoints
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  const cacheKey = req.urlWithParams;
  const cached = cache.get(cacheKey);

  // Return cached response if available and not expired
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return of(cached.response.clone());
  }

  // Make request and cache response
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cache.set(cacheKey, {
          response: event.clone(),
          timestamp: Date.now(),
        });
      }
    })
  );
};

// Export function to clear cache (useful for mutations)
export function clearCache(pattern?: string): void {
  if (!pattern) {
    cache.clear();
    return;
  }

  const regex = new RegExp(pattern);
  const keysToDelete: string[] = [];

  cache.forEach((_, key) => {
    if (regex.test(key)) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach(key => cache.delete(key));
}

