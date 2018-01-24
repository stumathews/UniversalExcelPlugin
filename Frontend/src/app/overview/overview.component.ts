import { Component, OnInit } from '@angular/core';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';

import { Router } from '@angular/router';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  constructor(private oauthService: OAuthService) {  }

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

  ngOnInit() { }
}
