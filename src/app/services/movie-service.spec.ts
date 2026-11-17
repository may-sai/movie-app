import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { MovieService } from './movie-service';
import { Movie } from '../interfaces/movie';

const fakeMovie = (id: number): Movie => ({
  adult: false, backdrop_path: '', genre_ids: [], id, title: `Movie ${id}`,
  original_language: 'en', original_title: `Movie ${id}`, overview: '',
  popularity: 0, poster_path: '', release_date: '2026-01-01',
  softcore: false, video: false, vote_average: 7, vote_count: 10,
});

describe('MovieService', () => {
  let service: MovieService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(MovieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('adds a movie to the wishlist and saves it in localStorage', () => {
    service.addToWishList(fakeMovie(1));
    expect(service.wishList().length).toBe(1);
    expect(JSON.parse(localStorage.getItem('wishList')!).length).toBe(1);
  });

  it('does not add the same movie twice', () => {
    service.addToWishList(fakeMovie(1));
    service.addToWishList(fakeMovie(1));
    expect(service.wishList().length).toBe(1);
  });

  it('removes a movie from the wishlist', () => {
    service.addToWishList(fakeMovie(1));
    service.addToWishList(fakeMovie(2));
    service.removeFromWishList(1);
    expect(service.wishList().map(m => m.id)).toEqual([2]);
    expect(JSON.parse(localStorage.getItem('wishList')!).length).toBe(1);
  });

  it('toggles a movie in favorites and watched lists', () => {
    service.toggleFavorites(fakeMovie(5));
    service.toggleWatched(fakeMovie(5));
    expect(service.isInFavorites(5)).toBe(true);
    expect(service.isInWatched(5)).toBe(true);
    service.toggleFavorites(fakeMovie(5));
    expect(service.isInFavorites(5)).toBe(false);
    expect(service.isInWatched(5)).toBe(true);
  });

  it('reloads the lists from localStorage after a page refresh', () => {
    service.addToWishList(fakeMovie(7));
    service.toggleFavorites(fakeMovie(8));

    // Simule un rechargement de la page : nouveau service, même localStorage
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    const reloaded = TestBed.inject(MovieService);

    expect(reloaded.wishList().map(m => m.id)).toEqual([7]);
    expect(reloaded.favoriteList().map(m => m.id)).toEqual([8]);
  });

  it('ignores corrupted localStorage data', () => {
    localStorage.setItem('wishList', '{not json');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    expect(TestBed.inject(MovieService).wishList()).toEqual([]);
  });
});
