/// <reference path='../node_modules/@types/office-js/index.d.ts' />

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { fabric } from 'office-ui-fabric/dist/js/jquery.fabric';



// This will exist via Office.js, dont rename. case is sensitive

if (environment.production) {
  enableProdMode();

}

Office.initialize = () => {
  platformBrowserDynamic().bootstrapModule(AppModule);
};
//platformBrowserDynamic().bootstrapModule(AppModule);
