/* ApiService
   API Access Methods */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { EntityTypes } from './Models/EntityTypes';
import { LoginData } from './Models/LoginData';
import { ListPortfolioRootsResponse, ErrorResponse  } from '@finbourne/lusidtypes';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {
  token: string;
  user: string;
}
