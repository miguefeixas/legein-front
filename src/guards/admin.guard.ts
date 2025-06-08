import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    { url }: RouterStateSnapshot
  ): boolean {
    const redirectUrl = '/admin/login';

    if (!this.auth.isLoggedIn() || !this.auth.userIs(route.data['role'])) {
      this.auth.redirectUrl = url;
      this.router.navigateByUrl(redirectUrl);

      return false;
    }

    return true;
  }
}
