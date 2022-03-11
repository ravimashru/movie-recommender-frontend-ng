import { TestBed, waitForAsync } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { CacheService } from './cache.service';
import { UserService } from './user.service';
import { endpoints } from '../endpoints';

describe('UserService', () => {
  let service: UserService;
  let cacheService: CacheService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CacheService],
    });
    service = TestBed.inject(UserService);
    cacheService = TestBed.inject(CacheService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(
    'should get new ID from backend for new user',
    waitForAsync(() => {
      spyOn(cacheService, 'get').and.returnValue(null);
      const cacheSet = spyOn(cacheService, 'set');

      const mockBackendResponse = { id: '123-456' };

      service.getUserId().subscribe({
        next: (value) => {
          expect(value).toEqual('123-456');
          expect(cacheSet).toHaveBeenCalledOnceWith(
            service.USER_ID_KEY,
            '123-456'
          );
        },
      });

      const req = httpTestingController.expectOne(endpoints.USER);
      expect(req.request.method).toEqual('GET');
      req.flush(mockBackendResponse);

      httpTestingController.verify();
    })
  );

  it(
    'should return ID from storage for returning user',
    waitForAsync(() => {
      spyOn(cacheService, 'get').and.returnValue('123');

      service.getUserId().subscribe({
        next: (value) => {
          expect(value).toEqual('123');
        },
      });

      httpTestingController.expectNone(endpoints.USER);
      httpTestingController.verify();
    })
  );

  it('should return the number of movies rated by a user', () => {
    spyOn(cacheService, 'get').and.returnValue('123');

    const mockBackendResponse = {
      id: '123',
      movies_rated_count: 5,
    };

    service.getMoviesRatedCount().subscribe({
      next: (count) => {
        expect(count).toEqual(5);
      },
    });

    const req = httpTestingController.expectOne(`${endpoints.USER}/${123}`);
    req.flush(mockBackendResponse);
    httpTestingController.verify();
  });
});
