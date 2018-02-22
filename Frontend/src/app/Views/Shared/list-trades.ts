import { Component, Input, OnInit, KeyValueDiffers, NgZone } from '@angular/core';
import { DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import {ApiService} from '../../apiService';
import { Trade, SecurityUid, GetPortfolioTradesResponse, UpsertPortfolioTradesResponse, ErrorMessage} from 'lusid-client/models';
import {ExcelUtils} from '../../shared/excel-utils';
import {TableChange} from '../../shared/excel-utils';
import {DateUtils} from '../../shared/date-utils';
import {ReflectionUtils} from '../../shared/reflection-utils';
import {PropertyDefinition} from 'lusid-client/models/index';

@Component({
  selector: 'app-list-trades',
  templateUrl: './list-trades.html'
})

export class ListTradesComponent implements OnInit {
 
  constructor(private apiService: ApiService, private zone: NgZone) { }
  errorMessage: string;
  @Input() PortfolioId: string;
  portfolioName: string;
  trades: Trade[] = [];
  message: string;
  tableName: string = 'Trades';
  sheetname: string;

  

  sync() {
    ExcelUtils.SyncTable<Trade>(this.trades, this.tableName, this.sheetname, false).then((values) => {
      var syncResults = <TableChange<Trade>[]>values;
      if (syncResults && syncResults.length) {
        syncResults.forEach(tableChange => {
          var newTrade = <Trade>{};
          var thinTradeRow = tableChange.value;
          ReflectionUtils.FillInProperties<Trade>(newTrade, thinTradeRow);
          this.zone.run(() => {
            this.readyTradeForUpsert(newTrade);
          });
        });
      } else {
        this.message = 'No changes detected';

      }
    });

    // Lets register for changes on the table.
    Excel.run(context => {
      var sheet = context.workbook.worksheets.getItem(this.sheetname);
      var table = sheet.tables.getItemOrNullObject(this.tableName);
      return context.sync().then((ok) => {
        
      }, (fail) => {});
    }).catch((handle) => {});

  }

  readyTradeForUpsert(thinTrade: Trade | any) {
    const upsertTrade = thinTrade;
    // remove all fake properties and convert them into real ones.


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
      .subscribe((result: GetPortfolioTradesResponse) => {
         this.portfolioName = result.root.name;
         this.trades = result.items;
         this.sheetname = this.portfolioName + this.tableName;
      }, error => { });
    });
  }
}
