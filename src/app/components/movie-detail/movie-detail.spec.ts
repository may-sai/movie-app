import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { MovieDetail } from './movie-detail';
import { MovieService } from '../../services/movie-service';

const movie = {
  id: 42, title: 'Alpha', original_title: 'Alpha', original_language: 'en', overview: 'Resume',
  poster_path: '/p.jpg', release_date: '2026-01-01', vote_average: 8, vote_count: 10,
};

describe('MovieDetail', () => {
  let fixture: ComponentFixture<MovieDetail>;
  let http: HttpTestingController;
  let service: MovieService;

  const root = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [MovieDetail],
      providers: [
        provideHttpClient(), provideHttpClientTesting(), provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: '42' })) } },
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(MovieService);
    fixture = TestBed.createComponent(MovieDetail);
    fixture.detectChanges();
  });

  it('shows the trailer, the cast and the similar movies', () => {
    http.expectOne(r => !r.url.includes('append_to_response')).flush(movie);
    http.expectOne(r => r.url.includes('append_to_response')).flush({
      videos: { results: [{ key: 'abc123', site: 'YouTube', type: 'Trailer', official: true }] },
      credits: { cast: [{ credit_id: 'c1', name: 'Jane Doe', character: 'Hero', profile_path: null }] },
      similar: { results: [{ ...movie, id: 7, title: 'Beta' }] },
    });
    fixture.detectChanges();

    expect(root().textContent).toContain('Resume');
    expect(root().querySelector('iframe')).toBeTruthy();
    expect(root().textContent).toContain('Jane Doe');
    expect(root().textContent).toContain('Beta');
  });

  it('hides the extras sections when TMDB returns nothing', () => {
    http.expectOne(r => !r.url.includes('append_to_response')).flush(movie);
    http.expectOne(r => r.url.includes('append_to_response')).flush({
      videos: { results: [] }, credits: { cast: [] }, similar: { results: [] },
    });
    fixture.detectChanges();
    expect(root().querySelector('iframe')).toBeNull();
    expect(root().textContent).not.toContain('Cast');
    expect(root().textContent).not.toContain('Similar movies');
  });

  it('still shows the movie if the extras request fails', () => {
    http.expectOne(r => !r.url.includes('append_to_response')).flush(movie);
    http.expectOne(r => r.url.includes('append_to_response')).flush('x', { status: 500, statusText: 'Error' });
    fixture.detectChanges();
    expect(root().textContent).toContain('Resume');
  });

  it('toggles the wishlist button', () => {
    http.expectOne(r => !r.url.includes('append_to_response')).flush(movie);
    http.expectOne(r => r.url.includes('append_to_response')).flush({
      videos: { results: [] }, credits: { cast: [] }, similar: { results: [] },
    });
    fixture.detectChanges();
    const btn = Array.from(root().querySelectorAll('button')).find(b => b.textContent?.includes('Wishlist'))!;
    expect(btn.textContent).toContain('Add to Wishlist');
    btn.click();
    fixture.detectChanges();
    expect(service.isInWishList(42)).toBe(true);
    expect(btn.textContent).toContain('Remove from Wishlist');
  });
});
