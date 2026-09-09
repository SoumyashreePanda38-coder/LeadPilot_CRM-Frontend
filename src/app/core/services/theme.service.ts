import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  /*
   * Default application theme
   * false = LIGHT
   * true  = DARK
   */
  private darkThemeSubject =
    new BehaviorSubject<boolean>(false);

  darkTheme$ =
    this.darkThemeSubject.asObservable();


  constructor() {

    this.loadTheme();
  }


  /*
   * Load previously selected theme
   */
  private loadTheme(): void {

    const savedTheme =
      localStorage.getItem('theme');

    if (savedTheme === 'dark') {

      this.darkThemeSubject.next(true);

    } else {

      /*
       * Default = LIGHT
       */
      this.darkThemeSubject.next(false);
    }

    this.applyTheme(
      this.darkThemeSubject.value
    );
  }


  /*
   * Navbar calls this
   */
  toggleTheme(): void {

    const newTheme =
      !this.darkThemeSubject.value;

    this.darkThemeSubject.next(
      newTheme
    );

    this.applyTheme(
      newTheme
    );
  }


  /*
   * Returns current theme
   */
  isDarkTheme(): boolean {

    return this.darkThemeSubject.value;
  }


  /*
   * Apply global theme
   */
  private applyTheme(
    isDark: boolean
  ): void {

    const body =
      document.body;


    if (isDark) {

      body.classList.remove(
        'light-theme'
      );

      body.classList.add(
        'dark-theme'
      );

      localStorage.setItem(
        'theme',
        'dark'
      );

    } else {

      body.classList.remove(
        'dark-theme'
      );

      body.classList.add(
        'light-theme'
      );

      localStorage.setItem(
        'theme',
        'light'
      );
    }
  }
}