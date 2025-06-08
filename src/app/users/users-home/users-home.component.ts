import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, OnInit } from '@angular/core';
import { SessionUserData } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { BookService } from '../../../services/book.service';
import { ReviewService } from '../../../services/review.service';
import { Book } from '../../../models/book';
import { Review } from '../../../models/review';
import { TranslateModule } from '@ngx-translate/core';
import { TextLimitPipe } from '../../../utils/pipes/textlimit.pipe';
import { DatePipe } from '@angular/common';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-users-home',
  standalone: true,
  imports: [
    MatButton,
    RouterLink,
    TranslateModule,
    TextLimitPipe,
    DatePipe,
  ],
  templateUrl: './users-home.component.html',
  styleUrl: './users-home.component.scss'
})
export class UsersHomeComponent implements OnInit {
  user: SessionUserData | undefined;
  book: Book | undefined;
  reviews: Review[] = [];
  numberOfGenres = 0;
  constructor(
    private authService: AuthService,
    private destroyRef: DestroyRef,
    private bookService: BookService,
    private reviewService: ReviewService,
  ) {}

  ngOnInit(): void {
    this.authService.currentStoredUser
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.user = user;
      });
    this.user = this.authService.getUserStored();

    this.bookService.getRandomBook().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(book => {
      this.book = book;
      this.numberOfGenres = book.genres ? book.genres.length : 0;
      this.reviewService.getBookReviews(book.id, 3).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(reviews => {
        this.reviews = reviews;
      });
    });
  }
}
