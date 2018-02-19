import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import {ApiService} from '../../apiService';


@Component({
  selector: 'app-trade',
  templateUrl: './trade.html'
})
export class TradeComponent implements OnInit {
  portfolioId: string;
  constructor(private readonly apiService: ApiService,
              private readonly router: Router,
              private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.portfolioId = this.route.snapshot.paramMap.get('id');
  }
}