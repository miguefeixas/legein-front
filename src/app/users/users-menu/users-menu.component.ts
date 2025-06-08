import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';
import { SessionUserData } from '../../../models/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-users-menu',
  standalone: true,
  imports: [
    MatToolbar,
    RouterLink,
    RouterLinkActive,
    TranslateModule,
  ],
  templateUrl: './users-menu.component.html',
  styleUrl: './users-menu.component.scss'
})
export class UsersMenuComponent implements OnInit {
  user: SessionUserData | undefined;
  constructor(
    private authService: AuthService,
    private destroyRef: DestroyRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentStoredUser
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.user = user;
      });
    this.user = this.authService.getUserStored();
  }

  logout(): void {
    this.authService
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        this.router.navigate(['/login']);
      });
  }

}
