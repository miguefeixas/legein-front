import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReviewService } from 'src/services/review.service';
import { Review } from 'src/models/review';
import { ReviewTableComponent } from 'src/app/tables/review-table/review-table.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-admin-review-list',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatOption,
    MatSelect,
    MatSuffix,
    ReviewTableComponent,
  ],
  templateUrl: './admin-review-list.component.html',
  styleUrl: './admin-review-list.component.scss',
})
export class AdminReviewListComponent implements OnInit {
  searchUsername = '';
  selectedStatus = '';
  selectedRating = 0;
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  reviewStatuses: string[] = ['ACTIVE', 'DELETED'];
  ratings: number[] = [1, 2, 3, 4, 5];
  dataSource = new MatTableDataSource<Review>([]);

  constructor(
    private reviewService: ReviewService,
    private destroyRef: DestroyRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.reviewService
      .getAllReviews()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(reviews => {
        this.reviews = reviews;
        this.filteredReviews = reviews;
        this.dataSource.data = this.filteredReviews;
        this.route.fragment.subscribe(fragment => {
          if (fragment) {
            this.searchUsername = fragment;
            this.applyFilter();
          }
        });
      });


  }

  applyFilter(): void {
    this.filteredReviews = this.reviews.filter(review => {
      let matchesUsername = true;
      if (this.searchUsername && review.user.username) {
        matchesUsername = this.searchUsername
          ? review.user.username
              .toLowerCase()
              .includes(this.searchUsername.toLowerCase())
          : true;
      } else if (this.searchUsername) {
        matchesUsername = false;
      }
      const matchesStatus = this.selectedStatus
        ? this.getStatus(review) === this.selectedStatus
        : true;

      const matchesRating = this.selectedRating
        ? review.rating === this.selectedRating
        : true;

      return matchesUsername && matchesStatus && matchesRating;
    });

    this.dataSource.data = this.filteredReviews;
  }

  removeContent($event: MouseEvent): void {
    if (this.searchUsername !== '') {
      this.searchUsername = '';
      this.applyFilter();
      $event.stopPropagation();
    }
  }

  getStatus(review: Review): string {
    return review.disabled ? 'DELETED' : 'ACTIVE';
  }
}
