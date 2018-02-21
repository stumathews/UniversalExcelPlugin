import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ListPortfolioRootsResponse, GetPortfolioRootResponse, Portfolio, ReferencePortfolioResponse } from 'lusid-client/models/index';
import {DateUtils} from '../../shared/date-utils';
import {ExcelUtils} from '../../shared/excel-utils';
import {TableChange} from '../../shared/excel-utils';
import {ReflectionUtils} from '../../shared/reflection-utils';
import {ApiService} from '../../apiService';


@Component({
  selector: 'app-reference-portfolio',
  templateUrl: './reference-portfolio.component.html',
  styleUrls: ['./reference-portfolio.component.css']
})
export class ReferencePortfolioComponent implements OnInit {

  ReferencePortfolios: GetPortfolioRootResponse[] = [];
  constructor(private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) { }

  ngOnInit() {
    this.apiService.GetReferencePortfolios().subscribe((result: ListPortfolioRootsResponse) => {
      this.ReferencePortfolios = result.items;
    }, error => {
      console.log('Error!'+ error);
    });
  }

  sync() {
    const dummy: Portfolio = {
      "id": "your-string-id",
      "name": "your-portfolio-name",
      "created": new Date(DateUtils.GetTodaysDate()),
      "referencePortfolioId": "portfolio-id",
      "referenceScope": "scope",
      "type": "Portfolio"
    };
    ExcelUtils.SyncTable(this.ReferencePortfolios.length > 0 ? this.ReferencePortfolios.map((value:any, index, array) => { // some sort of bug here! have to use <any>
       return <Portfolio> { created: value.referencePortfolio.created, id: value.referencePortfolio.id, name: value.referencePortfolio.name, referencePortfolioId: value.referencePortfolioId, referenceScope: value.referenceScope, type: 'Portfolio' }
    }) : [dummy], "referenceportfolios", false).then((changes: TableChange<Portfolio>[]) => {
      // Create a new property for this domain
      changes.forEach((each: TableChange<Portfolio>) => {
        //asume added for now
        let entity: Portfolio = <any>{};
        ReflectionUtils.FillInProperties<Portfolio>(entity, each.value);
        this.apiService.CreateNewReferencePortfolio(entity).subscribe((result: ReferencePortfolioResponse) => {
          console.log('successfully created new reference portfolio!!');
          this.ReferencePortfolios.push(entity);
        }, error => {
          console.log('Error! ' + error);
        });
      });
    });
  }

}
