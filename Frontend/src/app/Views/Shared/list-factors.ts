
import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange, KeyValueDiffers, NgZone } from '@angular/core';
import { InvestmentInfluenceFactor } from '../../Models/InvestmentInfluenceFactor';
import { FactorsLink } from '../../Models/Investment';
import { HtmlAction } from '../../Models/HtmlAction';
import { forEach } from '@angular/router/src/utils/collection';
import { EntityTypes } from '../../Utilities';
import { DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import {ApiService} from '../../apiService';
import { Trade, InternalId, GetPortfolioTradesResponse, ErrorResponse, UpsertPortfolioTradesResponse, ErrorMessage } from '@finbourne/lusidtypes';
import { ReflectionUtils } from '../../shared/reflection-utils';
import {StringUtils} from '../../shared/string-utils';
import {ExcelUtils} from '../../shared/excel-utils';
import {TableChange} from '../../shared/excel-utils';
import {DateUtils} from '../../shared/date-utils';


@Component({
  selector: 'app-list-factors',
  templateUrl: './list-factors.html'
})

export class ListFactorsComponent implements OnInit, DoCheck {
  @Input() trades: Trade[] = [];
  portfolioId: string;


  @Input() set PortfolioId(portfolioId: string | null) {
    this.zone.run(() => {
      this.portfolioId = portfolioId;
      console.log('receved portfolio id as ' + portfolioId);
      console.log('ngOnInit() list trades...');

      // get portfolio trades
      this.apiService.doGetPortfolioTrades(this.portfolioId).subscribe(
        (result: GetPortfolioTradesResponse) => {
          console.log('got trades...');
            this.trades = result.items;
        },
        error => { });
        // the codes that need update the UI
      });
  }
  get PortfolioId(): string {
    return this.portfolioId;
  }
  sync() {
    //ExcelUtils.EntitiesToGrid<Trade>(this.trades, 'Trades', false);
    ExcelUtils.SyncTable<Trade>(this.trades, 'Trades', false).then((values) => {
      console.log('out of promise');
      var res = <TableChange<Trade>[]>values;
      if (res && res.length) {
        res.forEach(tableChange => {
          var thinNewTrade: Trade = <Trade>{};
          var thinTradeRow = tableChange.value;
          for (let property in thinTradeRow) {
            (<any>thinNewTrade)[property] = (<any>thinTradeRow)[property];
          }
          console.log('adding this to stack: ' + JSON.stringify(thinNewTrade));
          this.zone.run(() => {
            // the codes that need update the UI
            this.trades.push(thinNewTrade); // articifically 'create'(forcefully) a Trade type
          });
          
        });
      }
    });
  }
  differ: any;
  constructor(private apiService: ApiService, private differs: KeyValueDiffers, private zone: NgZone ) {
    this.differ = differs.find({}).create();
  }
  errorMessage: string;

  DissasociateEntityFromInvestment(entityId: number, parentId: number) {
    /*this.apiService
    .DissassociateEntityFromInvestment(EntityTypes.InvestmentInfluenceFactor, entityId, parentId )
    .finally(() => {
      const toRemove = this.Factors.filter((each) => { if (each.id === entityId) { return each; } });
      const i = this.Factors.indexOf(toRemove[0]);
      this.Factors.splice(i, 1);
      this.ngOnInit();
    })
    .subscribe( code => console.log('code was' + code) , error => this.errorMessage = error); */
  }

  ngDoCheck(): void {
    const changes = this.differ.diff(this.trades);
    if  (changes) {
      changes.forEachChangedItem( r =>  console.log('changed ', r.currentValue));
      changes.forEachAddedItem( r => {
        if (r) {
          const v: Trade = r.currentValue;
          v.properties = [];
          v.tradeId = v.tradeId.length === 0 ? DateUtils.GetTodaysDate() + v.nettingSet + v.currency : v.tradeId; // must have one else breaks server 
          v.securityUid = JSON.parse(v.securityUid);
          v.tradeDate = new Date(v.tradeDate);
          v.settlementDate = new Date(v.settlementDate);
          
          this.apiService.AddTradeToPortfolio(this.PortfolioId, [v])
            .subscribe((trade: UpsertPortfolioTradesResponse | ErrorMessage) => {
              console.log('successfully created trade');
            }, error => {
              this.errorMessage = <any>error;
              console.log('could not create trade :' + this.errorMessage);
            });
        }
      });
      changes.forEachRemovedItem( r =>  console.log('removed ', r.currentValue));
   }
  }

  ngOnInit(): void {
    
  }
}
