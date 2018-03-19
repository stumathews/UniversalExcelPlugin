import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute , Router} from '@angular/router';
import {ApiService} from '../../apiService';

@Component({
  selector: 'app-holding',
  templateUrl: './holding.html'
})
export class HoldingComponent implements OnInit {
  constructor(private readonly apiService: ApiService,
              private readonly router: Router,
              private readonly route: ActivatedRoute) { }

  PortfolioId: string;

  ngOnInit(): void {
    this.PortfolioId = this.route.snapshot.paramMap.get('id');
  }
}
