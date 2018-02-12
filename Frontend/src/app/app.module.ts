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
import {InvestmentComponent} from './Views/Investment/investment';
import {InvestmentDetailComponent} from './Views/Investment/investment.detail';
import {FactorComponent} from './Views/Factor/factor';
import {FactorDetailsComponent} from './Views/Factor/factor-details';
import {GroupComponent} from './Views/Group/group';
import {GroupDetailsComponent} from './Views/Group/group-details';
import {RiskComponent} from './Views/Risk/risk';
import {RiskDetailsComponent} from './Views/Risk/risk-details';
import {RegionComponent} from './Views/Region/region';
import {RegionDetailsComponent} from './Views/Region/region-details';
import {NewInvestmentComponent} from './Views/Investment/new-investment';
import {NewFactorComponent} from './Views/Factor/new-factor';
import {NewGroupComponent} from './Views/Group/new-group';
import {NewRegionComponent} from './Views/Region/new-region';
import {NewRiskComponent} from './Views/Risk/new-risk';
import {NewInvestmentWizardComponent} from './Views/Investment/new-investment-wizard';
import {SelectFactorsComponent} from './Views/Investment/select-factors';
import {SelectRisksComponent} from './Views/Investment/select-risks';
import {SelectGroupsComponent} from './Views/Investment/select-groups';
import {SelectRegionsComponent} from './Views/Investment/select-regions';
import {SummaryOfNewInvestmentComponent} from './Views/Investment/summary-of-new-investment';
import {AssociateFactorsComponent} from './Views/Investment/associate-factors';
import {AssociateRisksComponent} from './Views/Investment/associate-risks';
import {AssociateGroupsComponent} from './Views/Investment/associate-groups';
import {AssociateRegionsComponent} from './Views/Investment/associate-regions';
import {NewInvestmentNoteComponent} from './Views/Note/new-note';
import {SideNavComponent} from './Views/Shared/side-nav';
import {ListRiskComponent} from './Views/Shared/list-risks';
import {ListFactorsComponent} from './Views/Shared/list-factors';
import {ListGroupsViaGroupLinksComponent} from './Views/Shared/list-groups-via-grouplinks';
import {ListRegionsComponent} from './Views/Shared/list-regions';
import {ListInvestmentsComponent} from './Views/Shared/list-investments';
import {SelectItemsComponent} from './Views/Investment/select-items';
import {ListGroupsComponent} from './Views/Shared/list-groups';
import {ListNotesComponent} from './Views/Shared/list-notes';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { InlineEditorModule } from '@qontu/ngx-inline-editor';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import {InvestmentService} from './investment.service';
import { BreadcrumbsComponent } from './BreadCrumbs'
import { ProgressbarModule } from 'ngx-bootstrap';


const appRoutes: Routes = [

  {
    path: 'Investments', data: { breadcrumb: 'All Portfolios' }, component: InvestmentComponent,
    children: []
  },
  { path: 'InvestmentDetails/:id', data: { breadcrumb: 'Portfolios Details' }, component: InvestmentDetailComponent },
  
  { path: 'Factors/:id', data: { breadcrumb: 'Portfolios Trades' }, component: FactorComponent },
  { path: 'FactorDetails/:id', component: FactorDetailsComponent },
  { path: 'Groups/:id', data: { breadcrumb: 'Portfolios Holdings' }, component: GroupComponent },
  { path: 'GroupDetails/:id', component: GroupDetailsComponent },
  { path: 'Risks', component: RiskComponent },
  { path: 'RiskDetails/:id', component: RiskDetailsComponent },
  { path: 'Regions', component: RegionComponent },
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
  { path: 'home', data: { breadcrumb: 'Home' }, component: HomeComponent },
  { path: 'portfolios', data: { breadcrumb: 'portfolios' }, component: PortfoliosComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  declarations: [AppComponent, HomeComponent, PortfoliosComponent, LayoutComponent, SelectionTestComponent,
    SideNavComponent, InvestmentComponent,
    FactorComponent, GroupComponent, RiskComponent, RegionComponent, InvestmentDetailComponent,
    ListRiskComponent, ListFactorsComponent, ListGroupsViaGroupLinksComponent, ListRegionsComponent,
    FactorDetailsComponent, GroupDetailsComponent, RegionDetailsComponent, ListInvestmentsComponent,
    RiskDetailsComponent, NewInvestmentComponent, NewFactorComponent, NewGroupComponent,
    NewRegionComponent, NewRiskComponent, SelectItemsComponent, SelectFactorsComponent,
    NewInvestmentWizardComponent, SelectRisksComponent, SelectGroupsComponent, SelectRegionsComponent,
    SummaryOfNewInvestmentComponent, AssociateFactorsComponent, AssociateRisksComponent,
    AssociateGroupsComponent, AssociateRegionsComponent, ListGroupsComponent,
    ListNotesComponent, NewInvestmentNoteComponent, BreadcrumbsComponent],
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
