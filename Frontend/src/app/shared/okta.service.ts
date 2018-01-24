import { Injectable } from '@angular/core';
import * as OktaSignIn from '@okta/okta-signin-widget';

@Injectable()
export class Okta {
  widget;

  constructor() {
    this.widget = new OktaSignIn({
      baseUrl: 'https://lusid.okta.com',
      clientId: 'aus5a776yendDqtEq2p6',
      redirectUri: 'https://localhost.finbourne.com:4200',
      authParams: {
        issuer: 'https://lusid.okta.com/oauth2/default'
      }
    });
  }

  getWidget() {
    return this.widget;
  }
}
