import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  ViewChild,
  DestroyRef,
} from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
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
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Review } from '../../../models/review';
import { User } from '../../../models/user';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ReviewService } from '../../../services/review.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ReviewModalComponent } from '../../admin/admin-review-list/review-modal/review-modal.component';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-review-table',
  standalone: true,
  imports: [
    DatePipe,
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    TranslateModule,
    NgClass,
    MatHeaderCellDef,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
  templateUrl: './review-table.component.html',
  styleUrl: './review-table.component.scss',
})
export class ReviewTableComponent implements AfterViewInit {
  @Input() columnsToDisplay = [
    'id',
    'content',
    'title',
    'username',
    'rating',
    'status',
    'actions',
  ];
  @Input() tableData: Review[] = [];
  @Input() dataSource = new MatTableDataSource<Review>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private reviewService: ReviewService,
    private destroyRef: DestroyRef,
    private toastr: ToastrService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'status':
          return item.disabled;
        case 'username':
          return item.user.username;
        default:
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          return item[property];
      }
    };
  }

  getStatusClass(user: Review): string {
    let baseClass = 'table-chip';
    if (user.disabled) {
      baseClass = baseClass + '--deleted';
    } else {
      baseClass = baseClass + '--active';
    }

    return baseClass;
  }

  getStatusIcon(user: User): string {
    if (user.disabled) {
      return 'trash-outline';
    } else {
      return 'checkmark-done-outline';
    }
  }

  reviewContentPreview(review: Review): string {
    return review.content.length > 65
      ? review.content.substring(0, 65) + '...'
      : review.content;
  }

  reviewTitlePreview(review: Review): string {
    return review.title.length > 30
      ? review.title.substring(0, 30) + '...'
      : review.title;
  }

  changeStatus(review: Review, disabled: boolean): void {
    const updatedReview = { ...review };
    updatedReview.disabled = disabled;
    this.reviewService
      .updateReview(updatedReview)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        () => {
          review.disabled = disabled;
          this.toastr.success(
            undefined,
            this.translate.instant('ADMINREVIEWS.SUCCESSREVIEWSTATUS'),
            {
              timeOut: 3000,
              positionClass: 'toast-bottom-center',
            }
          );
        },
        () => {
          this.toastr.error(
            undefined,
            this.translate.instant('ADMINREVIEWS.ERRORREVIEWSTATUS'),
            {
              timeOut: 3000,
              positionClass: 'toast-bottom-center',
            }
          );
        }
      );
  }

  openReviewModal(review: Review): void {
    const reviewDetailsModalOptions = {
      width: '38rem',
      data: review,
    };

    this.dialog.open(ReviewModalComponent, reviewDetailsModalOptions);
  }
}
