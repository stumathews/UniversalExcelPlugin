import { Injectable, ErrorHandler } from '@angular/core';

@Injectable()
export class CustomErrorHandler extends ErrorHandler {
  constructor() { super(); }
  handleError(err) {
     console.log(`A muva fuken erra: ${err}, not throwing any further...`);
     //throw err;
  }
}
