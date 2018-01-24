import { Component, OnInit } from '@angular/core';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';

import { Router } from '@angular/router';
import * as OktaAuth from '@okta/okta-auth-js';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  constructor(private oauthService: OAuthService) {  }

  private authClient: any;

  explicitLogin(username: string, password: string): Promise<any> {
    this.authClient = new OktaAuth({
      url: 'https://lusid.okta.com',
      issuer: 'aus5al5yopbHW2wJn2p6'
    });

    return this.oauthService.createAndSaveNonce().then(nonce => {
      return this.authClient.signIn({
        username: username,
        password: password
      }).then((response) => {
        if (response.status === 'SUCCESS') {
          return this.authClient.token.getWithoutPrompt({
              clientId: this.oauthService.clientId,
              responseType: ['id_token', 'token'],
              scopes: ['openid', 'profile', 'email'],
              sessionToken: response.sessionToken,
              nonce: nonce,
              redirectUri: window.location.origin
            })
            .then((tokens) => {
              const idToken = tokens[0].idToken;
              const accessToken = tokens[1].accessToken;
              const keyValuePair = `#id_token=${encodeURIComponent(idToken)}&access_token=${encodeURIComponent(accessToken)}`;
              console.log('idToken:' + idToken + ' accessToken:' + accessToken + ' keyValuePair:' + keyValuePair);
              return this.oauthService.tryLogin({
                customHashFragment: keyValuePair,
                disableOAuth2StateCheck: true
              });
            });
        } else {
          return Promise.reject('We cannot handle the ' + response.status + ' status');
        }
      });
    });
  }

  login() {
    console.log('attempting to login...');
    this.oauthService.initImplicitFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  get LoggedIn() {
    return this.oauthService.hasValidIdToken();
  }

  ngOnInit() { }
}
