import { Component, inject } from '@angular/core';
import { MovieService } from '../../services/movie-service';
import { MovieGrid } from '../movie-grid/movie-grid';

@Component({
  selector: 'app-watched-list',
  imports: [MovieGrid],
  templateUrl: './watched-list.html',
  styleUrl: './watched-list.css',
})
export class WatchedList {

  movieService = inject(MovieService);

}
