import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import {
  KpiEmergingAuthorsData,
  KpiUserData,
  SessionUserData,
} from '../../../models/user';
import { AuthService } from '../../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../services/user.service';
import { NgClass } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { BookService } from '../../../services/book.service';
import { Book, KpiBooksData } from '../../../models/book';
import { KpiReviewsData } from '../../../models/review';
import { ReviewService } from '../../../services/review.service';
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
import { BookTableComponent } from '../../tables/book-table/book-table.component';
import { Observable } from 'rxjs';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-admin-home',
  standalone: true,
  imports: [
    TranslateModule,
    NgClass,
    MatTooltip,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatHeaderRowDef,
    BookTableComponent,
  ],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss',
})
export class AdminHomeComponent implements OnInit {
  user: SessionUserData | undefined;

  lastSevenDaysUsers: KpiUserData | undefined;
  lastWeekUsers = 0;
  lastWeekUsersIcon = 'trending-up-outline';
  lastWeekUsersClass = 'success-color-500';
  lastWeekUsersPercentage = 0;
  lastWeekUsersPercentageKey = 'ADMINHOME.KPIS.PERCENTAGERISE';

  lastSevenDaysEmergingAuthors: KpiEmergingAuthorsData | undefined;
  lastWeekEmergingAuthors = 0;
  lastWeekEmergingAuthorsIcon = 'trending-up-outline';
  lastWeekEmergingAuthorsClass = 'success-color-500';
  lastWeekEmergingAuthorsPercentage = 0;
  lastWeekEmergingAuthorsPercentageKey = 'ADMINHOME.KPIS.PERCENTAGERISE';

  lastSevenDaysBooks: KpiBooksData | undefined;
  lastWeekBooks = 0;
  lastWeekBooksIcon = 'trending-up-outline';
  lastWeekBooksClass = 'success-color-500';
  lastWeekBooksPercentage = 0;
  lastWeekBooksPercentageKey = 'ADMINHOME.KPIS.PERCENTAGERISE';

  lastSevenDaysReviews: KpiReviewsData | undefined;
  lastWeekReviews = 0;
  lastWeekReviewsIcon = 'trending-up-outline';
  lastWeekReviewsClass = 'success-color-500';
  lastWeekReviewsPercentage = 0;
  lastWeekReviewsPercentageKey = 'ADMINHOME.KPIS.PERCENTAGERISE';

  columnsToDisplay = ['id', 'title', 'isbn', 'status', 'actions-details'];
  tableData: Book[] = [];
  dataSource = new MatTableDataSource<Book>([]);

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private bookService: BookService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.bookService.getPendingBooks().subscribe(books => {
      this.tableData = books;
      this.dataSource.data = books;
    });

    this.user = this.authService.getUserStored();

    this.subscribeToKpiData(
      this.userService.getUsersLastSevenDays(),
      data => (this.lastSevenDaysUsers = data),
      kpi => {
        this.lastWeekUsers = kpi.thisWeek.length;
        this.lastWeekUsersPercentage = this.calculatePercentage(
          kpi.thisWeek.length,
          kpi.totalPastWeek
        );
        this.updateKpiDisplay(
          kpi.thisWeek.length,
          kpi.totalPastWeek,
          'lastWeekUsersIcon',
          'lastWeekUsersClass',
          'lastWeekUsersPercentageKey'
        );
      }
    );

    this.subscribeToKpiData(
      this.userService.getEmergingAuthorsLastSevenDays(),
      data => (this.lastSevenDaysEmergingAuthors = data),
      kpi => {
        this.lastWeekEmergingAuthors = kpi.thisWeek.length;
        this.lastWeekEmergingAuthorsPercentage = this.calculatePercentage(
          kpi.thisWeek.length,
          kpi.totalPastWeek
        );
        this.updateKpiDisplay(
          kpi.thisWeek.length,
          kpi.totalPastWeek,
          'lastWeekEmergingAuthorsIcon',
          'lastWeekEmergingAuthorsClass',
          'lastWeekEmergingAuthorsPercentageKey'
        );
      }
    );

    this.subscribeToKpiData(
      this.bookService.getBooksLastSevenDays(),
      data => (this.lastSevenDaysBooks = data),
      kpi => {
        this.lastWeekBooks = kpi.thisWeek.length;
        this.lastWeekBooksPercentage = this.calculatePercentage(
          kpi.thisWeek.length,
          kpi.totalPastWeek
        );
        this.updateKpiDisplay(
          kpi.thisWeek.length,
          kpi.totalPastWeek,
          'lastWeekBooksIcon',
          'lastWeekBooksClass',
          'lastWeekBooksPercentageKey'
        );
      }
    );

    this.subscribeToKpiData(
      this.reviewService.getReviewsLastSevenDays(),
      data => (this.lastSevenDaysReviews = data),
      kpi => {
        this.lastWeekReviews = kpi.thisWeek.length;
        this.lastWeekReviewsPercentage = this.calculatePercentage(
          kpi.thisWeek.length,
          kpi.totalPastWeek
        );
        this.updateKpiDisplay(
          kpi.thisWeek.length,
          kpi.totalPastWeek,
          'lastWeekReviewsIcon',
          'lastWeekReviewsClass',
          'lastWeekReviewsPercentageKey'
        );
      }
    );
  }

  [key: string]: any;

  private subscribeToKpiData<T>(
    observable: Observable<T>,
    setData: (data: T) => void,
    processKpi: (kpi: T) => void
  ): void {
    observable.subscribe((data: any) => {
      setData(data);
      if (data.thisWeek) {
        processKpi(data);
      }
    });
  }

  private calculatePercentage(thisWeek: number, totalPastWeek: number): number {
    if (totalPastWeek === 0) {
      return thisWeek > 0 ? 100 : 0;
    }

    return Math.round(
      (Math.abs(thisWeek - totalPastWeek) / totalPastWeek) * 100
    );
  }

  private updateKpiDisplay(
    thisWeek: number,
    totalPastWeek: number,
    iconKey: string,
    classKey: string,
    percentageKey: string
  ): void {
    if (thisWeek < totalPastWeek) {
      this[iconKey] = 'trending-down-outline';
      this[classKey] = 'error-color-300';
      this[percentageKey] = 'ADMINHOME.KPIS.PERCENTAGEFALL';
    } else if (thisWeek === totalPastWeek) {
      this[iconKey] = 'reorder-two-outline';
      this[classKey] = 'warn-color-800';
      this[percentageKey] = 'ADMINHOME.KPIS.PERCENTAGEEQUAL';
    }
  }
}
