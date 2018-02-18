import { Component, OnInit, Input } from '@angular/core';
import { ListPortfolioRootsResponse, GetPortfolioRootResponse, IErrorResponse } from 'lusid-client/models';
import { ApiService } from '../../apiService';
import { InvestmentUtilities } from '../../Utilities';
import { StringUtils } from '../../shared/string-utils';
import {ReflectionUtils} from '../../shared/reflection-utils';
import { ExcelUtils } from '../../shared/excel-utils';
import { ProgressbarConfig } from 'ngx-bootstrap/progressbar';

export function getProgressbarConfig(): ProgressbarConfig {
  return Object.assign(new ProgressbarConfig(), { animate: true, striped: true, max: 100 });
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.html',
  providers: [{ provide: ProgressbarConfig, useFactory: getProgressbarConfig }]
})
export class PortfolioComponent extends InvestmentUtilities implements OnInit {
  listPortfolioResponse: ListPortfolioRootsResponse;
  errorMessage: string;
  isPageComplete: boolean = false;

  constructor(protected apiService: ApiService) {
    super(apiService);
  }

  /**
   
   */
  sync() {
    ExcelUtils.EntitiesToGrid(this.listPortfolioResponse.items, 'portfolios');
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
