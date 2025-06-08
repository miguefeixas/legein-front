import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import {
  Deserialize,
  DeserializeArray,
  IJsonObject,
  Serialize,
} from 'dcerialize';
import { map, Observable } from 'rxjs';
import { BookList } from '../models/book-list';

@Injectable({
  providedIn: 'root',
})
export class BookListService {
  /**
   * API path
   */
  path = '/book-list';

  constructor(private http: HttpClient, private api: ApiService) {
    this.path = this.api.getApiUrl() + this.path;
  }

  /**
   * Create a new book list
   */
  createBookList(list: BookList): Observable<BookList> {
    return this.http
      .post<IJsonObject>(`${this.path}/`, Serialize(list, () => BookList))
      .pipe(map(data => Deserialize(data, () => BookList)));
  }

  /**
   * Return all lists of a user
   */
  getUserLists(): Observable<BookList[]> {
    return this.http
      .get<IJsonObject[]>(`${this.path}/user/`)
      .pipe(map(data => DeserializeArray(data, () => BookList)));
  }

  /**
   * Get a book list by id
   */
  getList(listId: number): Observable<BookList> {
    return this.http
      .get<IJsonObject>(`${this.path}/${listId}`)
      .pipe(map(data => Deserialize(data, () => BookList)));
  }

  /**
   * Add a book to a list
   */
  addBook(listId: number, bookId: number): Observable<BookList> {
    return this.http
      .post<IJsonObject>(`${this.path}/${listId}/books/${bookId}`, {})
      .pipe(map(data => Deserialize(data, () => BookList)));
  }

  /**
   * Remove a book from a list
   */
  removeBook(listId: number, bookId: number): Observable<BookList> {
    return this.http
      .delete<IJsonObject>(`${this.path}/${listId}/books/${bookId}`)
      .pipe(map(data => Deserialize(data, () => BookList)));
  }
}
