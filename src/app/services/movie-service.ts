import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Movie } from '../interfaces/movie';
import { map, Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { MovieResponse } from '../interfaces/movie-response';
import { HttpClient } from '@angular/common/http';
import { MovieExtras } from '../interfaces/movie-extras';

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  private readonly http = inject(HttpClient)
  private readonly url = environment.url_api
  private readonly key = environment.api_key
  private readonly movieUrl = environment.url_movie_api

  public movieList=signal<Movie[]>([]);
  public selectedMovie = signal<Movie | null>(null);

  // Les 3 listes sont relues depuis le localStorage au démarrage du service
  public wishList = signal<Movie[]>(this.loadList('wishList'));
  public favoriteList = signal<Movie[]>(this.loadList('favoriteList'));
  public watchedList = signal<Movie[]>(this.loadList('watchedList'));

getMovieList(): Observable<Movie[]> {
  return this.http
    .get<MovieResponse>(`${this.url}?api_key=${this.key}`)
    .pipe(
      map(response => response.results),
      shareReplay({ bufferSize: 1, refCount: false })
    );
}
getMovieById(id: number): Observable<Movie> {
  return this.http
    .get<Movie>(`${this.movieUrl}/${id}?api_key=${this.key}`);
}

// Casting, bande-annonce et films similaires en un seul appel
getMovieExtras(id: number): Observable<MovieExtras> {
  return this.http
    .get<MovieExtras>(`${this.movieUrl}/${id}?api_key=${this.key}&append_to_response=videos,credits,similar`);
}

// ---------- Wishlist ----------
addToWishList(movie: Movie): void {
  this.addTo(this.wishList, 'wishList', movie);
}
removeFromWishList(id: number): void {
  this.removeFrom(this.wishList, 'wishList', id);
}
isInWishList(id: number): boolean {
  return this.wishList().some(m => m.id === id);
}
toggleWishList(movie: Movie): void {
  this.isInWishList(movie.id) ? this.removeFromWishList(movie.id) : this.addToWishList(movie);
}

// ---------- Favorites ----------
addToFavorites(movie: Movie): void {
  this.addTo(this.favoriteList, 'favoriteList', movie);
}
removeFromFavorites(id: number): void {
  this.removeFrom(this.favoriteList, 'favoriteList', id);
}
isInFavorites(id: number): boolean {
  return this.favoriteList().some(m => m.id === id);
}
toggleFavorites(movie: Movie): void {
  this.isInFavorites(movie.id) ? this.removeFromFavorites(movie.id) : this.addToFavorites(movie);
}

// ---------- Watched ----------
addToWatched(movie: Movie): void {
  this.addTo(this.watchedList, 'watchedList', movie);
}
removeFromWatched(id: number): void {
  this.removeFrom(this.watchedList, 'watchedList', id);
}
isInWatched(id: number): boolean {
  return this.watchedList().some(m => m.id === id);
}
toggleWatched(movie: Movie): void {
  this.isInWatched(movie.id) ? this.removeFromWatched(movie.id) : this.addToWatched(movie);
}

// ---------- Outils internes (localStorage) ----------
private loadList(storageKey: string): Movie[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

private saveList(storageKey: string, list: Movie[]): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(list));
  } catch {
    // localStorage indisponible ou plein : la liste reste en mémoire
  }
}

private addTo(list: WritableSignal<Movie[]>, storageKey: string, movie: Movie): void {
  if (list().some(m => m.id === movie.id)) return; // pas de doublon
  list.update(current => [...current, movie]);
  this.saveList(storageKey, list());
}

private removeFrom(list: WritableSignal<Movie[]>, storageKey: string, id: number): void {
  list.update(current => current.filter(m => m.id !== id));
  this.saveList(storageKey, list());
}
}
