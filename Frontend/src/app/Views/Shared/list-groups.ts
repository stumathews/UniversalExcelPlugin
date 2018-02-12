
import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { InvestmentGroup } from '../../Models/InvestmentGroup';
import { GroupsLink } from '../../Models/Investment';
import { HtmlAction } from '../../Models/HtmlAction';
import { forEach } from '@angular/router/src/utils/collection';
import { EntityTypes } from '../../Utilities';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NewGroupComponent } from '../Group/new-group';
import {ApiService} from '../../apiService';
import {GetPortfolioTradesResponse} from '@finbourne/lusidtypes/index';
import {ExcelUtils} from '../../shared/excel-utils';
import {Trade, Holding, GetPortfolioHoldingsResponse} from '@finbourne/lusidtypes/index';


@Component({
  selector: 'app-list-groups',
  templateUrl: './list-groups.html'
})

export class ListGroupsComponent implements OnInit {
  private portfolioId: string;
  holdings: Holding[];

  @Input() set PortfolioId(portfolioId: string | null) {
    this.portfolioId = portfolioId;
    console.log('receved portfolio id as ' + portfolioId);
    console.log('ngOnInit() list holdings...');
    // get portfolio trades
    this.apiService.doGetPortfolioHoldings(this.portfolioId).subscribe(
      (result: GetPortfolioHoldingsResponse) => {
        console.log('got holdings...');
        this.holdings = result.items;
      },
      error => { });
  }
  get PortfolioId(): string {
    return this.portfolioId;
  }
  sync() {
    ExcelUtils.EntitiesToGrid<Holding>(this.holdings, 'Holdings', true);
  }

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    
   }
}
