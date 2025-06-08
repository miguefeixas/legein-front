import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { AuthService } from 'src/services/auth.service';
import { StoredUserData, User, UserPassword } from 'src/models/user';
import { DatePipe } from '@angular/common';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { UserService } from 'src/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { PasswordValidator } from 'src/utils/password.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-admin-profile',
  standalone: true,
  imports: [
    TranslateModule,
    RouterLink,
    MatButton,
    DatePipe,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatSuffix,
    MatLabel,
    MatError,
  ],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.scss',
})
export class AdminProfileComponent implements OnInit {
  /**
   * User data
   */
  user: User | undefined;

  /**
   * Whether the user is editing the profile
   */
  editing = false;

  /**
   * Profile form
   */
  profileForm: FormGroup;

  /**
   * Whether the user is changing the password
   */
  password = false;

  /**
   * Password form
   */
  passwordForm: FormGroup;

  currentPasswordVisible = false;
  passwordVisible = false;
  passwordConfirmationVisible = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private destroyRef: DestroyRef
  ) {
    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      firstLastName: new FormControl('', Validators.required),
      secondLastName: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', Validators.required),
    });

    this.passwordForm = new FormGroup(
      {
        currentPassword: new FormControl('', Validators.required),
        password: new FormControl('', [
          Validators.required,
          PasswordValidator.strongPassword(),
        ]),
        passwordConfirmation: new FormControl('', [
          Validators.required,
          PasswordValidator.strongPassword(),
        ]),
      },
      PasswordValidator.matchPasswords('password', 'passwordConfirmation')
    );
  }

  ngOnInit(): void {
    this.authService
      .getCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.user = user;
        this.profileForm.patchValue(user);
      });
  }

  changeEditing(): void {
    this.editing = !this.editing;
  }

  changePassword(): void {
    this.password = !this.password;
  }

  updateUser(userData: FormGroup): void {
    if (this.user) {
      this.user.name = userData.value.name;
      this.user.firstLastName = userData.value.firstLastName;
      this.user.secondLastName = userData.value.secondLastName;
      this.user.email = userData.value.email;
      this.user.username = userData.value.username;
    }
  }

  onSubmit(): void {
    if (this.user?.id) {
      this.updateUser(this.profileForm);
      this.userService
        .updateProfile(this.user, this.user?.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          user => {
            const storedUser: StoredUserData = {
              id: user.id,
              username: user.username,
              email: user.email,
              userRole: user.userRole,
            };
            this.authService.updateStoredUser(storedUser);
            this.toastr.success(
              this.translate.instant('ADMINPROFILE.SUCCESSPROFILEUPDATE'),
              undefined,
              {
                timeOut: 3000,
                positionClass: 'toast-bottom-center',
              }
            );
            this.editing = false;
          },
          () => {
            this.toastr.error(
              this.translate.instant('ADMINPROFILE.ERRORPROFILEUPDATE'),
              undefined,
              {
                timeOut: 3000,
                positionClass: 'toast-bottom-center',
              }
            );
          }
        );
    }
  }

  changeVisibility($event: MouseEvent, field: string): void {
    switch (field) {
      case 'currentPassword':
        this.currentPasswordVisible = !this.currentPasswordVisible;
        break;
      case 'password':
        this.passwordVisible = !this.passwordVisible;
        break;
      case 'passwordConfirmation':
        this.passwordConfirmationVisible = !this.passwordConfirmationVisible;
        break;
    }
  }

  onSubmitPassword(): void {
    const adminNewPassword = new UserPassword(
      this.passwordForm.value.currentPassword,
      this.passwordForm.value.password,
      this.passwordForm.value.passwordConfirmation
    );
    if (this.user?.id) {
      this.userService
        .changePassword(adminNewPassword, this.user?.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          () => {
            this.toastr.success(
              this.translate.instant('ADMINPROFILE.SUCCESSPASSWORDCHANGE'),
              undefined,
              {
                timeOut: 3000,
                positionClass: 'toast-bottom-center',
              }
            );
            this.password = false;
          },
          err => {
            if (
              err.error &&
              err.error.detail &&
              err.error.detail === 'API.ERROR.WRONGPASSWORD'
            ) {
              this.toastr.error(
                this.translate.instant('API.ERROR.WRONGPASSWORD'),
                undefined,
                {
                  timeOut: 3000,
                  positionClass: 'toast-bottom-center',
                }
              );
            } else {
              this.toastr.error(
                this.translate.instant('ADMINPROFILE.ERRORPASSWORDCHANGE'),
                undefined,
                {
                  timeOut: 3000,
                  positionClass: 'toast-bottom-center',
                }
              );
            }
          }
        );
    }
  }
}
