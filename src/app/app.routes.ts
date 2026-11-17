import { Routes } from '@angular/router';
import { MovieList } from './components/movie-list/movie-list';
import { MovieDetail } from './components/movie-detail/movie-detail';
import { WishList } from './components/wish-list/wish-list';
import { FavoriteList } from './components/favorite-list/favorite-list';
import { WatchedList } from './components/watched-list/watched-list';

export const routes: Routes = [

  { path: '', component: MovieList },
  { path: 'wishlist', component: WishList },
  { path: 'favorites', component: FavoriteList },
  { path: 'watched', component: WatchedList },
  { path: ':id', component: MovieDetail },
  { path: '**', redirectTo: '', pathMatch: 'full' },

];
