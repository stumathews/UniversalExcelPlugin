import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BsModalService, ModalDirective  } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import {ApiService} from '../../apiService';
import { GetPortfolioDetailsResponse, IErrorResponse} from 'lusid-client/models';
import {DetailComponentBase} from '../../Utilities';

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio.detail.html',
  })

export class PortfolioDetailComponent extends DetailComponentBase implements OnInit {

  Entity: GetPortfolioDetailsResponse | IErrorResponse;
  
  errorMessage: string;
  modalRef: BsModalRef;
  internalId: string;
  @ViewChild('childModal') childModal: ModalDirective;
  constructor(protected apiService: ApiService,
    private route: ActivatedRoute,
    private location: Location,
    private modalService: BsModalService,
    private router: Router) {
    super(apiService);
   }

  ngOnInit(): void {
    
        this.internalId = this.route.snapshot.paramMap.get('id');
        console.log(`portfolio is is ${this.internalId}`);
    
    this.apiService.GetPortfolioDetails(this.internalId)
      .subscribe(response => {
        this.Entity = response;
        console.log(response);
      }, error => this.errorMessage = <any>error);
  }

  openModalWithAssociateRisksComponent() {
    //this.modalRef = this.modalService.show(AssociateRisksComponent);
    //this.modalRef.content.InvestmentId = this.Entity.id;
    //this.modalRef.content.AssociatedRiskEvent.subscribe((risk: InvestmentRisk) => {
    //  console.log('event recieved:' + JSON.stringify(risk));
    //  const link: RisksLink = {investmentRisk: null, investmentID: this.Entity.id, investmentRiskID: risk.id};
    //  this.Entity.risks.push(link);
    //  this.modalRef.hide();
    //});
  }

  openModalWithAssociateFactorsComponent() {
    //this.modalRef = this.modalService.show(AssociateFactorsComponent);
    //this.modalRef.content.InvestmentId = this.Entity.id;
    //this.modalRef.content.AssociatedFactorEvent.subscribe((factor: InvestmentInfluenceFactor) => {
    //  console.log('event recieved:' + JSON.stringify(factor));
    //  const link: FactorsLink = {investmentInfluenceFactor: null, investmentID: this.Entity.id, investmentInfluenceFactorID: factor.id};
    //  this.Entity.factors.push(link);
    //  this.modalRef.hide();
    //});
  }

  openModalWithAssociateGroupsComponent() {
    //this.modalRef = this.modalService.show(AssociateGroupsComponent);
    //this.modalRef.content.InvestmentId = this.Entity.id;
    //this.modalRef.content.AssociatedGroupEvent.subscribe((group: InvestmentGroup) => {
    //  console.log('event recieved:' + JSON.stringify(group));
    //  const link: GroupsLink = {investmentGroup: null, investmentID: this.Entity.id, investmentGroupID: group.id};
    //  this.Entity.groups.push(link);
    //  this.modalRef.hide();
    //});
  }

  openModalWithAssociateRegionsComponent() {
    //this.modalRef = this.modalService.show(AssociateRegionsComponent);
    //this.modalRef.content.InvestmentId = this.Entity.id;
    //this.modalRef.content.AssociatedRegionEvent.subscribe((region: Region) => {
    //  console.log('event recieved:' + JSON.stringify(region));
    //  const link: RegionsLink = {region: null, investmentID: this.Entity.id, regionID: region.id};
    //  this.Entity.regions.push(link);
    //  this.modalRef.hide();
    //});
  }

  openModalWithNewNoteComponent() {
    //this.modalRef = this.modalService.show(NewInvestmentNoteComponent);
    //this.modalRef.content.OwningEntityId = this.Entity.id;
    //this.modalRef.content.OwningEntityType = EntityTypes.Investment;
    //this.modalRef.content.CreatedNote.subscribe((value) => {
    //  this.Notes.push(value);
    //  this.modalRef.hide();
    //});
  }
}
