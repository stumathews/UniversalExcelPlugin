import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../apiService';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GetPropertyKeysResponse, PropertyDefinition, PropertyDefinitionKeyResponse, ErrorMessage } from 'lusid-client/models';
import {ExcelUtils} from '../../shared/excel-utils';
import {TableChange} from '../../shared/excel-utils';
import {ReflectionUtils} from '../../shared/reflection-utils';
import {GetPropertyDefinitionResponse} from 'lusid-client/models/index';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {
  domain: string;
  properties: PropertyDefinitionKeyResponse[] = [];
  constructor(private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.domain = this.route.snapshot.paramMap.get('domain');
    this.apiService.GetProperties(this.domain).subscribe((result: GetPropertyKeysResponse) => {
      this.properties = result.items;
    }, error => {
      console.log(error);
    });
  }

  sync() {
    const dummy: PropertyDefinition = {
      "domain": this.domain,
      "lifeTime": "Perpetual",
      "key": this.domain+"/{your-scope}/{your-property-name}",
      "valueType": "String",
      "valueRequired": true,
      "displayName": "NameToDisplay",
      "dataFormatName": "string",
      "dataFormatScope": "string",
      "sort": "string"
    };
    ExcelUtils.SyncTable([dummy], this.domain+"properties",this.domain+'properties', true).then((changes: TableChange<PropertyDefinition>[]) => {
      // Create a new property for this domain
      changes.forEach((each: TableChange<PropertyDefinition>) => {
        //asume added for now
        let entity: PropertyDefinition = {};
        ReflectionUtils.FillInProperties<PropertyDefinition>(entity, each.value);
        this.apiService.CreateNewProperty(entity).subscribe((result: GetPropertyDefinitionResponse) => {
          console.log('successfully created new property!!');
        }, error => {
          console.log('Error! ' + error);
        });
      });
    });
  }

  ngOninit() {}

}
