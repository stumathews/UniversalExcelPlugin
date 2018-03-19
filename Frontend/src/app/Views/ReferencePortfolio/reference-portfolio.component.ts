import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {DateUtils} from '../../shared/date-utils';
import {ExcelUtils} from '../../shared/excel-utils';
import {TableChange} from '../../shared/excel-utils';
import {ReflectionUtils} from '../../shared/reflection-utils';
import {ApiService} from '../../apiService';
import { ResourceListPortfolioDto, PortfolioDto } from '@finbourne/lusid/models';


@Component({
  selector: 'app-reference-portfolio',
  templateUrl: './reference-portfolio.component.html',
  styleUrls: ['./reference-portfolio.component.css']
})
export class ReferencePortfolioComponent implements OnInit {
  ReferencePortfolios: PortfolioDto[] = [];
  constructor(private readonly apiService: ApiService,
              private readonly router: Router,
              private readonly route: ActivatedRoute) { }

  ngOnInit() {
    this.apiService.GetReferencePortfolios()
      .subscribe((result: ResourceListPortfolioDto) => {
      this.ReferencePortfolios = result.values;
    }, error => {
      console.log('Error!'+ error);
    });
  }

  sync() {
    const dummy: PortfolioDto = {};
    ExcelUtils.SyncTable(this.ReferencePortfolios.length > 0 ? this.ReferencePortfolios.map((value:any, index, array) => { // some sort of bug here! have to use <any>
       return <PortfolioDto> { created: value.referencePortfolio.created, id: value.referencePortfolio.id, name: value.referencePortfolio.name, referencePortfolioId: value.referencePortfolioId, referenceScope: value.referenceScope, type: 'Portfolio' }
    }) : [dummy], "referenceportfolios", 'referenceportfolios', false)
      .then((changes: TableChange<PortfolioDto>[]) => {
      // Create a new property for this domain
      changes.forEach((each: TableChange<PortfolioDto>) => {
        //asume added for now
        const entity: PortfolioDto = {};
        ReflectionUtils.FillInProperties<PortfolioDto>(entity, each.value);
        this.apiService.CreateNewReferencePortfolio(entity)
          .subscribe((result: ResourceListPortfolioDto) => {
            console.log('successfully created new reference portfolio!!');
            this.ReferencePortfolios.push(entity);
        }, error => {
          console.log('Error! ' + error);
        });
      });
    });
  }

}
