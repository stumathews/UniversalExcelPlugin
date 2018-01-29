import { Component, OnInit } from '@angular/core';
import { ApiService } from '../apiService';
import { ListPortfolioRootsResponse, ErrorResponse } from '@finbourne/lusidtypes';
import { NgZone, ViewEncapsulation } from '@angular/core';
/// <reference path='../node_modules/@types/office-js/index.d.ts' />
/// <reference path='../typings.d.ts' />

import { fabric } from 'office-ui-fabric/dist/js/jquery.fabric.min';


//declare var fabric: any;

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.css']
})
export class PortfoliosComponent implements OnInit
{
  listPortfolioResponse: ListPortfolioRootsResponse;
  constructor(private readonly apiService: ApiService, private zone: NgZone) { }
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
    var SpinnerElements = document.querySelectorAll(".ms-Spinner");
    for (var i = 0; i < SpinnerElements.length; i++) {
      new fabric['Spinner'](SpinnerElements[i]);
    }
  }
}
