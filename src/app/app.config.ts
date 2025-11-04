/**
 * Arquivo de configuração da aplicação Angular.
 * Define os providers e configurações globais da aplicação, incluindo roteamento,
 * cliente HTTP, tratamento de erros globais e detecção de mudanças do Zone.js.
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};
