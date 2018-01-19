import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Okta } from './shared/okta.service';
import { UserService } from './UserService';

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

  constructor(private okta: Okta,
    private changeDetectorRef: ChangeDetectorRef,
    private currentUserService: UserService) {
    this.oktaSignIn = okta.getWidget();
  }

  showLogin() {
    this.oktaSignIn.renderEl({ el: '#okta-login-container' }, (response) => {
      if (response.status === 'SUCCESS') {
       // this.user = response.claims.email;
        this.user = 'test';
        this.currentUserService.user = this.user;
        this.currentUserService.token = response.access_token;
        console.log('response from okta was: ' + JSON.stringify(response));
        this.oktaSignIn.remove();
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  ngOnInit() {
    this.oktaSignIn.session.get((response) => {
      if (response.status !== 'INACTIVE') {
        this.user = response.login;
        this.changeDetectorRef.detectChanges();
      } else {
        this.showLogin();
      }
    });
  }

  logout() {
    this.oktaSignIn.signOut(() => {
      this.user = undefined;
      this.changeDetectorRef.detectChanges();
      this.showLogin();
    });
  }

  
}
