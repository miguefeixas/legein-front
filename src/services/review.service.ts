import { DestroyRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import {
  Deserialize,
  DeserializeArray,
  IJsonObject,
  Serialize,
} from 'dcerialize';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { KpiReviewsData, Review } from '../models/review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  /**
   * API path
   */
  path = '/review';

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private authService: AuthService,
    private destroyRef: DestroyRef
  ) {
    this.path = this.api.getApiUrl() + this.path;
  }

  /**
   * Get all books created in the last 7 days
   */
  getReviewsLastSevenDays(): Observable<KpiReviewsData> {
    return this.http
      .get<IJsonObject>(`${this.path}/reviews-last-seven-days/`)
      .pipe(map(data => Deserialize(data, () => KpiReviewsData)));
  }

  getAllReviews(): Observable<Review[]> {
    return this.http
      .get<IJsonObject[]>(`${this.path}/`)
      .pipe(map(data => DeserializeArray(data, () => Review)));
  }

  updateReview(review: Review): Observable<Review> {
    return this.http
      .put<IJsonObject>(
        `${this.path}/${review.id}/`,
        Serialize(review, () => Review)
      )
      .pipe(map(data => Deserialize(data, () => Review)));
  }

  getBookReviews(bookId: number, limit?: number): Observable<Review[]> {
    let url = `${this.path}/book/${bookId}/`;

    if (limit) {
      url = `${url}?limit=${limit}`;
    }

    return this.http
      .get<IJsonObject[]>(url)
      .pipe(map(data => DeserializeArray(data, () => Review)));
  }

  getUserReviews(userId: number): Observable<Review[]> {
    const url = `${this.path}/user/${userId}/`;

    return this.http
      .get<IJsonObject[]>(url)
      .pipe(map(data => DeserializeArray(data, () => Review)));
  }

  getFriendReviews(): Observable<Review[]> {
    const url = `${this.path}/friends-reviews/`;

    return this.http
      .get<IJsonObject[]>(url)
      .pipe(map(data => DeserializeArray(data, () => Review)));
  }
}
