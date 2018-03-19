import { Component, Input, OnInit } from '@angular/core';
import {ApiService} from '../../apiService';
import {ExcelUtils} from '../../shared/excel-utils';
import { Holding, GetPortfolioHoldingsResponse} from 'lusid-client/models';
import { VersionedResourceListHoldingDto, HoldingDto } from '@finbourne/lusid/models';


@Component({
  selector: 'app-list-holdings',
  templateUrl: './list-holdings.html'
})

export class ListHoldingsComponent implements OnInit {
  constructor(private apiService: ApiService) { }

  private portfolioId: string;
  holdings: HoldingDto[];

  @Input()
  set PortfolioId(portfolioId: string | null)
  {
    this.portfolioId = portfolioId;
    this.apiService
      .GetPortfolioHoldings(this.portfolioId)
      .subscribe((result: VersionedResourceListHoldingDto) => { this.holdings = result.values; }, error => { });
  }

  get PortfolioId(): string
  {
    return this.portfolioId;
  }
  sync() 
  {
    ExcelUtils.SyncTable<HoldingDto>(this.holdings, 'holdings', 'holdings', true);
  }
  ngOnInit(): void { }
}
