import { Component, OnInit, Input } from '@angular/core';
import { Region } from '../../Models/Region';
import {  ErrorMessage } from 'lusid-client/models';
import {ApiService} from '../../apiService';


@Component({
  selector: 'app-property-type',
  templateUrl: './property-type.html'
})
export class PropertyTypeComponent  implements OnInit {
  Properties: any[];
  constructor(private apiService: ApiService) { }

  errorMessage: string;
  ngOnInit(): void {
    this.apiService.GetPropertyTypes()
      .subscribe((response: any | ErrorMessage) => {
           this.Properties = response.items;
        },
                   error => this.errorMessage = <any>error);
  }

  
}
