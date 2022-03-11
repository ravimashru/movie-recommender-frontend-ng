import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, ignoreElements, map, mergeMap, Observable, of } from 'rxjs';
import { endpoints } from '../endpoints';
import { MovieRating } from '../models/movie-rating.model';
import { Movie, MoviesToRate } from '../models/movies-to-rate.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  constructor(private http: HttpClient, private userService: UserService) {}

  getMoviesToRate(): Observable<MoviesToRate> {
    return this.userService.getUserId().pipe(
      mergeMap((userId) => this.http.get(endpoints.USER_MOVIES(userId))),
      map((e) => e as MoviesToRate)
    );
  }

  saveRatings(ratings: Array<MovieRating>): Observable<never> {
    return this.userService.getUserId().pipe(
      mergeMap((userId) =>
        this.http.post(endpoints.USER_MOVIES(userId), { ratings })
      ),
      ignoreElements()
    );
  }

  getRecommendations(): Observable<Array<Movie>> {
    return this.userService.getUserId().pipe(
      mergeMap((userId) =>
        this.http.get(endpoints.USER_RECOMMENDATIONS(userId))
      ),
      map((response: any) => response.recommendations)
    );
  }
}
