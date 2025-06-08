import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/services/auth.service';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepickerToggleIcon,
} from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { UserRole } from 'src/definitions/user-role.enum';
import { debounceTime } from 'rxjs';
import { PasswordValidator } from '../../../utils/password.validator';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-users-signup',
  standalone: true,
  imports: [
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatSuffix,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggleIcon,
    MatCheckbox,
  ],
  templateUrl: './users-signup.component.html',
  styleUrl: './users-signup.component.scss'
})
export class UsersSignupComponent implements OnInit {
    /**
   * Form group for login form
   */
  signupForm: FormGroup;

  /**
   * Whether the password is visible or not
   */
  passwordVisible = false;

  userToRegister: UserRole | undefined;

  userRole = UserRole;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      firstLastName: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, PasswordValidator.strongPassword()]),
      emergingAuthor: new FormControl(false),
    });
  }

  ngOnInit(): void {
    this.signupForm.get('email')?.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.onEmailInputChange(value);
    });

    this.signupForm.get('username')?.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.onUsernameInputChange(value);
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
  signup(): void {
    this.authService
      .signup(
        this.signupForm.get('name')?.value,
        this.signupForm.get('firstLastName')?.value,
        this.signupForm.get('username')?.value,
        this.signupForm.get('dateOfBirth')?.value.toDate(),
        this.signupForm.get('email')?.value,
        this.signupForm.get('password')?.value,
        this.userToRegister === UserRole.AUTHOR
      )
      .subscribe((res: boolean) => {
        if (res) {
          this.toastr.success(undefined, '¡Te has registrado correctamente!', {
              timeOut: 3000,
              positionClass: 'toast-bottom-center',
            });
          this.router.navigateByUrl('/login');
        }
      });
  }

  pickRole(role: UserRole | undefined = undefined): void {
    this.userToRegister = role;
    this.signupForm.markAsUntouched();
  }

  private onEmailInputChange(value: string) {
    if (this.signupForm.get('email')?.invalid) {
      return;
    }

    this.authService.checkEmail(value).subscribe((res: boolean) => {
      if (!res) {
        this.signupForm.get('email')?.setErrors({ emailExists: true });
      }
    });
  }

  private onUsernameInputChange(value: string) {
    if (this.signupForm.get('username')?.invalid) {
      return;
    }

    this.authService.checkUsername(value).subscribe((res: boolean) => {
      if (!res) {
        this.signupForm.get('username')?.setErrors({ usernameExists: true });
      }
    });
  }

  dateFilter = (d: Date | null): boolean => {
  const date = d || new Date();

  const cutoffDate = new Date(new Date().setFullYear(new Date().getFullYear() - 14));

  return date <= cutoffDate;
};

  startDate(): Date {
    return new Date(new Date().setFullYear(new Date().getFullYear() - 14));
  }
}
