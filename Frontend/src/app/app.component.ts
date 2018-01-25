import { Component, OnInit } from '@angular/core';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

/**
 * AppComponent will attempt to automatically authenticate when the application is
 * first started. 
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  navRoutes: Object[] = [
    { path: '/portfolios', title: 'Portfolios' },
    { path: '/home', title: 'Home' }];

  ngOnInit(): void { }

  constructor(private readonly oauthService: OAuthService, private router: Router) {
    this.oauthService.redirectUri = window.location.origin;
    this.oauthService.clientId = '0oa5ao43cLgHp80RG2p6';
    this.oauthService.issuer = 'https://lusid.okta.com/oauth2/aus5al5yopbHW2wJn2p6';
    this.oauthService.responseType = 'token';
    this.oauthService.scope = 'openid email';

    this.oauthService.tokenValidationHandler = new JwksValidationHandler();

    // Load Discovery Document and then try to login the user
    this.oauthService.loadDiscoveryDocument().then(() => {
      this.oauthService.tryLogin().then(_ => { this.router.navigate(['/']); });
    });
  }
}
