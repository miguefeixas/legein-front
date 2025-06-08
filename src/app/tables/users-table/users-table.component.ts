import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatMenu, MatMenuItem } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { User } from 'src/models/user';
import { DatePipe, NgClass } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { getUserStatus, UserStatus } from 'src/definitions/user-status';
import { RouterLink } from '@angular/router';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-users-table',
  standalone: true,
  imports: [
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatMenu,
    MatMenuItem,
    MatRow,
    MatRowDef,
    MatTable,
    TranslateModule,
    MatHeaderCellDef,
    NgClass,
    DatePipe,
    MatPaginator,
    MatSort,
    MatSortModule,
    RouterLink,
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
})
export class UsersTableComponent implements OnChanges, AfterViewInit {
  @Input() columnsToDisplay = [
    'id',
    'fullname',
    'username',
    'createdAt',
    'role',
    'status',
    'details',
  ];
  @Input() tableData: User[] = [];
  @Input() dataSource = new MatTableDataSource<User>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      this.sortByStatus();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'fullname':
          return item.name + ' ' + item.firstLastName;
        case 'role':
          return item.userRole;
        case 'status':
          return getUserStatus(item);
        default:
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          return item[property];
      }
    };
    this.sortByStatus();
  }

  getStatusClass(user: User): string {
    let baseClass = 'table-chip';
    if (user.disabled) {
      if (user.createdAt?.toISOString() === user.modifiedAt?.toISOString()) {
        baseClass = baseClass + '--pending';
      } else {
        baseClass = baseClass + '--deleted';
      }
    } else {
      baseClass = baseClass + '--active';
    }

    return baseClass;
  }

  getStatusIcon(user: User): string {
    if (user.disabled) {
      if (user.createdAt?.toISOString() === user.modifiedAt?.toISOString()) {
        return 'pause-outline';
      } else {
        return 'trash-outline';
      }
    } else {
      return 'checkmark-done-outline';
    }
  }

  getStatusTranslationKey(user: User): string {
    if (user.disabled) {
      if (user.createdAt?.toISOString() === user.modifiedAt?.toISOString()) {
        return 'USERS.TABLE.STATUS.PENDING';
      } else {
        return 'USERS.TABLE.STATUS.DELETED';
      }
    } else {
      return 'USERS.TABLE.STATUS.ACTIVE';
    }
  }

  sortByStatus(): void {
    this.dataSource.filteredData = this.dataSource.filteredData.sort((a, b) => {
      const statusA = getUserStatus(a);
      const statusB = getUserStatus(b);
      if (statusA === UserStatus.PENDING && statusB !== UserStatus.PENDING) {
        return 1;
      } else if (
        statusA !== UserStatus.PENDING &&
        statusB === UserStatus.PENDING
      ) {
        return -1;
      } else {
        return 0;
      }
    });
  }
}
