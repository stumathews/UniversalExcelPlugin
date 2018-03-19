import { Component, OnInit, Input } from '@angular/core';
import { GetSecurityRootResponse } from 'lusid-client/models/index';
import {  ErrorMessage, TryAddClientSecuritiesResponse } from 'lusid-client/models';
import {ApiService} from '../../apiService';
import {ExcelUtils} from '../../shared/excel-utils';
import {TableChange} from '../../shared/excel-utils';
import {TableChange as ITableChange} from '../../shared/excel-utils';

import {ReflectionUtils} from '../../shared/reflection-utils';
import { SecurityDto, TryAddClientSecuritiesDto } from '@finbourne/lusid/models';



@Component({
  selector: 'app-security',
  templateUrl: './security.html'
})
export class SecurityComponent  implements OnInit {
  Securities: TryAddClientSecuritiesDto[] = [];
  constructor(private apiService: ApiService) { }

  errorMessage: string;
  ngOnInit(): void {
    // Currently no way to get securities?
  }

  sync()
  {
    const dummy: TryAddClientSecuritiesDto  = {};

    ExcelUtils.SyncTable(this.Securities.length > 0 ? this.Securities : [dummy], 'securities', 'Securities', false)
      .then((changes: TableChange<TryAddClientSecuritiesDto>[]) => {
        const entities: TryAddClientSecuritiesDto[] = [];
        changes.forEach((each: ITableChange<TryAddClientSecuritiesDto>) => {
          const entity: TryAddClientSecuritiesDto = {};
          ReflectionUtils.FillInProperties<TryAddClientSecuritiesDto>(entity, each.value);
        entities.push(entity);
      });
      this.apiService.CreateNewSecurity(entities).subscribe((result: SecurityDto) => {
        console.log('successfully created new security!!');
      }, error => { console.log('Error! ' + error); });
    });
  }
}
