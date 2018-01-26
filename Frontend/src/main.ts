import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// This will exist via Office.js, dont rename. case is sensitive
declare const Office: any;

if (environment.production) {
  enableProdMode();
} 

Office.initialize = () => {
  platformBrowserDynamic().bootstrapModule(AppModule);
};
//platformBrowserDynamic().bootstrapModule(AppModule);
