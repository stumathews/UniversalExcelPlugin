import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { OAuthEvent } from 'angular-oauth2-oidc';
import { RouterModule, Routes, Router } from '@angular/router';
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
  
  constructor(private oauthService: OAuthService, private router: Router) {
    this.oauthService.redirectUri = window.location.origin;
    this.oauthService.clientId = '0oa5ao43cLgHp80RG2p6';// george given: '0oa5ao43cLgHp80RG2p6'; 
    this.oauthService.issuer = 'https://lusid.okta.com/oauth2/aus5al5yopbHW2wJn2p6'; //george given 'https://lusid.okta.com';
    this.oauthService.responseType = 'token';
    this.oauthService.scope = 'openid email';
    
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();

    // Load Discovery Document and then try to login the user
    this.oauthService.loadDiscoveryDocument().then(() => {
      this.oauthService.tryLogin().then(_ => { this.router.navigate(['/']); });
    });
    
  }

  

  ngOnInit(): void { }
}
