import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { SessionUserData } from 'src/models/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-admin-menu',
  standalone: true,
  imports: [TranslateModule, MatToolbar, RouterLink, RouterLinkActive],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.scss',
})
export class AdminMenuComponent implements OnInit {
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
        this.router.navigate(['/admin/login']);
      });
  }
}
