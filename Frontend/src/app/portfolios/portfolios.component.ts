import { Component, OnInit } from '@angular/core';
import { ApiService } from '../apiService';
import { ListPortfolioRootsResponse, ErrorResponse } from '@finbourne/lusidtypes';

declare const Excel: any;
@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.css']
})
export class PortfoliosComponent implements OnInit {

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  onGetExcelVersion() {
    this.api.GetLatestExcelAddinVersion().subscribe((value: number | ErrorResponse) => {
      /* Deal with response here */
      console.log('Got response as: ' + value);
    }, error => {
      /* Deal with error here*/
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
