import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatError, MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-users-login',
  standalone: true,
  imports: [
    MatError,
    MatFormField,
    MatInput,
    MatSuffix,
    ReactiveFormsModule,
    TranslateModule,
    MatButton,
    RouterLink,
  ],
  templateUrl: './users-login.component.html',
  styleUrl: './users-login.component.scss'
})
export class UsersLoginComponent {
  /**
   * Form group for login form
   */
  loginForm: FormGroup;

  /**
   * Whether the password is visible or not
   */
  passwordVisible = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Toggles the visibility of the password
   */
  passwordVisibility($event: MouseEvent): void {
    this.passwordVisible = !this.passwordVisible;

    $event.stopPropagation();
  }

  /**
   * Logs the admin in
   */
  login(): void {
    this.authService
      .login(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value
      )
      .subscribe((res: boolean) => {
        if (res) {
          this.router.navigate([this.authService.redirectUrl]);
        }
      });
  }

}
