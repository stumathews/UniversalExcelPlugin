import { Component,  OnInit } from '@angular/core';
import {ApiService} from '../../apiService';

@Component({
  selector: 'app-list-properties',
  templateUrl: './list-properties.html'
})

export class ListPropertiesComponent implements OnInit {
  constructor(private readonly apiService: ApiService) {}
  ngOnInit(): void { }
}
