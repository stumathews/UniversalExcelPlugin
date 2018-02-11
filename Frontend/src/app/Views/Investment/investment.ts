import { Component, OnInit, Input } from '@angular/core';
import { ListPortfolioRootsResponse } from '@finbourne/lusidtypes';
import { ApiService } from '../../apiService';
import { InvestmentUtilities } from '../../Utilities';


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
  
  ngOnInit(): void {
    this.apiService.GetAllPortfolios('finbourne')
      .subscribe((response: ListPortfolioRootsResponse) => this.listPortfolioResponse = response,
        error => console.log(`Cannot get all ListPortfolioResponse: ${error}`));
  }
}
