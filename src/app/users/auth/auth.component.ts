import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UsersLoginComponent } from '../users-login/users-login.component';
import { UsersSignupComponent } from '../users-signup/users-signup.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    RouterOutlet,
    UsersLoginComponent,
    UsersSignupComponent,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  action = 'login';

  constructor(private route: ActivatedRoute, private destroyRef: DestroyRef) { }

  ngOnInit(): void {
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      if (data['action']) {
        this.action = data['action'];
      }
    });
  }

}
