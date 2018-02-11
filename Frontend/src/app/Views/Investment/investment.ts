import { Component, OnInit, Input } from '@angular/core';
import { ListPortfolioRootsResponse, GetPortfolioRootResponse } from '@finbourne/lusidtypes';
import { ApiService } from '../../apiService';
import { InvestmentUtilities } from '../../Utilities';
import { StringUtils } from '../../shared/string-utils';
import {ReflectionUtils} from '../../shared/reflection-utils';
import {ExcelUtils} from '../../shared/excel-utils';


@Component({
  selector: 'app-investment',
  templateUrl: './investment.html'
})
export class InvestmentComponent extends InvestmentUtilities implements OnInit {
  listPortfolioResponse: ListPortfolioRootsResponse;
  errorMessage: string;

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
      .subscribe((response: ListPortfolioRootsResponse) => this.listPortfolioResponse = response,
        error => console.log(`Cannot get all ListPortfolioResponse: ${error}`));
  }
}
