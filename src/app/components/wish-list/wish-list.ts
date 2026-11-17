import { Component, inject } from '@angular/core';
import { MovieService } from '../../services/movie-service';
import { MovieGrid } from '../movie-grid/movie-grid';

@Component({
  selector: 'app-wish-list',
  imports: [MovieGrid],
  templateUrl: './wish-list.html',
  styleUrl: './wish-list.css',
})
export class WishList {

  movieService = inject(MovieService);

}
