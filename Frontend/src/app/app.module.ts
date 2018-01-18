// app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  OktaAuthModule,
  OktaCallbackComponent,
  OktaAuthGuard
} from '@okta/okta-angular';

import { AppComponent } from './app.component';
import { ProtectedComponent } from './protected.component';
import { LoginComponent } from './login.component';

const config = {
  issuer: 'https://lusid.okta.com/oauth2/default',
  redirectUri: 'https://localhost.finbourne:4200/implicit/callback',
  clientId: '0oa5ao43cLgHp80RG2p6'
};

export function onAuthRequired({ oktaAuth, router }) {
  // Redirect the user to your custom login page
  router.navigate(['/login']);
}

const appRoutes: Routes = [
  {
    path: 'implicit/callback',
    component: OktaCallbackComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [ OktaAuthGuard ],
    data: {
      onAuthRequired
    }
  }
]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProtectedComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    OktaAuthModule.initAuth(config)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }