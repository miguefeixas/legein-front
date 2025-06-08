import { DestroyRef, EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { UserRole } from 'src/definitions/user-role.enum';
import { Deserialize, IJsonObject, Serialize } from 'dcerialize';
import { SessionUserData, StoredUserData, User } from 'src/models/user';
import { UserLogged, UserSignup } from '../models/auth';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * API path
   */
  path = '/auth';

  redirectUrl?: string | null;

  currentStoredUser: EventEmitter<StoredUserData> =
    new EventEmitter<StoredUserData>();

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private destroyRef: DestroyRef,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.path = this.api.getApiUrl() + this.path;
    if (this.isLoggedIn()) {
      this.currentStoredUser.emit(AuthService.getUserData());
    }
  }

  /**
   * Return if the user is logged in
   */
  isLoggedIn(): boolean {
    return sessionStorage.getItem('token') !== null;
  }

  /**
   * Checks if the logged user has the role
   */
  userIs(role: UserRole): boolean {
    const userData = AuthService.getUserData();

    return userData?.['userRole'] === role;
  }

  /**
   * Gets the stored data of the user
   */
  static getUserData(): SessionUserData | undefined {
    const user: IJsonObject = JSON.parse(
      sessionStorage.getItem('user') as string
    );

    return user ? Deserialize(user, () => SessionUserData) : undefined;
  }

  /**
   * Stores the user data in the session storage
   */
  handleLogin(user: UserLogged): void {
    sessionStorage.setItem('token', user.accessToken);
    sessionStorage.setItem('user', JSON.stringify(user.user));
  }

  updateStoredUser(user: StoredUserData): void {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.currentStoredUser.emit(user);
  }

  /**
   * Call to the login endpoint
   * @param email
   * @param password
   */
  login(email: string, password: string): Observable<boolean> {
    const loginSubject = new BehaviorSubject(false);
    const userData: FormData = new FormData();
    userData.append('username', email);
    userData.append('password', password);

    this.http
      .post<IJsonObject>(`${this.path}/login`, userData)
      .pipe(map(response => Deserialize(response, () => UserLogged)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        userData => {
          this.handleLogin(userData);
          this.redirectUrl = '/users/home';
          loginSubject.next(true);
          this.updateStoredUser(userData.user);
        },
        () => {
          this.toastr.error(
            this.translate.instant('ADMINLOGIN.MESSAGELOGINERROR'),
            this.translate.instant('ADMINLOGIN.TITLELOGINERROR'),
            {
              timeOut: 3000,
              positionClass: 'toast-bottom-center',
            }
          );
          loginSubject.next(false);
        }
      );

    return loginSubject.asObservable();
  }

  signup(
    name: string,
    firstLastName: string,
    username: string,
    dateOfBirth: Date,
    email: string,
    password: string,
    emergingAuthor: boolean
  ): Observable<boolean> {
    const signupSubject = new BehaviorSubject(false);
    console.log('signup params', name, firstLastName, username, dateOfBirth, email, password, emergingAuthor);
    const user = {
      name,
      firstLastName,
      username,
      dateOfBirth,
      email,
      password,
      emergingAuthor
    }

    this.http
      .post<IJsonObject>(`${this.path}/signup`, Serialize(user, () => UserSignup))
      .pipe(map(response => Deserialize(response, () => UserLogged)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        () => {
          signupSubject.next(true);
        },
        (error) => {
          if (error.error.detail && error.error.detail.error_code) {
            this.toastr.error(
              undefined,
              this.translate.instant(error.error.detail.error_code),
              {
                timeOut: 3000,
                positionClass: 'toast-bottom-center',
              }
            );
          } else {
            this.toastr.error(
              this.translate.instant('SIGNUP.MESSAGEERROR'),
              this.translate.instant('SIGNUP.TITLEERROR'),
              {
                timeOut: 3000,
                positionClass: 'toast-bottom-center',
              }
            );
          }
          signupSubject.next(false);
        }
      );

    return signupSubject.asObservable();
  }

  /**
   * Logs the user out
   */
  logout(): Observable<void> {
    return this.http.get<void>(`${this.path}/logout`);
  }

  /**
   * Gets the stored data of the user
   */
  getUserStored(): SessionUserData | undefined {
    return AuthService.getUserData();
  }

  getToken(): string {
    return sessionStorage.getItem('token') as string;
  }

  getCurrentUser(): Observable<User> {
    return this.http
      .get<IJsonObject>(`${this.path}/current-user/`)
      .pipe(map(data => Deserialize(data, () => User)));
  }

  checkEmail(value: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.path}/check-email/${value}`);
  }

  checkUsername(value: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.path}/check-username/${value}`);
  }
}
