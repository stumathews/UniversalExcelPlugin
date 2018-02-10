import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './shared';
import { RouterModule, Routes } from '@angular/router';
import { PortfoliosComponent } from './portfolios/portfolios.component';
import { ApiService } from './apiService';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UrlInterceptor as MyFirstInterceptor } from './UrlInterceptor';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { LayoutComponent } from './layout/layout.component';
import { SelectionTestComponent } from './selection-test/selection-test.component';
import { CollapseModule, BsDropdownModule } from 'ngx-bootstrap';
import { CustomErrorHandler } from './ErrorCatcher';

const appRoutes: Routes = [
  { path: 'layout', component: LayoutComponent },
  { path: 'selection-tests', component: SelectionTestComponent },
  { path: 'home', component: HomeComponent },
  { path: 'portfolios', component: PortfoliosComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
  
];

@NgModule({
  declarations: [ AppComponent, HomeComponent, PortfoliosComponent, LayoutComponent, SelectionTestComponent ],
  imports: [BsDatepickerModule.forRoot(),
    BrowserModule, HttpClientModule, RouterModule.forRoot(
      appRoutes,
      {
        //enableTracing: true, // <-- debugging purposes only
        useHash: true, // Required for excel add-in interaction
        initialNavigation: false // <- turn off the initial redirect, used for redirect or hash routing strategy
      }
    ),
    OAuthModule.forRoot(), FormsModule, ReactiveFormsModule,  CollapseModule.forRoot(), BsDropdownModule.forRoot()
  ],
  providers: [{ provide: ErrorHandler,  useClass: CustomErrorHandler }
, ApiService, AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: MyFirstInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
