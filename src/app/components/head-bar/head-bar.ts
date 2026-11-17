import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faHeart, faMoon, faStar, faSun } from '@fortawesome/free-solid-svg-icons';
import { MovieService } from '../../services/movie-service';
import { ThemeService } from '../../services/theme-service';

@Component({
  selector: 'app-head-bar',
  imports: [FontAwesomeModule],
  templateUrl: './head-bar.html',
  styleUrl: './head-bar.css'
})
export class HeadBar {
  faHeart = faHeart;
  faStar = faStar;
  faEye = faEye;
  faMoon = faMoon;
  faSun = faSun;
  router= inject(Router);
  movieService = inject(MovieService);
  themeService = inject(ThemeService);

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToWishList() {
    this.router.navigate(['wishlist']);
  }

  navigateToFavorites() {
    this.router.navigate(['favorites']);
  }

  navigateToWatched() {
    this.router.navigate(['watched']);
  }
}
