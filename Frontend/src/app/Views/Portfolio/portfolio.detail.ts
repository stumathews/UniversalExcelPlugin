import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BsModalService, ModalDirective  } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {ApiService} from '../../apiService';
import { PortfolioDto, TradeDto, PortfolioDetailsDto, ResourceListPortfolioDto } from '@finbourne/lusid/models'; 

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio.detail.html',
  })

export class PortfolioDetailComponent implements OnInit {
  constructor(protected apiService: ApiService,
    private readonly  route: ActivatedRoute,
    private readonly location: Location,
    private readonly modalService: BsModalService,
    private readonly router: Router) { }

  portfolioDetail: PortfolioDetailsDto;
  errorMessage: string;
  modalRef: BsModalRef;
  internalId: string;

  @ViewChild('childModal')
  childModal: ModalDirective;
  

  ngOnInit(): void
  {
    this.internalId = this.route.snapshot.paramMap.get('id');
    console.log(`portfolio is is ${this.internalId}`);
    
    this.apiService
      .GetPortfolioDetails(this.internalId, 'finbourne')
      .subscribe(response => {
        this.portfolioDetail = response;
        console.log(response); 
      }, error => this.errorMessage = error);
  }
}
