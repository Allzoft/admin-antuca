import { computed, Injectable, signal } from '@angular/core';

interface State {
  isDarkMode: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  #state = signal<State>({
    isDarkMode: false,
  });

  public isDarkMode = computed(() => this.#state().isDarkMode);

  constructor() {
    const themeMode = localStorage.getItem('theme_mode');
    if (themeMode) {
      this.#state.set({
        isDarkMode: themeMode === 'on',
      });
      const element = document.querySelector('html');

      if (element) {
        if (this.#state().isDarkMode) {
          element.classList.add('my-app-dark', 'dark');
        } else {
          element.classList.remove('my-app-dark', 'dark');
        }
      }
    }
  }

  public toggleDarkMode() {
    const element = document.querySelector('html');
    if (!element !== null) {
      this.#state.set({
        isDarkMode: !this.#state().isDarkMode,
      });
      localStorage.setItem(
        'theme_mode',
        this.#state().isDarkMode ? 'on' : 'off'
      );
      element?.classList.toggle('my-app-dark');
      element?.classList.toggle('dark');
    }
  }
}
