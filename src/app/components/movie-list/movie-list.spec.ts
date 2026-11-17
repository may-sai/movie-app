import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { MovieList } from './movie-list';

describe('MovieList', () => {
  let fixture: ComponentFixture<MovieList>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieList],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(MovieList);
    fixture.detectChanges();
  });

  it('shows one card per movie returned by the API', () => {
    http.expectOne(r => r.url.includes('now_playing')).flush({
      results: [
        { id: 1, title: 'Alpha', poster_path: '/a.jpg' },
        { id: 2, title: 'Beta', poster_path: '/b.jpg' },
      ],
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.movie-card').length).toBe(2);
  });
});
