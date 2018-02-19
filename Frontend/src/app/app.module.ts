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
import {FactorDetailsComponent} from './Views/Trade/factor-details';
import {HoldingComponent} from './Views/Holding/holding';
import {GroupDetailsComponent} from './Views/Holding/group-details';
import { PortfolioGroupComponent} from './Views/PortfolioGroup/portfolio-group';
import {RiskDetailsComponent} from './Views/PortfolioGroup/risk-details';
import {PropertyTypeComponent} from './Views/PropertyType/property-type';
import { RegionDetailsComponent } from './Views/PropertyType/region-details';
import {NewInvestmentComponent} from './Views/Portfolio/new-investment';
import {NewFactorComponent} from './Views/Trade/new-factor';
import {NewGroupComponent} from './Views/Holding/new-group';
import { NewRegionComponent } from './Views/PropertyType/new-region';
import {NewRiskComponent} from './Views/PortfolioGroup/new-risk';
import {NewInvestmentWizardComponent} from './Views/Portfolio/new-investment-wizard';
import {SelectFactorsComponent} from './Views/Portfolio/select-factors';
import {SelectRisksComponent} from './Views/Portfolio/select-risks';
import {SelectGroupsComponent} from './Views/Portfolio/select-groups';
import {SelectRegionsComponent} from './Views/Portfolio/select-regions';
import {SummaryOfNewInvestmentComponent} from './Views/Portfolio/summary-of-new-investment';
import {AssociateFactorsComponent} from './Views/Portfolio/associate-factors';
import {AssociateRisksComponent} from './Views/Portfolio/associate-risks';
import {AssociateGroupsComponent} from './Views/Portfolio/associate-groups';
import {AssociateRegionsComponent} from './Views/Portfolio/associate-regions';
import {NewInvestmentNoteComponent} from './Views/Security/new-note';
import {SideNavComponent} from './Views/Shared/side-nav';
import {ListRiskComponent} from './Views/Shared/list-risks';
import {ListTradesComponent as ListFactorsComponent} from './Views/Shared/list-trades';
import {ListGroupsViaGroupLinksComponent} from './Views/Shared/list-groups-via-grouplinks';
import {ListPropertiesComponent} from './Views/Shared/list-properties';
import {ListInvestmentsComponent} from './Views/Shared/list-investments';
import {SelectItemsComponent} from './Views/Portfolio/select-items';
import {ListHoldingsComponent as ListGroupsComponent} from './Views/Shared/list-holdings';
import {ListNotesComponent} from './Views/Shared/list-notes';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { InlineEditorModule } from '@qontu/ngx-inline-editor';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import {InvestmentService} from './investment.service';
import { BreadcrumbsComponent } from './BreadCrumbs'
import { ProgressbarModule } from 'ngx-bootstrap';
import { SecurityComponent } from './Views/Security/security'
import {PropertyComponent} from './Views/Property/property.component';

const appRoutes: Routes = [

  { path: 'PortfolioGroup', component: PortfolioGroupComponent },
  { path: 'Security', component: SecurityComponent},
  { path: 'RiskDetails/:id', component: RiskDetailsComponent },
  { path: 'PropertyTypes', component: PropertyTypeComponent },
  { path: 'Property/:domain', component: PropertyComponent },
  { path: 'RegionDetails/:id', component: RegionDetailsComponent },
  { path: 'NewInvestment', component: NewInvestmentComponent },
  { path: 'NewFactor', component: NewFactorComponent },
  { path: 'NewGroup', component: NewGroupComponent },
  { path: 'NewRegion', component: NewRegionComponent },
  { path: 'NewRisk', component: NewRiskComponent },
  {
    path: 'NewInvestmentWizard', component: NewInvestmentWizardComponent, data: { breadcrumb: 'NewInvestmentWizard' },
    children: [
      { path: 'NewInvestment', data: { breadcrumb: '1' },component: NewInvestmentComponent, outlet: 'NewInvestmentWizardOutlet' },
      { path: 'SelectFactors', data: { breadcrumb: '2' },component: SelectFactorsComponent, outlet: 'NewInvestmentWizardOutlet' },
      { path: 'SelectRisks', component: SelectRisksComponent, outlet: 'NewInvestmentWizardOutlet' },
      { path: 'SelectGroups', component: SelectGroupsComponent, outlet: 'NewInvestmentWizardOutlet' },
      { path: 'SelectRegions', component: SelectRegionsComponent, outlet: 'NewInvestmentWizardOutlet' },
      { path: 'SummaryOfNewInvestment', component: SummaryOfNewInvestmentComponent, outlet: 'NewInvestmentWizardOutlet' }
    ]
  },
  { path: 'AssociateFactors/:id', component: AssociateFactorsComponent },
  { path: 'AssociateRisks/:id', component: AssociateRisksComponent },
  { path: 'AssociateGroups/:id', component: AssociateGroupsComponent },
  { path: 'AssociateRegions/:id', component: AssociateRegionsComponent },
  { path: 'NewNote/:owningEntityType/:owningEntityId', component: NewInvestmentNoteComponent },
  { path: 'layout', data: { breadcrumb: 'layout' }, component: LayoutComponent },
  { path: 'selection-tests', data: { breadcrumb: 'selection' },component: SelectionTestComponent },
  { path: 'home', data: { breadcrumb: 'Home' }, component: HomeComponent, children: [] },
  { path: 'portfolios', data: { breadcrumb: 'portfolios' }, component: PortfoliosComponent, canActivate: [AuthGuard], children: [
      { path: '', data: { breadcrumb: 'All Portfolios' }, component: PortfolioComponent },
      { path: 'Portfolios', data: { breadcrumb: 'All Portfolios' }, component: PortfolioComponent },
      { path: 'PortfolioDetails/:id', data: { breadcrumb: 'Portfolios Details' }, component: PortfolioDetailComponent } ]
  },
  { path: 'Trades/:id', data: { breadcrumb: 'Portfolios Trades' }, component: TradeComponent },
  { path: 'TradeDetails/:id', component: FactorDetailsComponent },
  { path: 'Holdings/:id', data: { breadcrumb: 'Portfolios Holdings' }, component: HoldingComponent },
  { path: 'GroupDetails/:id', component: GroupDetailsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  declarations: [AppComponent, HomeComponent, PortfoliosComponent, LayoutComponent, SelectionTestComponent,
    SideNavComponent, PortfolioComponent,
    TradeComponent, HoldingComponent, PortfolioGroupComponent, PropertyTypeComponent, PortfolioDetailComponent,
    ListRiskComponent, ListFactorsComponent, ListGroupsViaGroupLinksComponent, ListPropertiesComponent,
    FactorDetailsComponent, GroupDetailsComponent, RegionDetailsComponent, ListInvestmentsComponent,
    RiskDetailsComponent, NewInvestmentComponent, NewFactorComponent, NewGroupComponent,
    NewRegionComponent, NewRiskComponent, SelectItemsComponent, SelectFactorsComponent,
    NewInvestmentWizardComponent, SelectRisksComponent, SelectGroupsComponent, SelectRegionsComponent,
    SummaryOfNewInvestmentComponent, AssociateFactorsComponent, AssociateRisksComponent,
    AssociateGroupsComponent, AssociateRegionsComponent, ListGroupsComponent,
    ListNotesComponent, NewInvestmentNoteComponent, BreadcrumbsComponent, PropertyComponent,
    SecurityComponent],
  imports: [BsDatepickerModule.forRoot(),
    BrowserModule, HttpClientModule, RouterModule.forRoot(
      appRoutes,
      {
        // enableTracing: true, // <-- debugging purposes only
        useHash: true, // Required for excel add-in interaction
        initialNavigation: false // <- turn off the initial redirect, used for redirect or hash routing strategy
      }
    ),
    OAuthModule.forRoot(), FormsModule, ReactiveFormsModule, CollapseModule.forRoot(), BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    AlertModule.forRoot(), ModalModule.forRoot(), InlineEditorModule, Angular2FontawesomeModule, ProgressbarModule.forRoot()
  ],
  providers: [{ provide: ErrorHandler,  useClass: CustomErrorHandler }
, ApiService, InvestmentService, AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: MyFirstInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
