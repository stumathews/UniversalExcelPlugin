import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { ApiService } from '../../apiService';
import { ExcelUtils} from '../../shared/excel-utils';
import { TableChange} from '../../shared/excel-utils';
import { ReflectionUtils} from '../../shared/reflection-utils';
import { GroupDto } from '@finbourne/lusid/models';


@Component({
  selector: 'app-portfolio-group',
  templateUrl: './portfolio-group.html'
})
export class PortfolioGroupComponent implements OnInit {
  constructor(private readonly apiService: ApiService,
              private readonly route: ActivatedRoute,
              private readonly router: Router) { }

  groups: GroupDto[] = [];
  errorMessage: string;

  ngOnInit(): void
  {
    this.apiService
      .GetPortfolioGroups()
      .subscribe(groups => this.groups = groups.values, error => this.errorMessage = <any>error);
  }

  sync() {
    const dummy: GroupDto = {
      "name": "string",
      "description": "string",
    };
    ExcelUtils.SyncTable(this.groups.length > 0 ? this.groups : [dummy], "portfoliogroups", 'portfoliogroups', false)
      .then((changes: TableChange<GroupDto>[]) => {
        changes.forEach((each: TableChange<GroupDto>) => {
        const entity: GroupDto = {};
        ReflectionUtils.FillInProperties<GroupDto>(entity, each.value);
        entity.values = [];
        entity.subGroups = [];
        this.apiService.CreateNewPortfolioGroup(entity)
          .subscribe((result: GroupDto) => {
            console.log('successfully created new group!!');
            this.groups.push(entity);
          }, error => { console.log('Error! ' + error); });
      });
    });
  }
}
