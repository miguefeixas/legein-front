import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { DeserializeArray, IJsonObject } from 'dcerialize';
import { map, Observable } from 'rxjs';
import { Publisher } from 'src/models/publisher';

@Injectable({
  providedIn: 'root',
})
export class PublisherService {
  /**
   * API path
   */
  path = '/publisher';

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {
    this.path = this.api.getApiUrl() + this.path;
  }

  /**
   * Get all publishers
   */
  getAllPublishers(): Observable<Publisher[]> {
    return this.http
      .get<IJsonObject[]>(`${this.path}/`)
      .pipe(map(data => DeserializeArray(data, () => Publisher)));
  }
}
