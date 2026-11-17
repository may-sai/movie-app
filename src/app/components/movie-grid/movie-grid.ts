import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Movie } from '../../interfaces/movie';

@Component({
  selector: 'app-movie-grid',
  imports: [FontAwesomeModule],
  templateUrl: './movie-grid.html',
  styleUrl: './movie-grid.css',
})
export class MovieGrid {
  faArrowLeft = faArrowLeft;
  faTrash = faTrash;
  router = inject(Router);

  title = input.required<string>();
  movies = input.required<Movie[]>();
  emptyMessage = input<string>('Aucun film pour le moment.');
  removed = output<Movie>();

  backToMovieList(): void {
    this.router.navigate(['/']);
  }

  openMovie(movie: Movie): void {
    this.router.navigate([movie.id]);
  }
}
