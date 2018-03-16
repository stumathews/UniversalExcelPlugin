/* ApiService
   API Access Methods */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Response, } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/catch';

import { HttpClient } from '@angular/common/http';
import {
  ListPortfolioRootsResponse,
  IErrorResponse, GetPropertyKeysResponse, GetPortfolioDetailsResponse,
  GetPortfolioTradesResponse, GetPortfolioHoldingsResponse,
  Trade, UpsertPortfolioTradesResponse, ErrorMessage,
  PropertyDefinition, GetPropertyDefinitionResponse, TryAddClientSecuritiesResponse,
  ClientSecurityDefinitionData, ListPortfolioGroupResponse,
  PortfolioGroupState, GetPortfolioGroupResponse, Portfolio,
  ReferencePortfolioResponse
} from 'lusid-client/models';

import { PortfolioDto, TradeDto, PortfolioDetailsDto, HoldingDto, PropertyDefinitionDto, CreateClientSecurityRequest, GroupDto, ResourceListPropertyKey, ResourceListGroupDto, ResourceListPortfolioDto } from '@finbourne/lusid/models'; 
import {DateUtils} from './shared/date-utils';

@Injectable()
export class ApiService {
  

  constructor(private readonly Http: HttpClient, private readonly Router: Router) { }
    private BaseUrl = 'https://api-am-prod.finbourne.com/v1/api';

    /* URL Endpoints */
    private AggregationUrlEndpoint = this.BaseUrl + '/aggregation';
    private AnalyticsUrlEndpoint = this.BaseUrl + '/analytics';
    private MetadataUrlEndpoint = this.BaseUrl + '/metadata';
    private ClassificationsUrlEndpoint = this.BaseUrl + '/classifications';
    private ExcelAddinUrlEndpoint = this.BaseUrl + '/excel';
    private HealthUrlEndpoint = this.BaseUrl + '/health';
    private LoginUrlEndpoint = this.BaseUrl + '/login';
    private LogsUrlEndpoint = this.BaseUrl + '/logs';
    private PersonalisationUrlEndpoint = this.BaseUrl + '/personalisations';
    private PortfolioGroupsUrlEndpoint = this.BaseUrl + '/groups/portfolios';
    private PortfoliosUrlEndpoint = this.BaseUrl + '/portfolios';
    private GetAllPortfoliosUrl = this.PortfoliosUrlEndpoint + '/{scope}';
    private PropertiesUrlEndpoint = this.BaseUrl + '/properties';
    private PropertyDataFormatUrlEndpoint = this.BaseUrl + '/propertyformats';
    private ReferencePortfoliosUrlEndpoint = this.BaseUrl + '/reference';
    private ResultsUrlEndpoint = this.BaseUrl + '/result';
    private SearchProxyUrlEndpoint = this.BaseUrl + '/properties/search'; // Not done?
    private SecuritiesUrlEndpoint = this.BaseUrl + '/securities';
    private SchemaUrlEndpoint = this.BaseUrl + '/schema';
           
    //Aggregate data from a result set          
    private AggregateFromResultUrl = this.AggregationUrlEndpoint + '/results/{scope}/{resultsKey}/{resultsDate}';

    // Aggregate data from a result set into a nested structure
    private AggregatefromResultIntoNestedUrl = this.AggregationUrlEndpoint + '/results/nested/{scope}/{resultsKey}/{resultsDate}';

    // Aggregate data in a group hierarchy
    private AggregateInGroupHierachyUrl = this.AggregationUrlEndpoint + '/groups/{scope}/{groupName}';

    // Aggregation request data in a group hierarchy into a data tree
    private AggregateInGroupHierachyTreeUrl = this.AggregationUrlEndpoint + '/groups/nested/{scope}/{groupName}';

    // Aggregate data in a portfolio
    private AggregatePorfolioUrl = this.AggregationUrlEndpoint + '/portfolios/{scope}/{portfolioId}';

    // Aggregation request data in a portfolio into a data tree
    private AggregateportfolioTreeUrl = this.AggregationUrlEndpoint + '/portfolios/nested/{scope}/{portfolioId}';

    /* Analytics */
    private GetAnalyticStoreUrl =  this.AnalyticsUrlEndpoint + '/{scope}/{date}';
    private ListAnalyticStoresUrl = this.AnalyticsUrlEndpoint;
    private CreateAnalyticStoreUrl = this.AnalyticsUrlEndpoint + '/{scope}/{date}';
    private InsertAnalyticsUrl = this.AnalyticsUrlEndpoint + '/{scope}/{date}/prices';

    /* Metadata */
    private GetCurrentAssemblyVersionUrl = this.MetadataUrlEndpoint + '/version';
    private GetCurrenBuildVersionUrl = this.MetadataUrlEndpoint + '/buildversion';
    private GetCurrentConnectivityUrl = this.MetadataUrlEndpoint + '/verifyconnectivity';

    /* Classification */
    private UpdateclassificationDataUrl = this.ClassificationsUrlEndpoint + '';

    /* Excel Addin */
    private GetLatestExcelVersionUrl = this.ExcelAddinUrlEndpoint + '/latest-version';
    private GetExcelDownLoadTokenUrl = this.ExcelAddinUrlEndpoint + '/download-token';
    
    /* Health */
    private GetHealthUrl = this.HealthUrlEndpoint + '';

    /* Login */
    private GetLoginInfoUrl = this.LoginUrlEndpoint + '';

    /* Logs */
    private StoreLogMessageUrl = this.LogsUrlEndpoint + '/lusidweb';

    /* Personalisation */
    private DeletePersonalisationUrl = this.PersonalisationUrlEndpoint + '';
    private GetPersonalisationUrl = this.PersonalisationUrlEndpoint + '';
    private UpsertPersonalisationsUrl = this.PersonalisationUrlEndpoint + '';

    /* Portfolio Groups */
    private DeleteGroupUrl = this.PortfolioGroupsUrlEndpoint + '/{scope}/{groupId}';
    private RemovePortfolioUrl = this.PortfolioGroupsUrlEndpoint + '/{scope}/{groupId}/portfolios/{portfolioScope}/{portfolioId}';
    private RemoveSubgroupUrl = this.PortfolioGroupsUrlEndpoint + '/{scope}/{groupId}/subgroups/{subgroupScope}/{subgroupId}';
    private ListGroupsUrl = this.PortfolioGroupsUrlEndpoint + '/{scope}';
    private GetGroupUrl = this.PortfolioGroupsUrlEndpoint + '/{scope}/{groupId}';
    private LookupsPortfolioGroupUrl = this.PortfolioGroupsUrlEndpoint + '/{scope}/lookup/{groupName}';
    private CreateGroupUrl = this.PortfolioGroupsUrlEndpoint + '/{scope}';
    private UpdateGroupUrl = this.PortfolioGroupsUrlEndpoint + '/{scope}/{groupId}/update';
    private AddportfolioToGroupUrl = this.PortfolioGroupsUrlEndpoint + '/{scope}/{groupId}/portfolios';
    private AddSubgroupToPortfolioUrl = this.PortfolioGroupsUrlEndpoint + '/{scope}/{groupId}/subgroups';

    /* Portfolios */
    private DeletePortfolioDetailsUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/details';
    private DeletePortfolioPropertyUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/properties';
    private DeletePortfolioTradesUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/trades';
    private DeletePortfolioUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}';
    private DeleteTradePropertyUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/trades/{tradeId}/properties';
    private DeletePortfoliosUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/properties/all';
    private GetPortfoliosUrl = this.PortfoliosUrlEndpoint + '/{scope}';
    private GetPortfolioUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/root';
    private GetProtfolioDetailsUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/details';
    private GetPortfolioPropertiesUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/properties';
    private GetPortfolioTradesUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/trades';
    private LookPortfolioByNameUrl = this.PortfoliosUrlEndpoint + '/{scope}/lookup/{name}';
    private GetPortfolioVersionUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/versions/latest';
    private GetPortfolioVersionByDateUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/versions/at';
    private GetPortfolioVersionAllUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/versions';
    private GetPortfolioAggregateHoldingsUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/holdings';
    private CreatePortfolioUrl = this.PortfoliosUrlEndpoint + '/{scope}';
    private CreateDerivedPortfolioUrl = this.PortfoliosUrlEndpoint + '/{scope}/derived';
    private UpdatePortfolioDetailsUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/root';
    private AddUpdatePortfolioDetailsUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/details';
    private CreatePortfolioPropertyUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/properties';
    private AddPortfolioTradesUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/trades';
    private SetPortfolioTradesDateUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/trades/set';
    private CreatePortfolioTradesSpecifiedHoldingsUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/holdings/{effectiveDate}';
    private AddPortfolioTradePropertiesUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/trades/{tradeId}/properties';
    private AddPortfolioTradePropertyToAllTradeUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/trades/properties';
    private RevertPortfolioStateUrl = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/versions/{version}/copy';

    /* Properties */
    private DeletePropertyDefinitionUrl = this.PropertiesUrlEndpoint + '/{domain}/{scope}/{name}';
    private GetPropertyDefinitionsUrl = this.PropertiesUrlEndpoint + '';
    private GetPropertyDefinitionUrl = this.PropertiesUrlEndpoint + '/{domain}/{scope}/{name}';
    private GetManyPropertyDefinitionsUrl = this.PropertiesUrlEndpoint + '/{domain}/_keys';
    private GetPropertyDefinitionsByDomainUrl = this.PropertiesUrlEndpoint + '/{domain}';
    private GetPropertyDefinitionsByDomainScopeUrl = this.PropertiesUrlEndpoint + '/{domain}/_scopes';
    private GetPropertiesByScopeUrl = this.PropertiesUrlEndpoint + '/{domain}/{scope}';
    private CreatePropertyDefinitionUrl = this.PropertiesUrlEndpoint + '';
    private UpdatePropertyDefinitionUrl = this.PropertiesUrlEndpoint + '';

    /* Property Dataformat */
    private GetPropertyDataformatUrl = this.PropertyDataFormatUrlEndpoint + '/{scope}/{name}';
    private GetPropertyDataformatsByScopeUrl = this.PropertyDataFormatUrlEndpoint + '/{scope}';
    private UpsertPropertyDataFormatUrl = this.PropertyDataFormatUrlEndpoint + '/{type}';

    /* Reference Portfolio */
    private DeleteReferencePortfolioUrl = this.ReferencePortfoliosUrlEndpoint + '/{scope}/{portfolioId}';
    private GetReferencePortfoliosByScopeUrl = this.ReferencePortfoliosUrlEndpoint + '/{scope}';
    private GetReferencePortfolioConstituentsUrl = this.ReferencePortfoliosUrlEndpoint + '/{scope}/{referencePortfolioId}/{effectiveDate}/constituents';
    private GetRreferencePortfolioByNameUrl = this.ReferencePortfoliosUrlEndpoint + '/{scope}/lookup/{name}';
    private CreateReferencePortfolioUrl = this.ReferencePortfoliosUrlEndpoint + '/{scope}';
    private AddReferencePortfolioConstituentsUrl = this.ReferencePortfoliosUrlEndpoint + '/{scope}/{referencePortfolioId}/{effectiveDate}/constituents';

    /* Results */
    private GetResultsUrl = this.ResultsUrlEndpoint + '/{scope}/{key}/{date}';
    private UpsertResultsByCombinationUrl = this.ResultsUrlEndpoint + '/{scope}/{key}/{date}';

    /* Schema */
    private GetSchemaForEntityUrl = this.SchemaUrlEndpoint + '/entities/{entity}';

    /* Property definitions */
    private SearchPropertyDefinitionsUrl = this.PropertiesUrlEndpoint + '/search';

    /* Securities */
    private LookupSecurityByIsinUrl = this.SecuritiesUrlEndpoint + '/lookup/{codeType}/{code}';
    private LookupSecuritiesUrl = this.SecuritiesUrlEndpoint + '/lookup/{codeType}';
    private DeleteSecuritiesUrl = this.SecuritiesUrlEndpoint + '';
    private CreateSecuritiesurl = this.SecuritiesUrlEndpoint + '';
    

    GetLatestExcelAddinVersion(): Observable<any> {
      return this.Http.get(this.GetLatestExcelVersionUrl);
    }
    
    GetAllPortfolios(scope: string): Observable<ResourceListPortfolioDto> {
        
        console.log('Entry: GetAllPortfolios...');
            return this.Http.get(this.GetPortfoliosUrl.replace('{scope}', scope))
                .catch(this.handleError);
    }

    doGetPortfolioTrades(id: string): Observable<GetPortfolioTradesResponse | IErrorResponse> {
      
      console.log(`Entry: doGetPortfolioTrades() for id ${id}`);
      const url = this.GetPortfolioTradesUrl.replace('{portfolioId}', `${id}`)
        .replace('{scope}', 'finbourne');

      console.log('url is ' + url);
      return this.Http.get(url).catch(this.handleError);
    }

    AddTradeToPortfolio(id: string, trades: Trade[], scope: string = 'finbourne', effectiveAt: string = DateUtils.GetTodaysDate()): Observable<UpsertPortfolioTradesResponse> {

      console.log(`Entry: AddTradeToPortfolio for id ${id}`);
      const url = this.AddPortfolioTradesUrl.replace('{portfolioId}', `${id}`)
        .replace('{scope}', scope);

      return this.Http.post(url, trades)
        .catch(this.handleError);
    }

    GetPortfolioDetails(id: string): Observable<GetPortfolioDetailsResponse | IErrorResponse> {
      console.log(`Entry: Get Portfolio details for id ${id}`);
      const url = this.GetProtfolioDetailsUrl.replace('{portfolioId}', `${id}`)
        .replace('{scope}', 'finbourne') +
        '?effectiveDate=2018-01-01';

      console.log('url is ' + url);
      return this.Http.get(url)
        .catch(this.handleError);
    }

  doGetPortfolioHoldings(portfolioId: string, scope: string = 'finbourne', effectiveAt:string = DateUtils.GetTodaysDate()): Observable<GetPortfolioHoldingsResponse> {
    const url = this.GetPortfolioAggregateHoldingsUrl.replace('{portfolioId}', `${portfolioId}`)
      .replace('{scope}', scope) +
      '?effectiveDate='+ effectiveAt;

    console.log('url is ' + url);
    return this.Http.get(url).catch(this.handleError);
    }

  GetPropertyTypes(scope: string = 'finbourne'): Observable<any | ErrorMessage> {
    return this.Http.get(this.GetPropertyDefinitionsUrl).catch(this.handleError);
  }

  GetProperties(domain: string, scope: string = 'finbourne'): Observable<GetPropertyKeysResponse> {
    return this.Http.get(this.GetPropertyDefinitionsByDomainUrl.replace('{domain}', domain));
  }

  CreateNewProperty(property: PropertyDefinition, scope: string = 'finbourne'): Observable<GetPropertyDefinitionResponse> {
    return this.Http.post(this.CreatePropertyDefinitionUrl, property)
      .catch(this.handleError);
  }

  CreateNewSecurity(securities: ClientSecurityDefinitionData[], scope: string = 'finbourne'): Observable<TryAddClientSecuritiesResponse > {
    return this.Http.post(this.CreateSecuritiesurl, securities)
      .catch(this.handleError);
  }

  GetPortfolioGroups(scope: string = 'finbourne'): Observable<ListPortfolioGroupResponse > {
    return this.Http.get(this.ListGroupsUrl.replace('{scope}', scope));
  }

  CreateNewPortfolioGroup(portfolioGroupState: PortfolioGroupState, scope: string = 'finbourne'):
    Observable<GetPortfolioGroupResponse> {
    return this.Http.post(this.CreateGroupUrl.replace('{scope}', scope), portfolioGroupState)
      .catch(this.handleError);
  }

  GetReferencePortfolios(scope: string = 'finbourne'): Observable<ListPortfolioRootsResponse> {
    return this.Http.get(this.GetReferencePortfoliosByScopeUrl.replace('{scope}', scope));
  }

  CreateNewReferencePortfolio(portfolio: Portfolio, scope: string = 'finbourne'): Observable<ReferencePortfolioResponse> {
    return this.Http.post(this.CreateReferencePortfolioUrl.replace('{scope}', scope), portfolio)
      .catch(this.handleError);
  }
  
  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'server error');
  }
}
