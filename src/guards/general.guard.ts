import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { UserRole } from '../definitions/user-role.enum';

@Injectable({ providedIn: 'root' })
export class GeneralGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    { url }: RouterStateSnapshot
  ): boolean {
    const redirectUrl = route.data['role'] === UserRole.ADMIN ? '/admin/home' : '/users/home';

    if (this.auth.isLoggedIn() && this.auth.userIs(route.data['role'])) {
      this.auth.redirectUrl = url;
      this.router.navigateByUrl(redirectUrl);

      return false;
    }

    return true;
  }
}
