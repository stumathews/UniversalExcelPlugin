import { Component, Input, OnInit, NgZone } from '@angular/core';
import {ApiService} from '../../apiService';
import {ExcelUtils} from '../../shared/excel-utils';
import {TableChange} from '../../shared/excel-utils';
import {DateUtils} from '../../shared/date-utils';
import {ReflectionUtils} from '../../shared/reflection-utils';
import { TradeDto} from '@finbourne/lusid/models'; 

@Component({
  selector: 'app-list-trades',
  templateUrl: './list-trades.html'
})

export class ListTradesComponent implements OnInit {
  constructor(private readonly apiService: ApiService,
              private readonly zone: NgZone) { }
  @Input()
  portfolioId: string;
  errorMessage: string;
  portfolioName: string;
  trades: TradeDto[] = [];
  message: string;
  tableName: string = 'Trades';
  sheetname: string;

  sync()
  {
    ExcelUtils.SyncTable<TradeDto>(this.trades, this.tableName, this.sheetname, false).then((values) => {
      var syncResults = <TableChange<TradeDto>[]>values;
      if (syncResults && syncResults.length) {
        syncResults.forEach(tableChange => {
          var newTrade = <TradeDto>{};
          var thinTradeRow = tableChange.value;
          ReflectionUtils.FillInProperties<TradeDto>(newTrade, thinTradeRow);
          this.zone.run(() => {
            this.readyTradeForUpsert(newTrade);
          });
        });
      } else { this.message = 'No changes detected'; }
    });

    // Lets register for changes on the table.
    Excel.run(context => {
      var sheet = context.workbook.worksheets.getItem(this.sheetname);
      var table = sheet.tables.getItemOrNullObject(this.tableName);
      return context.sync().then((ok) => {
        
      }, (fail) => {});
    }).catch((handle) => {});

  }

  readyTradeForUpsert(thinTrade: TradeDto | any)
  {
    const upsertTrade = thinTrade;
    upsertTrade.tradeId = upsertTrade.tradeId.length === 0 ? DateUtils.GetTodaysDate() + upsertTrade.nettingSet : upsertTrade.tradeId; // must have one else breaks server 
    upsertTrade.securityUid = JSON.parse(upsertTrade.securityUid);
    upsertTrade.tradeDate = new Date(upsertTrade.tradeDate);
    upsertTrade.settlementDate = new Date(upsertTrade.settlementDate);

    this.apiService.AddTradeToPortfolio(this.portfolioId, [upsertTrade])
      .subscribe((response: TradeDto) => {
        this.message = 'Successfully inserted trade';
        this.trades.push(upsertTrade);
      }, error => {
        this.errorMessage = error;
        console.log('could not create trade :' + this.errorMessage);
        this.message = 'could not create trade';
      });
  }

  ngOnInit(): void
  {
    this.zone.run(() => {
    this.apiService
      .GetPortfolioTrades(this.portfolioId, 'finbourne')
      .subscribe((result: TradeDto[]) => {
         this.portfolioName = this.portfolioId;
         this.trades = result;
         this.sheetname = this.portfolioName + this.tableName;
      }, error => { });
    });
  }
}
