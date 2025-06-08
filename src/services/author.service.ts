import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Author } from '../models/author';
import { DeserializeArray, IJsonObject } from 'dcerialize';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  /**
   * API path
   */
  path = '/author';

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {
    this.path = this.api.getApiUrl() + this.path;
  }

  /**
   * Get all authors
   */
  getAuthors(): Observable<Author[]> {
    return this.http
      .get<IJsonObject[]>(`${this.path}/`)
      .pipe(map(data => DeserializeArray(data, () => Author)));
  }
}
