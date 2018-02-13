import { Component, OnInit } from '@angular/core';
import { ApiService } from '../apiService';
import { ListPortfolioRootsResponse, ErrorResponse } from '@finbourne/lusidtypes';
import { NgZone, ViewEncapsulation } from '@angular/core';
/// <reference path='../node_modules/@types/office-js/index.d.ts' />
/// <reference path='../typings.d.ts' />

//declare var fabric: any;

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.css']
})
export class PortfoliosComponent implements OnInit {
  
  constructor(private readonly apiService: ApiService, private zone: NgZone) { }
  ngOnInit() {
    
  }
}
