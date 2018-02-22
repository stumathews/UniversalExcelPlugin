import { Component, OnInit, Input } from '@angular/core';
import { ListPortfolioRootsResponse, GetPortfolioRootResponse, IErrorResponse } from 'lusid-client/models';
import { ApiService } from '../../apiService';

import { StringUtils } from '../../shared/string-utils';
import {ReflectionUtils} from '../../shared/reflection-utils';
import { ExcelUtils } from '../../shared/excel-utils';
import { ProgressbarConfig } from 'ngx-bootstrap/progressbar';
import {TableChange} from '../../shared/excel-utils';

export function getProgressbarConfig(): ProgressbarConfig {
  return Object.assign(new ProgressbarConfig(), { animate: true, striped: true, max: 100 });
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.html',
  providers: [{ provide: ProgressbarConfig, useFactory: getProgressbarConfig }]
})
export class PortfolioComponent  implements OnInit {
  listPortfolioResponse: ListPortfolioRootsResponse;
  errorMessage: string;
  isPageComplete: boolean = false;

  constructor(protected apiService: ApiService) {
    
  }

  /**
   
   */
  sync() {
    
    const dummy: GetPortfolioRootResponse = {};
    ExcelUtils.SyncTable(this.listPortfolioResponse.items.length > 0 ? this.listPortfolioResponse.items : [dummy], "portfolios", 'portfolios', true).then((changes: TableChange<GetPortfolioRootResponse>[]) => {
      // Create a new property for this domain
      changes.forEach((each: TableChange<GetPortfolioRootResponse>) => {
        //asume added for now
        let entity: GetPortfolioRootResponse = {};
        ReflectionUtils.FillInProperties<GetPortfolioRootResponse>(entity, each.value);
        //this.apiService.CreateNewProperty(entity).subscribe((result: GetPropertyDefinitionResponse) => {
        //  console.log('successfully created new property!!');
        //}, error => {
        //  console.log('Error! ' + error);
        //});
      });
    });
  }
  
  ngOnInit(): void {
    this.apiService.GetAllPortfolios('finbourne')
      .subscribe((response: ListPortfolioRootsResponse | IErrorResponse) => {
          this.listPortfolioResponse = response;
          this.isPageComplete = true;
        },
        error => console.log(`Cannot get all ListPortfolioResponse: ${error}`));
  }
}
