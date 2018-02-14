/// <reference path='../node_modules/@types/office-js/index.d.ts' />

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// if (environment.production) {
//   enableProdMode();
// }
var bootstrapped = false;
  Office.initialize = () => {
    platformBrowserDynamic().bootstrapModule(AppModule);
    bootstrapped = true;
};
if (!bootstrapped) {
  platformBrowserDynamic().bootstrapModule(AppModule);
}
