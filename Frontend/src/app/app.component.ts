import { Component, ChangeDetectorRef, OnInit } from '@angular/core';

import { UserService } from './UserService';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';

declare const Excel: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'app';
  user;
  oktaSignIn;

  navRoutes: Object[] = [
    { path: '/portfolios', title: 'Portfolios' },
    { path: '/overview', title: 'Overview' }];
  
  constructor(private oauthService: OAuthService,
    private currentUserService: UserService) {
    this.oauthService.redirectUri = window.location.origin;
    this.oauthService.clientId = '0oa5ao43cLgHp80RG2p6';// george given: '0oa5ao43cLgHp80RG2p6'; 
    this.oauthService.issuer = 'https://lusid.okta.com/oauth2/aus5a776yendDqtEq2p6'; //george given 'https://lusid.okta.com';
    
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();

    // Load Discovery Document and then try to login the user
    this.oauthService.loadDiscoveryDocument().then(() => {
      this.oauthService.tryLogin();
    });
  }

  login() {
    this.oauthService.initImplicitFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  get givenName() {
    
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) {      
      return null;
    }
    return claims['name'];
  }

  ngOnInit(): void { }
}
