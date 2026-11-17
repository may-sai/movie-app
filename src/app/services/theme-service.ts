import { effect, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  private readonly storageKey = 'theme';

  public theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // À chaque changement : on applique le thème sur <html> et on le sauvegarde
    effect(() => {
      const current = this.theme();
      document.documentElement.setAttribute('data-theme', current);
      try {
        localStorage.setItem(this.storageKey, current);
      } catch {
        // ignoré
      }
    });
  }

  toggleTheme(): void {
    this.theme.update(current => (current === 'dark' ? 'light' : 'dark'));
  }

  private getInitialTheme(): Theme {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignoré
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
