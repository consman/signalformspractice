import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { AbsOrderService } from './abs-order-service';
import { environment } from '../environments/environment';
import { orderServiceFactory } from './orderServiceFactory';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(), 
    {provide: 'http', useValue: HttpClient}, 
    {provide: AbsOrderService, useFactory:(isProd: boolean)=> orderServiceFactory(isProd), deps: ['IS_PROD_ENVIRONMENT']},
    {provide: 'IS_PROD_ENVIRONMENT', useValue: environment.production}
  ]
};
