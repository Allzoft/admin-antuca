import { computed, inject, Injectable, signal } from '@angular/core';
import { updatePreset, updatePrimaryPalette } from '@primeng/themes';

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

    if (localStorage.getItem('token')) {
      const primaryColor = localStorage.getItem('primary_color');
      const secondaryColor = localStorage.getItem('secondary_color');
      if (primaryColor) {
        this.changePrimaryColor(primaryColor);
      }
      if (secondaryColor) {
        this.changeSecondaryColor(secondaryColor);
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

  public changeThemeColors(
    colorTheme: 'primary' | 'secondary',
    color: string
  ): void {
    if (colorTheme === 'primary') {
      this.changePrimaryColor(color);
      localStorage.setItem('primary_color', color);
    }
    if (colorTheme === 'secondary') {
      this.changeSecondaryColor(color);
      localStorage.setItem('secondary_color', color);
    }
  }

  private changePrimaryColor(color: string) {
    updatePreset({
      semantic: {
        colorScheme: {
          light: {
            primary: {
              50: `{${color}.50}`,
              100: `{${color}.100}`,
              200: `{${color}.200}`,
              300: `{${color}.300}`,
              400: `{${color}.400}`,
              500: `{${color}.500}`,
              600: `{${color}.600}`,
              700: `{${color}.700}`,
              800: `{${color}.800}`,
              900: `{${color}.900}`,
              950: `{${color}.950}`,
            },
          },
          dark: {
            primary: {
              50: `{${color}.50}`,
              100: `{${color}.100}`,
              200: `{${color}.200}`,
              300: `{${color}.300}`,
              400: `{${color}.400}`,
              500: `{${color}.500}`,
              600: `{${color}.600}`,
              700: `{${color}.700}`,
              800: `{${color}.800}`,
              900: `{${color}.900}`,
              950: `{${color}.950}`,
            },
          },
        },
      },
    });
  }

  private changeSecondaryColor(color: string) {
    updatePreset({
      semantic: {
        colorScheme: {
          light: {
            secondary: {
              50: `{${color}.50}`,
              100: `{${color}.100}`,
              200: `{${color}.200}`,
              300: `{${color}.300}`,
              400: `{${color}.400}`,
              500: `{${color}.500}`,
              600: `{${color}.600}`,
              700: `{${color}.700}`,
              800: `{${color}.800}`,
              900: `{${color}.900}`,
              950: `{${color}.950}`,
            },
          },
          dark: {
            secondary: {
              50: `{${color}.50}`,
              100: `{${color}.100}`,
              200: `{${color}.200}`,
              300: `{${color}.300}`,
              400: `{${color}.400}`,
              500: `{${color}.500}`,
              600: `{${color}.600}`,
              700: `{${color}.700}`,
              800: `{${color}.800}`,
              900: `{${color}.900}`,
              950: `{${color}.950}`,
            },
          },
        },
      },
    });
  }

  public setDefaultTheme() {
    updatePreset({
      semantic: {
        colorScheme: {
          light: {
            primary: {
              50: `{amber.50}`,
              100: `{amber.100}`,
              200: `{amber.200}`,
              300: `{amber.300}`,
              400: `{amber.400}`,
              500: `{amber.500}`,
              600: `{amber.600}`,
              700: `{amber.700}`,
              800: `{amber.800}`,
              900: `{amber.900}`,
              950: `{amber.950}`,
            },
            secondary: {
              50: `{orange.50}`,
              100: `{orange.100}`,
              200: `{orange.200}`,
              300: `{orange.300}`,
              400: `{orange.400}`,
              500: `{orange.500}`,
              600: `{orange.600}`,
              700: `{orange.700}`,
              800: `{orange.800}`,
              900: `{orange.900}`,
              950: `{orange.950}`,
            },
          },
          dark: {
            primary: {
              50: `{amber.50}`,
              100: `{amber.100}`,
              200: `{amber.200}`,
              300: `{amber.300}`,
              400: `{amber.400}`,
              500: `{amber.500}`,
              600: `{amber.600}`,
              700: `{amber.700}`,
              800: `{amber.800}`,
              900: `{amber.900}`,
              950: `{amber.950}`,
            },
            secondary: {
              50: `{orange.50}`,
              100: `{orange.100}`,
              200: `{orange.200}`,
              300: `{orange.300}`,
              400: `{orange.400}`,
              500: `{orange.500}`,
              600: `{orange.600}`,
              700: `{orange.700}`,
              800: `{orange.800}`,
              900: `{orange.900}`,
              950: `{orange.950}`,
            },
          },
        },
      },
    });
  }
}
