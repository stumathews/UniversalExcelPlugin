import { Injectable } from '@angular/core';
import * as OktaSignIn from '@okta/okta-signin-widget';


const config = {
  issuer: 'https://lusid.okta.com/oauth2/aus5a776yendDqtEq2p6/v1/authorize',
  //issuer: 'https://lusid.okta.com/oauth2/default',
  redirectUri: 'https://localhost.finbourne.com:4200/implicit/callback',
  clientId: '0oa5ao43cLgHp80RG2p6'
}
//https://lusid.okta.com/oauth2/aus5a776yendDqtEq2p6/v1/authorize

@Injectable()
export class Okta {
  widget;

  constructor() {
    this.widget = new OktaSignIn({
      baseUrl: 'https://lusid.okta.com',
      //baseUrl: 'https://lusid.okta.com',
      clientId: '0oa5ao43cLgHp80RG2p6',
      redirectUri: 'https://localhost.finbourne.com:4200',
      authParams: {
        //issuer: 'aus5a776yendDqtEq2p6',
        responseType: 'token',
        issuer: 'https://lusid.okta.com/oauth2/aus5a776yendDqtEq2p6',
        authorizeUrl: 'https://lusid.okta.com/oauth2/aus5a776yendDqtEq2p6/v1/authorize',
        //realm : 'd667c43e-aba4-4751-a285-19ad93216ab0',
        state: 'oauth2',
        resource: '0oa5a36oym2o20xxY2p6'      ,
        scopes:['openid','client', 'groups']

      }
    });
  }

  getWidget() {
    return this.widget;
  }
}
