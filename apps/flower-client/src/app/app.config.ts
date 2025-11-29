import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { authInterceptor } from './features/auth/interceptors/auth.interceptor';
import { cacheInterceptor } from './shared/interceptors/cache.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Order matters: cache interceptor should be first, then auth
    provideHttpClient(withInterceptors([cacheInterceptor, authInterceptor])),
    provideAnimations(),
  ]
};
