import { Component, OnInit } from '@angular/core';
import { ApiService } from '../apiService';
import { ListPortfolioRootsResponse, ErrorResponse } from '@finbourne/lusidtypes';
import * as OfficeUiFabric from 'office-ui-fabric'; // import the typescript for office-ui-fabric

// This object will exist when we load into Excel's sandbox
declare const Excel: any;
@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.css']
})
export class PortfoliosComponent implements OnInit
{
  listPortfolioResponse: ListPortfolioRootsResponse;
  constructor(private readonly apiService: ApiService) { }
  ngOnInit()
  { 
    this.apiService.GetAllPortfolios('finbourne')
      .subscribe((response: ListPortfolioRootsResponse) => this.listPortfolioResponse = response,
                                                  error => console.log(`Cannot get all ListPortfolioResponse: ${error}`));
    
  }

  onGetExcelVersion()
  {
    this.apiService.GetLatestExcelAddinVersion().subscribe((value: number | ErrorResponse) => {
      console.log(`Got response as: ${value}`);
    }, error => {
      console.log(`Got error response as: ${error}`);
    });
  }

  onColorMe()
  {
    Excel.run(async (context) => {
      const range = context.workbook.getSelectedRange();
      range.format.fill.color = 'green';
      await context.sync();
    });
  }
}
