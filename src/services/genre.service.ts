import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { DeserializeArray, IJsonObject } from 'dcerialize';
import { map, Observable } from 'rxjs';
import { Genre } from '../models/genre';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  /**
   * API path
   */
  path = '/genre';

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {
    this.path = this.api.getApiUrl() + this.path;
  }

  /**
   * Get all genres
   */
  getGenres(): Observable<Genre[]> {
    return this.http
      .get<IJsonObject[]>(`${this.path}/`)
      .pipe(map(data => DeserializeArray(data, () => Genre)));
  }
}
