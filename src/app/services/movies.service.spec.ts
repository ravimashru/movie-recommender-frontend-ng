import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { endpoints } from '../endpoints';
import { MovieRating } from '../models/movie-rating.model';
import { Movie } from '../models/movies-to-rate.model';

import { MoviesService } from './movies.service';
import { UserService } from './user.service';

describe('MoviesService', () => {
  let service: MoviesService;
  let userService: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(MoviesService);
    userService = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get movies to rate', () => {
    spyOn(userService, 'getUserId').and.returnValue(of('123'));

    const mockBackendResponse = {
      movies: [{ id: 1, title: 'movie', thumbnail_url: 'https://example.com' }],
    };

    service.getMoviesToRate().subscribe({
      next: (movies) => {
        expect(movies).toBe(mockBackendResponse);
      },
    });

    const req = httpTestingController.expectOne(endpoints.USER_MOVIES('123'));
    req.flush(mockBackendResponse);
    httpTestingController.verify();
  });

  it('should store saved ratings', () => {
    const mockUserId = '123';
    spyOn(userService, 'getUserId').and.returnValue(of(mockUserId));

    const mockRatings: Array<MovieRating> = [{ movie_id: 1, rating: 5 }];

    service.saveRatings(mockRatings).subscribe({});

    const req = httpTestingController.expectOne(
      endpoints.USER_MOVIES(mockUserId)
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ ratings: mockRatings });
    req.flush(null);
    httpTestingController.verify();
  });

  it('should get recommendations', () => {
    const mockUserId = '123';
    spyOn(userService, 'getUserId').and.returnValue(of(mockUserId));

    const mockServerResponse = {
      recommendations: [
        { id: 1, title: 'movie', thumbnail_url: 'https://example.com' },
      ] as Array<Movie>,
    };

    service.getRecommendations().subscribe({
      next: (recommendations) => {
        expect(recommendations).toBe(mockServerResponse.recommendations);
      },
    });

    const req = httpTestingController.expectOne(
      endpoints.USER_RECOMMENDATIONS(mockUserId)
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockServerResponse);
    httpTestingController.verify();
  });
});
