import { Component, OnInit, Input } from '@angular/core';
import { Investment } from '../../Models/investment';
import { ActivatedRoute , Router} from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ApiService} from '../../apiService';


@Component({
  selector: 'app-new-investment-wizard',
  templateUrl: 'new-investment-wizard.html',
  })

export class NewInvestmentWizardComponent implements OnInit {
  constructor(private apiService: ApiService,
              private route: ActivatedRoute,
              private location: Location,
              private router: Router) { }
  errorMessage: string;

  ngOnInit(): void {
      this.router.navigateByUrl('/NewInvestmentWizard/(NewInvestmentWizardOutlet:NewInvestment)');
  }
}
