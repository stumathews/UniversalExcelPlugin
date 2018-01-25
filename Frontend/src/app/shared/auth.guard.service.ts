import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

/**
 * Routes are protected by this component which ensures that only logged in users
 * can access the route, otherwise they are redirected to the home component(overview)
 */
@Injectable()
export class AuthGuard implements CanActivate
{
  constructor(private readonly oauthService: OAuthService,
              private readonly router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean
  {
    if (this.oauthService.hasValidIdToken()) {
      return true;
    }
    this.router.navigate(['/home']);
    return false;
  }
}
