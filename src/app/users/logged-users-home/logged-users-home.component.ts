import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Book } from '../../../models/book';
import { BookService } from '../../../services/book.service';
import { Router } from '@angular/router';
import { ReviewService } from '../../../services/review.service';
import { Review } from '../../../models/review';
import { DatePipe } from '@angular/common';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-logged-users-home',
  standalone: true,
  imports: [
    DatePipe,
  ],
  templateUrl: './logged-users-home.component.html',
  styleUrl: './logged-users-home.component.scss'
})
export class LoggedUsersHomeComponent implements OnInit {
  bookOfTheDay: Book | undefined;

  friendsReviews: Review[] = [];

  constructor(private bookService: BookService, private router: Router, private reviewService: ReviewService) {
    this.bookService.getRandomBook().subscribe(book => {
      this.bookOfTheDay = book;
    });
  }

  ngOnInit(): void {
    this.reviewService.getFriendReviews().subscribe(reviews => {
      this.friendsReviews = reviews
      this.friendsReviews.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    });
  }

  goToBookOfTheDay(): void {
    this.router.navigate(['/users/books', this.bookOfTheDay?.id]);
  }
}
