import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../apiService';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GroupDto } from '@finbourne/lusid/models';
import {ExcelUtils} from '../../shared/excel-utils';
import {TableChange} from '../../shared/excel-utils';
import {ReflectionUtils} from '../../shared/reflection-utils';
import {GetPropertyDefinitionResponse} from 'lusid-client/models/index';
import {ResourceListPropertyKey, PropertyDefinitionDto} from '@finbourne/lusid/models/index';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {
  domain: string;
  properties: string[] = [];
  constructor(private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.domain = this.route.snapshot.paramMap.get('domain');
    this.apiService.GetProperties(this.domain).subscribe((result: ResourceListPropertyKey) => {
      this.properties = result.values;
    }, error => {
      console.log(error);
    });
  }

  sync() {
    const dummy: PropertyDefinitionDto = {};
    ExcelUtils.SyncTable([dummy], this.domain + "properties", this.domain + 'properties', true).then((changes: TableChange<PropertyDefinitionDto>[]) => {
      changes.forEach((each: TableChange<PropertyDefinitionDto>) => {
        let entity: PropertyDefinitionDto = {};
        ReflectionUtils.FillInProperties<PropertyDefinitionDto>(entity, each.value);
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
