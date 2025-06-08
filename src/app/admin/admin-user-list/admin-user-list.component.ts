import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UsersTableComponent } from 'src/app/tables/users-table/users-table.component';
import { UserService } from 'src/services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from 'src/models/user';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [
    TranslateModule,
    UsersTableComponent,
    MatFormField,
    MatSelect,
    MatOption,
    MatInput,
    FormsModule,
    MatSuffix,
  ],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.scss',
})
export class AdminUserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedRole = '';
  selectedStatus = '';
  searchUsername = '';
  userRoles: string[] = ['ADMIN', 'USER', 'AUTHOR'];
  userStatuses: string[] = ['PENDING', 'ACTIVE', 'DELETED'];
  dataSource = new MatTableDataSource<User>([]);
  constructor(
    private userService: UserService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.userService
      .getAllUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(users => {
        this.users = users;
        this.filteredUsers = users;
        this.dataSource.data = this.filteredUsers;
      });
  }

  applyFilter(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesRole = this.selectedRole
        ? user.userRole === this.selectedRole
        : true;
      const matchesStatus = this.selectedStatus
        ? this.getStatus(user) === this.selectedStatus
        : true;
      let matchesUsername = true;
      if (this.searchUsername && user.username) {
        matchesUsername = this.searchUsername
          ? user.username
              .toLowerCase()
              .includes(this.searchUsername.toLowerCase())
          : true;
      } else if (this.searchUsername) {
        matchesUsername = false;
      }

      return matchesRole && matchesStatus && matchesUsername;
    });
    this.dataSource.data = this.filteredUsers;
  }

  getStatus(user: User): string {
    if (user.disabled) {
      return user.createdAt?.toISOString() === user.modifiedAt?.toISOString()
        ? 'PENDING'
        : 'DELETED';
    } else {
      return 'ACTIVE';
    }
  }

  removeContent($event: MouseEvent): void {
    if (this.searchUsername !== '') {
      this.searchUsername = '';
      this.applyFilter();
      $event.stopPropagation();
    }
  }

  getSearchIcon(): string {
    return this.searchUsername !== '' ? 'close-outline' : 'search-outline';
  }
}
