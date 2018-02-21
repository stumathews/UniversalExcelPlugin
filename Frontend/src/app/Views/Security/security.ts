import { Component, OnInit, Input } from '@angular/core';
import { GetSecurityRootResponse } from 'lusid-client/models/index';
import {  ErrorMessage } from 'lusid-client/models';
import {ApiService} from '../../apiService';
import {ExcelUtils} from '../../shared/excel-utils';
import {TableChange} from '../../shared/excel-utils';
import {TableChange as ITableChange} from '../../shared/excel-utils';
import {PropertyDefinition} from 'lusid-client/models/index';
import {ReflectionUtils} from '../../shared/reflection-utils';
import { ClientSecurityDefinitionData, TryAddClientSecuritiesResponse, InstrumentDefinition } from 'lusid-client/models/index';


@Component({
  selector: 'app-security',
  templateUrl: './security.html'
})
export class SecurityComponent  implements OnInit {
  Securities: ClientSecurityDefinitionData[] = [];
  constructor(private apiService: ApiService) { }

  errorMessage: string;
  ngOnInit(): void {
    // Currently no way to get securities?
  }

  sync() {
    const dummy: ClientSecurityDefinitionData  = {
      properties: [],
      name: 'name of security',
      aliases: [],
      clientSecurityId: 'YourUniqueID',
      lookThroughPortfolioId: 'portfolioId', lookThroughPortfolioScope: 'scope',
      instrument: <InstrumentDefinition>{ content:'context'}
    };
    ExcelUtils.SyncTable( this.Securities.length > 0 ? this.Securities : [dummy], "securities", 'Securities', false).then((changes: TableChange<ClientSecurityDefinitionData>[]) => {
      // Create a new property for this domain
      let entities: ClientSecurityDefinitionData[] = [];
      changes.forEach((each: ITableChange<ClientSecurityDefinitionData>) => {
        //asume added for now
        let entity: ClientSecurityDefinitionData = {};
        ReflectionUtils.FillInProperties<ClientSecurityDefinitionData>(entity, each.value);
        // dont support entering the following fields from excel so set manually
        entity.properties = [];
        entity.instrument = dummy.instrument;
        entity.aliases = [];
        entities.push(entity);
      });
      this.apiService.CreateNewSecurity(entities).subscribe((result: TryAddClientSecuritiesResponse) => {
        console.log('successfully created new security!!');
      }, error => {
        console.log('Error! ' + error);
      });
    });
  }

  
}
