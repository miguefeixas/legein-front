import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, OnInit } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MatOption } from '@angular/material/core';
import { ReviewService } from '../../../services/review.service';
import { Review } from '../../../models/review';
import { DatePipe } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-users-book-details',
  standalone: true,
  imports: [
    MatOption,
    DatePipe,
    MatFormField,
    MatSelect,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatLabel,
  ],
  templateUrl: './users-book-details.component.html',
  styleUrl: './users-book-details.component.scss'
})
export class UsersBookDetailsComponent implements OnInit {
  book: Book | undefined;
  reviews: Review[] = [];
  reviewForm: FormGroup;

  constructor(private bookService: BookService, private route: ActivatedRoute, private destroyRef: DestroyRef, private reviewService: ReviewService) {
    this.reviewForm = new FormGroup({
      rating: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        if (params['id']) {
          this.bookService.getBookById(params['id']).subscribe(book => {
            this.book = book;
            this.reviewService.getBookReviews(book.id).subscribe(reviews => {
              this.reviews = reviews;
            });
          });
        }
      });
  }

  submitReview(): void {
    if (this.reviewForm.invalid || !this.book) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const newReview: Partial<Review> = {
      rating: this.reviewForm.get('rating')?.value,
      content: this.reviewForm.get('content')?.value,
      title: this.reviewForm.get('title')?.value,
      bookId: this.book.id,
    };

    this.reviewService
      .createReview(newReview as Review)
      .subscribe(review => {
        this.reviews.push(review);
        this.reviewForm.reset();
      });
  }
}
