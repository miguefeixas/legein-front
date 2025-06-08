import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import {
  Deserialize,
  DeserializeArray,
  IJsonObject,
  Serialize,
} from 'dcerialize';
import {
  CompleteUser,
  KpiEmergingAuthorsData,
  KpiUserData,
  User,
  UserPassword,
} from 'src/models/user';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * API path
   */
  path = '/user';

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {
    this.path = this.api.getApiUrl() + this.path;
  }

  /**
   * Get all users created in the last 7 days
   */
  getUsersLastSevenDays(): Observable<KpiUserData> {
    return this.http
      .get<IJsonObject>(`${this.path}/users-last-seven-days/`)
      .pipe(map(data => Deserialize(data, () => KpiUserData)));
  }

  /**
   * Get all emerging authors created in the last 7 days
   */
  getEmergingAuthorsLastSevenDays(): Observable<KpiEmergingAuthorsData> {
    return this.http
      .get<IJsonObject>(`${this.path}/emerging-last-seven-days/`)
      .pipe(map(data => Deserialize(data, () => KpiEmergingAuthorsData)));
  }

  /**
   * Update the user profile
   */
  updateProfile(updatedUser: User, userId: number): Observable<User> {
    return this.http
      .patch<IJsonObject>(
        `${this.path}/admin/${userId}`,
        Serialize(updatedUser, () => User)
      )
      .pipe(map(data => Deserialize(data, () => User)));
  }

  /**
   * Change the admin password
   */
  changePassword(password: UserPassword, userId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.path}/admin/password/${userId}`,
      Serialize(password, () => UserPassword)
    );
  }

  /**
   * Get all users
   */
  getAllUsers(): Observable<User[]> {
    return this.http
      .get<IJsonObject[]>(`${this.path}/`)
      .pipe(map(data => DeserializeArray(data, () => User)));
  }

  /**
   * Get the complete profile of a user
   */
  getFullProfile(userId: number): Observable<CompleteUser> {
    return this.http
      .get<IJsonObject>(`${this.path}/${userId}/profile`)
      .pipe(map(data => Deserialize(data, () => CompleteUser)));
  }

  /**
   * Update the user profile
   */
  updateUserProfile(updatedUser: User, userId: number): Observable<User> {
    return this.http
      .patch<IJsonObject>(
        `${this.path}/user/${userId}`,
        Serialize(updatedUser, () => User)
      )
      .pipe(map(data => Deserialize(data, () => User)));
  }

  activateUser(userId: number): Observable<void> {
    return this.http.put<void>(`${this.path}/${userId}/activate/`, {});
  }

  deactivateUser(userId: number): Observable<void> {
    return this.http.put<void>(`${this.path}/${userId}/deactivate/`, {});
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.path}/${userId}/`);
  }
}
