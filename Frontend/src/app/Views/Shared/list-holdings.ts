import { Component, Input, OnInit } from '@angular/core';
import {ApiService} from '../../apiService';
import {ExcelUtils} from '../../shared/excel-utils';
import { Holding, GetPortfolioHoldingsResponse} from 'lusid-client/models';


@Component({
  selector: 'app-list-holdings',
  templateUrl: './list-holdings.html'
})

export class ListHoldingsComponent implements OnInit {
  private portfolioId: string;
  holdings: Holding[];

  @Input() set PortfolioId(portfolioId: string | null) {
    this.portfolioId = portfolioId;
    this.apiService.GetPortfolioHoldings(this.portfolioId).subscribe(
      (result: GetPortfolioHoldingsResponse) => {
        this.holdings = result.items;
      },
      error => { });
  }
  get PortfolioId(): string {
    return this.portfolioId;
  }
  sync() {
    
    ExcelUtils.SyncTable<Holding>(this.holdings, 'holdings', 'holdings', true);
  }

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    
   }
}
