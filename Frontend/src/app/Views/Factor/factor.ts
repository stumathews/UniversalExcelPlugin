import { Component, OnInit, Input } from '@angular/core';
import { InvestmentInfluenceFactor } from '../../Models/InvestmentInfluenceFactor';
import { EntityTypes  } from '../../Utilities';
import { ActivatedRoute , Router} from '@angular/router';
import {ApiService} from '../../apiService';


@Component({
  selector: 'app-factor',
  templateUrl: './factor.html'
})
export class FactorComponent implements OnInit {
  portfolioId: string;
  constructor(private readonly apiService: ApiService,
              private readonly router: Router,
              private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.portfolioId = this.route.snapshot.paramMap.get('id');
  }
}
