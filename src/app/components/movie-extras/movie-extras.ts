import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Movie } from '../../interfaces/movie';
import { MovieExtras } from '../../interfaces/movie-extras';

@Component({
  selector: 'app-movie-extras',
  imports: [],
  templateUrl: './movie-extras.html',
  styleUrl: './movie-extras.css',
})
export class MovieExtrasComponent {

  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  extras = input<MovieExtras | null>(null);

  // Bande-annonce YouTube (officielle en priorité)
  trailerUrl = computed<SafeResourceUrl | null>(() => {
    const videos = (this.extras()?.videos.results ?? []).filter(v => v.site === 'YouTube');
    const trailer =
      videos.find(v => v.type === 'Trailer' && v.official) ??
      videos.find(v => v.type === 'Trailer') ??
      videos[0];
    return trailer
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube-nocookie.com/embed/${encodeURIComponent(trailer.key)}`
        )
      : null;
  });

  cast = computed(() => (this.extras()?.credits.cast ?? []).slice(0, 12));
  similar = computed(() => (this.extras()?.similar.results ?? []).slice(0, 8));

  openMovie(movie: Movie): void {
    this.router.navigate([movie.id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
