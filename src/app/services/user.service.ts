import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap, Observable, of, tap } from 'rxjs';
import { endpoints } from '../endpoints';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly USER_ID_KEY = 'userId';

  constructor(private cache: CacheService, private http: HttpClient) {}

  getUserId(): Observable<string> {
    const cachedUserId = this.cache.get(this.USER_ID_KEY);
    if (cachedUserId !== null) {
      return of(cachedUserId);
    }

    return this.http.get(endpoints.USER).pipe(
      map((response: any) => response.id),
      tap((id: string) => this.cache.set(this.USER_ID_KEY, id))
    );
  }

  getMoviesRatedCount(): Observable<number> {
    return this.getUserId().pipe(
      mergeMap((userId) => this.http.get(`${endpoints.USER}/${userId}`)),
      map((response: any) => response.movies_rated_count)
    );
  }
}
