import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UserService } from './UserService';


@Injectable()
export class MyFirstInterceptor implements HttpInterceptor {
  constructor(private currentUserService: UserService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // get the token from a service

    const token: string = this.currentUserService.token;
    
    console.log('token is ' + token);
    // add it if we have one
    if (token) {
      req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
    }
    // if this is a login-request the header is 
    // already set to x/www/formurl/encoded. 
    // so if we already have a content-type, do not 
    // set it, but if we don't have one, set it to 
    // default --> json

    //if (!req.headers.has('Content-Type')) {
    //  req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    //}

    // setting the accept header

    req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
    return next.handle(req);
  }
}
