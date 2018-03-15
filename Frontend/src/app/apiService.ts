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
  

  constructor(private readonly Http: HttpClient,
                private readonly Router: Router) { }
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
    private AggregatefromResultIntoNested = this.AggregationUrlEndpoint + '/results/nested/{scope}/{resultsKey}/{resultsDate}';

    // Aggregate data in a group hierarchy
    private AggregateInGroupHierachy = this.AggregationUrlEndpoint + '/groups/{scope}/{groupName}';

    // Aggregation request data in a group hierarchy into a data tree
    private AggregateInGroupHierachyTree = this.AggregationUrlEndpoint + '/groups/nested/{scope}/{groupName}';

    // Aggregate data in a portfolio
    private AggregatePorfolio= this.AggregationUrlEndpoint + '/portfolios/{scope}/{portfolioId}';

    // Aggregation request data in a portfolio into a data tree
    private AggregateportfolioTree = this.AggregationUrlEndpoint + '/portfolios/nested/{scope}/{portfolioId}';

    /* Analytics */
    private GetAnalyticStore =  this.AnalyticsUrlEndpoint + '/{scope}/{date}';
    private ListAnalyticStores = this.AnalyticsUrlEndpoint;
    private CreateAnalyticStore = this.AnalyticsUrlEndpoint + '/{scope}/{date}';
    private InsertAnalytics = this.AnalyticsUrlEndpoint + '/{scope}/{date}/prices';

    /* Metadata */
    private GetCurrentAssemblyVersion = this.MetadataUrlEndpoint + '/version';
    private GetCurrenBuildVersion = this.MetadataUrlEndpoint + '/buildversion';
    private GetCurrentConnectivity = this.MetadataUrlEndpoint + '/verifyconnectivity';

    /* Classification */
    private UpdateclassificationData = this.ClassificationsUrlEndpoint + '';

    /* Excel Addin */
    private GetLatestExcelVersion = this.ExcelAddinUrlEndpoint + '/latest-version';
    private GetExcelDownLoadToken = this.ExcelAddinUrlEndpoint + '/download-token';
    
    /* Health */
    private GetHealth = this.HealthUrlEndpoint + '';

    /* Login */
    private GetLoginInfo = this.LoginUrlEndpoint + '';

    /* Logs */
    private StoreLogMessage = this.LogsUrlEndpoint + '/lusidweb';

    /* Personalisation */
    private DeletePersonalisation = this.PersonalisationUrlEndpoint + '';
    private GetPersonalisation = this.PersonalisationUrlEndpoint + '';
    private UpsertPersonalisations = this.PersonalisationUrlEndpoint + '';

    /* Portfolio Groups */
    private Deletegroup = this.PortfolioGroupsUrlEndpoint + '/{scope}/{groupId}';
    private RemovePortfolio = this.PortfolioGroupsUrlEndpoint + '/{scope}/{groupId}/portfolios/{portfolioScope}/{portfolioId}';
    private RemoveSubgroup = this.PortfolioGroupsUrlEndpoint + '/{scope}/{groupId}/subgroups/{subgroupScope}/{subgroupId}';
    private ListGroups = this.PortfolioGroupsUrlEndpoint + '/{scope}';
    private GetGroup = this.PortfolioGroupsUrlEndpoint + '/{scope}/{groupId}';
    private LookupsPortfolioGroup = this.PortfolioGroupsUrlEndpoint + '/{scope}/lookup/{groupName}';
    private CreateGroup = this.PortfolioGroupsUrlEndpoint + '/{scope}';
    private UpdateGroup = this.PortfolioGroupsUrlEndpoint + '/{scope}/{groupId}/update';
    private AddportfolioToGroup = this.PortfolioGroupsUrlEndpoint + '/{scope}/{groupId}/portfolios';
    private AddSubgroupToPortfolio = this.PortfolioGroupsUrlEndpoint + '/{scope}/{groupId}/subgroups';

    /* Portfolios */
    private DeletePortfolioDetails = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/details';
    private DeletePortfolioProperty = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/properties';
    private DeletePortfolioTrades = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/trades';
    private DeletePortfolio = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}';
    private DeleteTradeProperty = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/trades/{tradeId}/properties';
    private DeletePortfolios = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/properties/all';
    private GetPortfolios = this.PortfoliosUrlEndpoint + '/{scope}';
    private GetPortfolio = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/root';
    private GetProtfolioDetails = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/details';
    private GetPortfolioPrties = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/properties';
    private GetPortfolioTrades = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/trades';
    private LookPortfolioByName = this.PortfoliosUrlEndpoint + '/{scope}/lookup/{name}';
    private GetPortfolioVersion = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/versions/latest';
    private GetPortfolioVersionByDate = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/versions/at';
    private GetPortfolioVersionAll = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/versions';
    private GetPortfolioAggregateHoldings = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/holdings';
    private CreatePortfolio = this.PortfoliosUrlEndpoint + '/{scope}';
    private CreateDerivedPortfolio = this.PortfoliosUrlEndpoint + '/{scope}/derived';
    private UpdatePortfolioDetails = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/root';
    private AddupdatePortfolioDetails = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/details';
    private CreatePortfolioProperty = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/properties';
    private AddPortfolioTrades = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/trades';
    private SetPortfolioTradesDate = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/trades/set';
    private CreatePortfolioTradesSpecifiedHoldings = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/holdings/{effectiveDate}';
    private AddPortfolioTradeProperties = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/trades/{tradeId}/properties';
    private AddPortfolioTradePropertyToAllTrade = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/trades/properties';
    private RevertPortfolioState = this.PortfoliosUrlEndpoint + '/{scope}/{portfolioId}/versions/{version}/copy';

    /* Properties */
    private DeletePropertyDefinition = this.PropertiesUrlEndpoint + '/{domain}/{scope}/{name}';
    private GetPropertyDefinitions = this.PropertiesUrlEndpoint + '';
    private GetPropertyDefinition = this.PropertiesUrlEndpoint + '/{domain}/{scope}/{name}';
    private GetManyPropertyDefinitions = this.PropertiesUrlEndpoint + '/{domain}/_keys';
    private GetPropertyDefinitionsByDomain = this.PropertiesUrlEndpoint + '/{domain}';
    private GetPropertyDefinitionsByDomainScope = this.PropertiesUrlEndpoint + '/{domain}/_scopes';
    private GetPropertiesByScope = this.PropertiesUrlEndpoint + '/{domain}/{scope}';
    private CreatePropertyDefinition = this.PropertiesUrlEndpoint + '';
    private UpdatePropertyDefinition = this.PropertiesUrlEndpoint + '';

    /* Property Dataformat */
    private GetPropertyDataformat = this.PropertyDataFormatUrlEndpoint + '/{scope}/{name}';
    private GetPropertyDataformatsByScope = this.PropertyDataFormatUrlEndpoint + '/{scope}';
    private UpsertPropertyDataFormat = this.PropertyDataFormatUrlEndpoint + '/{type}';

    /* Reference Portfolio */
    private DeleteReferencePortfolio = this.ReferencePortfoliosUrlEndpoint + '/{scope}/{portfolioId}';
    private GetReferencePortfoliosByScope = this.ReferencePortfoliosUrlEndpoint + '/{scope}';
    private GetReferencePortfolioConstituents = this.ReferencePortfoliosUrlEndpoint + '/{scope}/{referencePortfolioId}/{effectiveDate}/constituents';
    private GetRreferencePortfolioByName = this.ReferencePortfoliosUrlEndpoint + '/{scope}/lookup/{name}';
    private CreateReferencePortfolio = this.ReferencePortfoliosUrlEndpoint + '/{scope}';
    private AddReferencePortfolioConstituents = this.ReferencePortfoliosUrlEndpoint + '/{scope}/{referencePortfolioId}/{effectiveDate}/constituents';

    /* Results */
    private GetResults = this.ResultsUrlEndpoint + '/{scope}/{key}/{date}';
    private UpsertResultsByCombination = this.ResultsUrlEndpoint + '/{scope}/{key}/{date}';

    /* Schema */
    private GetSchemaForEntity = this.SchemaUrlEndpoint + '/entities/{entity}';

    /* Property definitions */
    private SearchPropertyDefinitions = this.PropertiesUrlEndpoint + '/search';

    /* Securities */
    private LookupSecurityByIsin = this.SecuritiesUrlEndpoint + '/lookup/{codeType}/{code}';
    private LookupSecurities = this.SecuritiesUrlEndpoint + '/lookup/{codeType}';
    private DeleteSecurities = this.SecuritiesUrlEndpoint + '';
    private CreateSecurities = this.SecuritiesUrlEndpoint + '';
    

    GetLatestExcelAddinVersion(): Observable<any> {
      return this.Http.get(this.GetLatestExcelVersion);
    }
    
    GetAllPortfolios(scope: string): Observable<ResourceListPortfolioDto> {
        
        console.log('Entry: GetAllPortfolios...');
            return this.Http.get(this.GetPortfolios.replace('{scope}', scope))
                .catch(this.handleError);
    }

    doGetPortfolioTrades(id: string): Observable<GetPortfolioTradesResponse | IErrorResponse> {
      
      console.log(`Entry: doGetPortfolioTrades() for id ${id}`);
      const url = this.GetPortfolioTrades.replace('{portfolioId}', `${id}`)
        .replace('{scope}', 'finbourne');

      console.log('url is ' + url);
      return this.Http.get(url).catch(this.handleError);
    }

    AddTradeToPortfolio(id: string, trades: Trade[], scope: string = 'finbourne', effectiveAt: string = DateUtils.GetTodaysDate()): Observable<UpsertPortfolioTradesResponse> {

      console.log(`Entry: AddTradeToPortfolio for id ${id}`);
      const url = this.AddPortfolioTrades.replace('{portfolioId}', `${id}`)
        .replace('{scope}', scope);

      return this.Http.post(url, trades)
        .catch(this.handleError);
    }

    GetPortfolioDetails(id: string): Observable<GetPortfolioDetailsResponse | IErrorResponse> {
      console.log(`Entry: Get Portfolio details for id ${id}`);
      const url = this.GetProtfolioDetails.replace('{portfolioId}', `${id}`)
        .replace('{scope}', 'finbourne') +
        '?effectiveDate=2018-01-01';

      console.log('url is ' + url);
      return this.Http.get(url)
        .catch(this.handleError);
    }

  doGetPortfolioHoldings(portfolioId: string, scope: string = 'finbourne', effectiveAt:string = DateUtils.GetTodaysDate()): Observable<GetPortfolioHoldingsResponse> {
    const url = this.GetPortfolioAggregateHoldings.replace('{portfolioId}', `${portfolioId}`)
      .replace('{scope}', scope) +
      '?effectiveDate='+ effectiveAt;

    console.log('url is ' + url);
    return this.Http.get(url).catch(this.handleError);
    }

  GetPropertyTypes(scope: string = 'finbourne'): Observable<any | ErrorMessage> {
    return this.Http.get(this.GetPropertyDefinitions).catch(this.handleError);
  }

  GetProperties(domain: string, scope: string = 'finbourne'): Observable<GetPropertyKeysResponse> {
    return this.Http.get(this.GetPropertyDefinitionsByDomain.replace('{domain}', domain));
  }

  CreateNewProperty(property: PropertyDefinition, scope: string = 'finbourne'): Observable<GetPropertyDefinitionResponse> {
    return this.Http.post(this.CreatePropertyDefinition, property)
      .catch(this.handleError);
  }

  CreateNewSecurity(securities: ClientSecurityDefinitionData[], scope: string = 'finbourne'): Observable<TryAddClientSecuritiesResponse > {
    return this.Http.post(this.CreateSecurities, securities)
      .catch(this.handleError);
  }

  GetPortfolioGroups(scope: string = 'finbourne'): Observable<ListPortfolioGroupResponse > {
    return this.Http.get(this.ListGroups.replace('{scope}', scope));
  }

  CreateNewPortfolioGroup(portfolioGroupState: PortfolioGroupState, scope: string = 'finbourne'):
    Observable<GetPortfolioGroupResponse> {
    return this.Http.post(this.CreateGroup.replace('{scope}', scope), portfolioGroupState)
      .catch(this.handleError);
  }

  GetReferencePortfolios(scope: string = 'finbourne'): Observable<ListPortfolioRootsResponse> {
    return this.Http.get(this.GetReferencePortfoliosByScope.replace('{scope}', scope));
  }

  CreateNewReferencePortfolio(portfolio: Portfolio, scope: string = 'finbourne'): Observable<ReferencePortfolioResponse> {
    return this.Http.post(this.CreateReferencePortfolio.replace('{scope}', scope), portfolio)
      .catch(this.handleError);
  }
  
  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'server error');
  }
}
