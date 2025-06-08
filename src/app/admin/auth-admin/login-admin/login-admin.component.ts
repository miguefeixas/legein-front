import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { AuthService } from 'src/services/auth.service';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-login-admin',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatInput,
    TranslateModule,
    MatError,
    MatButton,
    MatSuffix,
  ],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.scss',
})
export class LoginAdminComponent {
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
          this.router.navigate(['/admin/home']);
        }
      });
  }
}
