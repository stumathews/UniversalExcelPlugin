import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { OverviewComponent } from './overview/overview.component';
import { AuthGuard } from './shared';

import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { PortfoliosComponent } from './portfolios/portfolios.component';
import { ApiService } from './apiService';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyFirstInterceptor } from './UrlInterceptor';
import { UserService } from './UserService';
import { HttpClientModule } from '@angular/common/http';


const appRoutes: Routes = [
  { path: '', redirectTo: '/overview', pathMatch: 'full' },
  { path: 'overview', component: OverviewComponent },
  { path: 'portfolios', component: PortfoliosComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    PortfoliosComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: true,
      } // <-- debugging purposes only
    ),
    OAuthModule.forRoot()
  ],
  providers: [UserService, ApiService, AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyFirstInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
