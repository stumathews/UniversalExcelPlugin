import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { OAuthService } from 'angular-oauth2-oidc';
import {Injectable, Injector} from "@angular/core";


@Injectable()
export class MyFirstInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // get the token from a service

    const auth = this.injector.get(OAuthService);
    const token: string = auth.getAccessToken();
    
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
