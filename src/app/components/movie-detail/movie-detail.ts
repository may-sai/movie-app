import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import { MovieService } from '../../services/movie-service';
import { Movie } from '../../interfaces/movie';
import { MovieExtras } from '../../interfaces/movie-extras';
import { MovieExtrasComponent } from '../movie-extras/movie-extras';

@Component({
  selector: 'app-movie-detail',
  imports: [FontAwesomeModule, MovieExtrasComponent],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.css',
})
export class MovieDetail implements OnInit {

  faHeart = faHeart;
  faStar = faStar;
  faEye = faEye;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  movieService = inject(MovieService);

  extras = signal<MovieExtras | null>(null);

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.movieService.getMovieById(id);
      })
    ).subscribe(movie => {
  console.log('Film récupéré :', movie);
  this.movieService.selectedMovie.set(movie);
});

    // Casting, bande-annonce et films similaires
    this.route.paramMap.pipe(
      tap(() => this.extras.set(null)), // vide les anciens extras quand on change de film
      switchMap(params =>
        this.movieService.getMovieExtras(Number(params.get('id'))).pipe(catchError(() => EMPTY))
      )
    ).subscribe(extras => this.extras.set(extras));
  }

  backToMovieList() {
    this.router.navigate(['/']);
  }

  addToWish(movie:Movie) {
    this.movieService.toggleWishList(movie);
  }

  addToFavorites(movie: Movie) {
    this.movieService.toggleFavorites(movie);
  }

  markAsWatched(movie: Movie) {
    this.movieService.toggleWatched(movie);
  }

}
