import { Component, OnInit } from '@angular/core';
import { ApiService } from '../apiService';
import { ListPortfolioRootsResponse, ErrorResponse, GetPortfolioRootResponse } from '@finbourne/lusidtypes';
import { Observable } from 'rxjs/Observable';


declare const Excel: any;
@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.css']
})
export class PortfoliosComponent implements OnInit {

  constructor(private Api: ApiService) { }
  portfolios: ListPortfolioRootsResponse;
  ngOnInit() { 
    this.Api.GetAllPortfolios('finbourne')
      .subscribe((response: ListPortfolioRootsResponse) => this.portfolios = response,
                                                  error => console.log('Cannot get all portfolios: ' + error));
    
  }

  onGetExcelVersion() {
    this.Api.GetLatestExcelAddinVersion().subscribe((value: number | ErrorResponse) => {
      /* Deal with response here */
      console.log('Got response as: ' + value);
    }, error => {
      /* Deal with error here*/
      console.log('Got error response as: ' + error);
    });
  }

  onColorMe() {
    Excel.run(async (context) => {
      const range = context.workbook.getSelectedRange();
      range.format.fill.color = 'green';
      await context.sync();
    });
  }

}
