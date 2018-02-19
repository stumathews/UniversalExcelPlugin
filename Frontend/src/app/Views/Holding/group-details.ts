import { Component, OnInit, Input } from '@angular/core';

import { InvestmentGroup } from '../../Models/InvestmentGroup';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { EntityTypes, DetailComponentBase } from '../../Utilities';
import {ApiService} from '../../apiService';


@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.html'
})
export class GroupDetailsComponent extends DetailComponentBase implements OnInit  {
  Entity: InvestmentGroup;
  constructor(protected apiService: ApiService, private route: ActivatedRoute, private location: Location) { 
    super(apiService);
  }

  errorMessage: string;
  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap .get('id');
    /*this.apiService.GetGroup(id).subscribe(group => this.Entity = group,
                   error => this.errorMessage = <any>error); */
  }
}