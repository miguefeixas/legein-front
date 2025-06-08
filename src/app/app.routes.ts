import { Routes } from '@angular/router';
import { AuthAdminComponent } from './admin/auth-admin/auth-admin.component';
import { LoginAdminComponent } from './admin/auth-admin/login-admin/login-admin.component';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from '../guards/admin.guard';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { GeneralGuard } from 'src/guards/general.guard';
import { UserRole } from 'src/definitions/user-role.enum';
import { AdminBookListComponent } from './admin/admin-book-list/admin-book-list.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { AdminUserListComponent } from './admin/admin-user-list/admin-user-list.component';
import { AdminBookDetailsComponent } from './admin/admin-book-list/admin-book-details/admin-book-details.component';
import { AdminReviewListComponent } from './admin/admin-review-list/admin-review-list.component';
import { UsersHomeComponent } from './users/users-home/users-home.component';
import { UsersComponent } from './users/users.component';
import { AuthComponent } from './users/auth/auth.component';
import { UsersLoginComponent } from './users/users-login/users-login.component';
import { UsersSignupComponent } from './users/users-signup/users-signup.component';
import { UserGuard } from '../guards/user.guard';
import { LoggedUsersHomeComponent } from './users/logged-users-home/logged-users-home.component';
import { UsersProfileComponent } from './users/users-profile/users-profile.component';
import { UsersBookDetailsComponent } from './users/users-book-details/users-book-details.component';
import { UsersBooksComponent } from './users/users-books/users-books.component';
import { UsersBooklistsComponent } from './users/users-booklists/users-booklists.component';
import { UsersReviewsComponent } from './users/users-reviews/users-reviews.component';
import { UserDetailsComponent } from './admin/admin-user-list/user-details/user-details.component';
import { UsersListsComponent } from './users/users-lists/users-lists.component';

export const routes: Routes = [
  // Routes for admin where no authentication is required
  {
    path: 'admin',
    component: AuthAdminComponent,
    canActivate: [GeneralGuard],
    data: { role: UserRole.ADMIN },
    children: [
      {
        path: 'login',
        component: LoginAdminComponent,
        data: { role: UserRole.ADMIN },
        canActivate: [GeneralGuard],
      },
    ],
  },
  // Routes for admin where authentication is required
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    data: { role: UserRole.ADMIN },
    children: [
      {
        path: 'home',
        component: AdminHomeComponent,
        data: { role: UserRole.ADMIN },
        canActivate: [AdminGuard],
      },
      {
        path: 'books',
        component: AdminBookListComponent,
        data: { role: UserRole.ADMIN },
        canActivate: [AdminGuard],
      },
      {
        path: 'profile',
        component: AdminProfileComponent,
        data: { role: UserRole.ADMIN },
        canActivate: [AdminGuard],
      },
      {
        path: 'users',
        component: AdminUserListComponent,
        data: { role: UserRole.ADMIN },
        canActivate: [AdminGuard],
      },
      {
        path: 'users/:id',
        component: UserDetailsComponent,
        data: { role: UserRole.ADMIN },
        canActivate: [AdminGuard],
      },
      {
        path: 'books/:id',
        component: AdminBookDetailsComponent,
        data: { role: UserRole.ADMIN },
        canActivate: [AdminGuard],
      },
      {
        path: 'reviews',
        component: AdminReviewListComponent,
        data: { role: UserRole.ADMIN },
        canActivate: [AdminGuard],
      },
    ],
  },
  // Routes for users where no authentication is required
  {
    path: '',
    component: UsersComponent,
    canActivate: [GeneralGuard],
    data: { role: UserRole.USER },
    children: [
      {
        path: 'home',
        component: UsersHomeComponent,
        data: { role: UserRole.USER },
        canActivate: [GeneralGuard],
      },
    ],
  },
  {
    path: 'login',
    component: AuthComponent,
    data: { action: 'login', role: UserRole.USER },
    canActivate: [GeneralGuard],
  },
  {
    path: 'signup',
    component: AuthComponent,
    data: { action: 'signup' },
    canActivate: [GeneralGuard],
  },
  // Routes for users where authentication is required
  {
    path: 'users',
    component: UsersComponent,
    data: { role: UserRole.USER },
    canActivate: [UserGuard],
    children: [
      {
        path: 'home',
        component: LoggedUsersHomeComponent,
        data: { role: UserRole.USER },
        canActivate: [UserGuard],
      },
      {
        path: 'profile',
        component: UsersProfileComponent,
        data: { role: UserRole.USER },
        canActivate: [UserGuard],
      },
      {
        path: 'books',
        component: UsersBooksComponent,
        data: { role: UserRole.USER },
        canActivate: [UserGuard],
      },
      {
        path: 'books/:id',
        component: UsersBookDetailsComponent,
        data: { role: UserRole.USER },
        canActivate: [UserGuard],
      },
      {
        path: 'list/:id',
        component: UsersBooklistsComponent,
        data: { role: UserRole.USER },
        canActivate: [UserGuard],
      },
      {
        path: 'reviews',
        component: UsersReviewsComponent,
        data: { role: UserRole.USER },
        canActivate: [UserGuard],
      },
      {
        path: 'lists',
        component: UsersListsComponent,
        data: { role: UserRole.USER },
        canActivate: [UserGuard],
      }
    ]
  }
];
