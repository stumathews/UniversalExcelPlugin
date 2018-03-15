import { Component, OnInit, Input } from '@angular/core';
import { PortfolioDto, PortfolioDetailsDto } from '@finbourne/lusid/models'; 
import { ApiService } from '../../apiService';

import { StringUtils } from '../../shared/string-utils';
import {ReflectionUtils} from '../../shared/reflection-utils';
import { ExcelUtils } from '../../shared/excel-utils';
import { ProgressbarConfig } from 'ngx-bootstrap/progressbar';
import {TableChange} from '../../shared/excel-utils';
import {ResourceListPortfolioDto} from '@finbourne/lusid/models/index';

export function getProgressbarConfig(): ProgressbarConfig {
  return Object.assign(new ProgressbarConfig(), { animate: true, striped: true, max: 100 });
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.html',
  providers: [{ provide: ProgressbarConfig, useFactory: getProgressbarConfig }]
})
export class PortfolioComponent  implements OnInit {
  portfolios: PortfolioDto[];
  errorMessage: string;
  isPageComplete: boolean = false;

  constructor(protected apiService: ApiService) { }
  sync() {
    
    const dummy: PortfolioDto = {};
    ExcelUtils.SyncTable(this.portfolios.length > 0 ? this.portfolios : [dummy], "portfolios", 'portfolios', true).then((changes: TableChange<PortfolioDto>[]) => {
      changes.forEach((each: TableChange<PortfolioDto>) => {
        const entity: PortfolioDto = {};
        ReflectionUtils.FillInProperties<PortfolioDto>(entity, each.value);
      });
    });
  }
  
  ngOnInit(): void {
    this.apiService.GetAllPortfolios('finbourne')
      .subscribe((response: ResourceListPortfolioDto) => {
          this.portfolios = response.values;
          this.isPageComplete = true;
      }, error => console.log(`Cannot get all ListPortfolioResponse: ${error}`));
  }
}
