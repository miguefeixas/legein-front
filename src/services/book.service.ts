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
import { Book, KpiBooksData } from '../models/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  /**
   * API path
   */
  path = '/book';

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
  getBooksLastSevenDays(): Observable<KpiBooksData> {
    return this.http
      .get<IJsonObject>(`${this.path}/books-last-seven-days/`)
      .pipe(map(data => Deserialize(data, () => KpiBooksData)));
  }

  /**
   * Get all pending books
   */
  getPendingBooks(): Observable<Book[]> {
    return this.http
      .get<IJsonObject[]>(`${this.path}/pending-books/`)
      .pipe(map(data => DeserializeArray(data, () => Book)));
  }

  /**
   * Get all books
   */
  getAllBooks(): Observable<Book[]> {
    return this.http
      .get<IJsonObject[]>(`${this.path}/`)
      .pipe(map(data => DeserializeArray(data, () => Book)));
  }

  /**
   * Insert a new book
   */
  insertBook(book: Book): Observable<Book> {
    return this.http
      .post<IJsonObject>(
        `${this.path}/`,
        Serialize(book, () => Book)
      )
      .pipe(map(data => Deserialize(data, () => Book)));
  }

  uploadImage(
    newBookId: number | undefined,
    formData: FormData
  ): Observable<void> {
    return this.http.patch<void>(
      `${this.path}/upload-image/${newBookId}/`,
      formData
    );
  }

  getBookById(id: number): Observable<Book> {
    return this.http
      .get<IJsonObject>(`${this.path}/${id}/`)
      .pipe(map(data => Deserialize(data, () => Book)));
  }

  updateBook(book: Book): Observable<Book> {
    return this.http
      .put<IJsonObject>(
        `${this.path}/${book.id}/`,
        Serialize(book, () => Book)
      )
      .pipe(map(data => Deserialize(data, () => Book)));
  }

  acceptBook(book: Book): Observable<Book> {
    return this.http
      .patch<IJsonObject>(`${this.path}/${book.id}/accept/`, undefined)
      .pipe(map(data => Deserialize(data, () => Book)));
  }

  getRandomBook(): Observable<Book> {
    return this.http
      .get<IJsonObject>(`${this.path}/random/`)
      .pipe(map(data => Deserialize(data, () => Book)));
  }
}
