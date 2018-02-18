import { Component, Input, OnInit, KeyValueDiffers, NgZone } from '@angular/core';
import { DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import {ApiService} from '../../apiService';
import { Trade, SecurityUid, GetPortfolioTradesResponse, UpsertPortfolioTradesResponse, ErrorMessage} from 'lusid-client/models';
import {ExcelUtils} from '../../shared/excel-utils';
import {TableChange} from '../../shared/excel-utils';
import {DateUtils} from '../../shared/date-utils';

@Component({
  selector: 'app-list-trades',
  templateUrl: './list-trades.html'
})

export class ListTradesComponent implements OnInit {
 
  constructor(private apiService: ApiService, private zone: NgZone) { }
  errorMessage: string;
  @Input() PortfolioId: string;
  trades: Trade[] = [];
  message: string;

  

  sync() {
    ExcelUtils.SyncTable<Trade>(this.trades, 'Trades', false).then((values) => {
      var syncResults = <TableChange<Trade>[]>values;
      if (syncResults && syncResults.length) {
        syncResults.forEach(tableChange => {
          var thinNewTrade: Trade = <Trade>{};
          var thinTradeRow = tableChange.value;
          for (let property in thinTradeRow) {
            (<Trade>thinNewTrade)[property] = (<any>thinTradeRow)[property];
          }
          this.zone.run(() => {
            this.readyTradeForUpsert(thinNewTrade);
          });
        });
      } else {
        this.message = 'No changes detected';

      }
    });
  }

  readyTradeForUpsert(thinTrade: Trade | any) {
    const upsertTrade = thinTrade;
    upsertTrade.properties = []; // wont support properties in this POC
    // Mandatory values that need to be setto something...
    upsertTrade.tradeId = upsertTrade.tradeId.length === 0 ? DateUtils.GetTodaysDate() + upsertTrade.nettingSet : upsertTrade.tradeId; // must have one else breaks server 
    upsertTrade.securityUid = JSON.parse(upsertTrade.securityUid);
    upsertTrade.tradeDate = new Date(upsertTrade.tradeDate);
    upsertTrade.settlementDate = new Date(upsertTrade.settlementDate);

    this.apiService.AddTradeToPortfolio(this.PortfolioId, [upsertTrade])
      .subscribe((response: UpsertPortfolioTradesResponse) => {
        this.message = 'Successfully inserted trade';
        this.trades.push(upsertTrade); // artificially 'create'(forcefully) a Trade type
      }, error => {
        this.errorMessage = <any>error;
        console.log('could not create trade :' + this.errorMessage);
        this.message = 'could not create trade';
      });
  }

  ngOnInit(): void {
    this.zone.run(() => {
    this.apiService
      .doGetPortfolioTrades(this.PortfolioId)
      .subscribe((result: GetPortfolioTradesResponse) => { this.trades = result.items; }, error => { });
    });
  }
}
