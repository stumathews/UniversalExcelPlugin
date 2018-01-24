import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { OverviewComponent } from './overview/overview.component';
import { AuthGuard } from './shared';
import { RouterModule, Routes } from '@angular/router';
import { PortfoliosComponent } from './portfolios/portfolios.component';
import { ApiService } from './apiService';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyFirstInterceptor } from './UrlInterceptor';
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
 
  { path: 'overview', component: OverviewComponent },
  { path: 'portfolios', component: PortfoliosComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/overview', pathMatch: 'full' },
  { path: '**', redirectTo: 'overview' }
  
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
        enableTracing: true, useHash: true,
        initialNavigation: false // <- turn off the initial redirect, used for redirect or hash routing strategy
      } // <-- debugging purposes only
    ),
    OAuthModule.forRoot()
  ],
  providers: [ApiService, AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: MyFirstInterceptor, multi: true }
  ]
  ,
  bootstrap: [AppComponent]
})
export class AppModule { }
