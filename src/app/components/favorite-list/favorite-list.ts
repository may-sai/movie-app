import { Component, inject } from '@angular/core';
import { MovieService } from '../../services/movie-service';
import { MovieGrid } from '../movie-grid/movie-grid';

@Component({
  selector: 'app-favorite-list',
  imports: [MovieGrid],
  templateUrl: './favorite-list.html',
  styleUrl: './favorite-list.css',
})
export class FavoriteList {

  movieService = inject(MovieService);

}
