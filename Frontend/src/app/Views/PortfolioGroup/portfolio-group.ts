import { Component, OnInit, Input } from '@angular/core';
import { InvestmentRisk } from '../../Models/InvestmentRisk';
import { EntityTypes  } from '../../Utilities';
import { ActivatedRoute , Router} from '@angular/router';
import { ApiService } from '../../apiService';
import { GroupDefinitionResponse, PortfolioGroupState, GetPortfolioGroupResponse, ScopedIdentifier } from 'lusid-client/models';
import {ExcelUtils} from '../../shared/excel-utils';
import {TableChange} from '../../shared/excel-utils';
import {ReflectionUtils} from '../../shared/reflection-utils';


@Component({
  selector: 'app-portfolio-group',
  templateUrl: './portfolio-group.html'
})
export class PortfolioGroupComponent implements OnInit {
  Groups: GroupDefinitionResponse[] = [];
  constructor(private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router) { }

  errorMessage: string;
  ngOnInit(): void {
    this.apiService.GetPortfolioGroups()
        .subscribe(groups => this.Groups = groups.items,
                   error => this.errorMessage = <any>error);
  }

  sync() {
    const dummy: PortfolioGroupState = {
      "name": "string",
      "description": "string",
      "values": <ScopedIdentifier[]>[ { "scope": "string", "name": "string" } ],
      "subGroups": <ScopedIdentifier[]>[ { "scope": "string", "name": "string" } ]
    };
    ExcelUtils.SyncTable(this.Groups.length > 0 ? this.Groups : [dummy], "portfolio-groups", false).then((changes: TableChange<PortfolioGroupState>[]) => {
      // Create a new property for this domain
      changes.forEach((each: TableChange<PortfolioGroupState>) => {
        //asume added for now
        let entity: PortfolioGroupState = {};
        ReflectionUtils.FillInProperties<PortfolioGroupState>(entity, each.value);
        entity.values = [];
        entity.subGroups = [];
        this.apiService.CreateNewPortfolioGroup(entity).subscribe((result: GetPortfolioGroupResponse ) => {
          console.log('successfully created new group!!');
        }, error => {
          console.log('Error! ' + error);
        });
      });
    });
  }
}
