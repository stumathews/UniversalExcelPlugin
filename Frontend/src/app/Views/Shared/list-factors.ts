
import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange, KeyValueDiffers } from '@angular/core';
import { InvestmentInfluenceFactor } from '../../Models/InvestmentInfluenceFactor';
import { FactorsLink } from '../../Models/Investment';
import { HtmlAction } from '../../Models/HtmlAction';
import { forEach } from '@angular/router/src/utils/collection';
import { EntityTypes } from '../../Utilities';
import { DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import {ApiService} from '../../apiService';
import { Trade, InternalId, GetPortfolioTradesResponse, ErrorResponse } from '@finbourne/lusidtypes';
import { ReflectionUtils } from '../../shared/reflection-utils';
import {StringUtils} from '../../shared/string-utils';
import {ExcelUtils} from '../../shared/excel-utils';

@Component({
  selector: 'app-list-factors',
  templateUrl: './list-factors.html'
})

export class ListFactorsComponent implements OnInit, DoCheck {
  private rows: string[][];
  private columns: string[];
  private trades: Trade[] = [];
  private portfolioId: string;


  @Input() set PortfolioId(portfolioId: string | null) {
    this.portfolioId = portfolioId;
    console.log('receved portfolio id as ' + portfolioId);
    console.log('ngOnInit() list trades...');
    // get portfolio trades
    this.apiService.doGetPortfolioTrades(this.portfolioId).subscribe(
      (result: GetPortfolioTradesResponse) => {
        console.log('got trades...');
        // generate columns
        console.log('generate columns...');
        let col_result = ReflectionUtils.getEntityProperties<Trade>(result.items[0]);
        
        this.columns = col_result[0].map(item => { return StringUtils.Displayify(item); });
        console.log('final columns are ' + JSON.stringify(this.columns));
        console.log('generate rows...');
        this.rows = ReflectionUtils.getEntitiesPropertyValues<Trade>(result.items, col_result);
        this.trades = result.items;
      },
      error => { });
  }
  get PortfolioId(): string {
    return this.portfolioId;
  }
  sync() {
    ExcelUtils.EntitiesToGrid<Trade>(this.trades, 'Trades',true);
  }
  differ: any;
  constructor(private apiService: ApiService, private differs: KeyValueDiffers ) {
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
          /*this.apiService.GetFactor(v.investmentInfluenceFactorID)
            .subscribe(realFactor => this.Factors.push(realFactor), error => this.errorMessage = <any>error); */
        }
      });
      changes.forEachRemovedItem( r =>  console.log('removed ', r.currentValue));
   }
  }

  ngOnInit(): void {
    
  }
}
