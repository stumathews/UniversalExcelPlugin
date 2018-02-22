import { AlertModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
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
import {PortfolioComponent} from './Views/Portfolio/portfolio';
import {PortfolioDetailComponent} from './Views/Portfolio/portfolio.detail';
import {TradeComponent} from './Views/Trade/trade';
import {HoldingComponent} from './Views/Holding/holding';
import { PortfolioGroupComponent} from './Views/PortfolioGroup/portfolio-group';
import {PropertyTypeComponent} from './Views/PropertyType/property-type';
import {ListTradesComponent } from './Views/Shared/list-trades';
//import {ListPropertiesComponent} from './Views/Shared/list-properties';
import {ListHoldingsComponent as ListGroupsComponent} from './Views/Shared/list-holdings';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { InlineEditorModule } from '@qontu/ngx-inline-editor';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { BreadcrumbsComponent } from './BreadCrumbs'
import { ProgressbarModule } from 'ngx-bootstrap';
import { SecurityComponent } from './Views/Security/security'
import {PropertyComponent} from './Views/Property/property.component';
import { ReferencePortfolioComponent } from './Views/ReferencePortfolio/reference-portfolio.component';
import {SharedStateService} from './shared/shared-state.service';


const appRoutes: Routes = [
  { path: 'ReferencePortfolio', component:  ReferencePortfolioComponent},
  { path: 'PortfolioGroup', component: PortfolioGroupComponent },
  { path: 'Security', component: SecurityComponent},
  { path: 'PropertyTypes', component: PropertyTypeComponent },
  { path: 'Property/:domain', component: PropertyComponent },
  { path: 'layout', data: { breadcrumb: 'layout' }, component: LayoutComponent },
  { path: 'selection-tests', data: { breadcrumb: 'selection' },component: SelectionTestComponent },
  { path: 'home', data: { breadcrumb: 'Home' }, component: HomeComponent, children: [] },
  { path: 'portfolios', data: { breadcrumb: 'portfolios' }, component: PortfoliosComponent, canActivate: [AuthGuard], children: [
      { path: '', data: { breadcrumb: 'All Portfolios' }, component: PortfolioComponent },
      { path: 'Portfolios', data: { breadcrumb: 'All Portfolios' }, component: PortfolioComponent },
      { path: 'PortfolioDetails/:id', data: { breadcrumb: 'Portfolios Details' }, component: PortfolioDetailComponent } ]
  },
  { path: 'Trades/:id', data: { breadcrumb: 'Portfolios Trades' }, component: TradeComponent },
  { path: 'Holdings/:id', data: { breadcrumb: 'Portfolios Holdings' }, component: HoldingComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  declarations: [
    AppComponent, HomeComponent, PortfoliosComponent, LayoutComponent, SelectionTestComponent,
    PortfolioComponent, TradeComponent, HoldingComponent, PortfolioGroupComponent, PropertyTypeComponent,
    PortfolioDetailComponent, ListTradesComponent,
    ListGroupsComponent, BreadcrumbsComponent, PropertyComponent,
    SecurityComponent, ReferencePortfolioComponent
  ],
  imports: [
    BsDatepickerModule.forRoot(),
    BrowserModule, HttpClientModule, RouterModule.forRoot(
      appRoutes,
      {
        // enableTracing: true, // <-- debugging purposes only
        useHash: true, // Required for excel add-in interaction
        initialNavigation: false // <- turn off the initial redirect, used for redirect or hash routing strategy
      }
    ),
    OAuthModule.forRoot(), FormsModule, ReactiveFormsModule, CollapseModule.forRoot(), BsDropdownModule.forRoot(),
    TabsModule.forRoot(), AlertModule.forRoot(), ModalModule.forRoot(), InlineEditorModule, Angular2FontawesomeModule, ProgressbarModule.forRoot()
  ],
  providers: [
    { provide: ErrorHandler,  useClass: CustomErrorHandler } ,
    SharedStateService,
    ApiService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: MyFirstInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
