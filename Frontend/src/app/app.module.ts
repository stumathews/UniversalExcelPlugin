import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Okta } from './shared/okta.service';
import { OverviewComponent } from './overview/overview.component';

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
  { path: 'portfolios', component: PortfoliosComponent }
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
        useHash: true
      } // <-- debugging purposes only
    )
  ],
  providers: [Okta, UserService, ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyFirstInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
