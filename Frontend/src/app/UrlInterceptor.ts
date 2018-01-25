import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { OAuthService } from 'angular-oauth2-oidc';
import {Injectable, Injector} from "@angular/core";

@Injectable()
export class UrlInterceptor implements HttpInterceptor
{
  constructor(private readonly injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(req);
    const auth = this.injector.get(OAuthService);
    const token = auth.getAccessToken();

    if (token) {
      req = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
    }
    if (!req.headers.has('Content-Type')) {
        req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
      }

      req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
      return next.handle(req);
   }
}


