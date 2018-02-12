import { Component, OnInit, Input } from '@angular/core';

import { InvestmentInfluenceFactor } from '../../Models/InvestmentInfluenceFactor';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { EntityTypes, DetailComponentBase } from '../../Utilities';
import {ApiService} from '../../apiService';


@Component({
  selector: 'app-factor-details',
  templateUrl: './factor-details.html'
})
export class FactorDetailsComponent extends DetailComponentBase implements OnInit {
  Entity: InvestmentInfluenceFactor;
  constructor(protected apiService: ApiService, private route: ActivatedRoute, private location: Location) { 
    super(apiService);
  }
  errorMessage: string;
  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap .get('id');
    /*
    this.apiService.GetFactor(id).subscribe(factor => this.Entity = factor,
                   error => this.errorMessage = <any>error); */
  }
}
