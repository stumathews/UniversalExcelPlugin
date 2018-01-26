import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import * as OktaAuth from '@okta/okta-auth-js';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginData } from '../Models/LoginData';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit
{
  form;
  constructor(private readonly oauthService: OAuthService) { }

  onSubmit(form: LoginData ) {
    this.explicitLogin(form.username, form.password);
  }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl('', [<any>Validators.required, <any>Validators.minLength(1)]),
      password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(1)]),
    });
  }

  private authClient: any;
  /**
   * Expplicit login routine. This is for the excel plugin under excel.
   * @param username 
   * @param password
   */
  explicitLogin(username: string, password: string): Promise<any> {
    console.log('explicitly logging in..');
    this.authClient = new OktaAuth({
      url: 'https://lusid.okta.com',
      issuer: 'aus5al5yopbHW2wJn2p6',
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
              redirectUri: window.location.origin,
            })
            .then((tokens) => {
              const idToken = tokens[0].idToken;
              const accessToken = tokens[1].accessToken;
              const keyValuePair = `#id_token=${encodeURIComponent(idToken)}&access_token=${encodeURIComponent(accessToken)}`;
              console.log(`idToken:${idToken} accessToken:${accessToken} keyValuePair:${keyValuePair}`);
              return this.oauthService.tryLogin({
                customHashFragment: keyValuePair,
                disableOAuth2StateCheck: true
              });
            });
        } else {
          return Promise.reject(`We cannot handle the ${response.status} status`);
        }
      });
    });
  }

  /**
   * Implicit login. Will redirect to and from identity provider
   */
  login()
  {
    console.log('attempting to do an implicit login...');
    this.oauthService.initImplicitFlow();
  }

  /**
   * Attempt to logout
   */
  logout() {
    this.oauthService.logOut();
  }

  /**
   * Indicator if we are logged in or not
   * @returns true if logged in, false otherwise 
   */
  get LoggedIn()
  {
    return this.oauthService.hasValidIdToken();
  }

  
}
