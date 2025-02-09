import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const MyPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      light: {
        primary: {
          50: '{amber.50}',
          100: '{amber.100}',
          200: '{amber.200}',
          300: '{amber.300}',
          400: '{amber.400}',
          500: '{amber.500}',
          600: '{amber.600}',
          700: '{amber.700}',
          800: '{amber.800}',
          900: '{amber.900}',
          950: '{amber.950}',
        },
        surface: {
          0: '#ffffff',
          50: '{zinc.50}',
          100: '{zinc.100}',
          200: '{zinc.200}',
          300: '{zinc.300}',
          400: '{zinc.400}',
          500: '{zinc.500}',
          600: '{zinc.600}',
          700: '{zinc.700}',
          800: '{zinc.800}',
          900: '{zinc.900}',
          950: '{zinc.950}',
        },
      },
      dark: {
        primary: {
          50: '{amber.50}',
          100: '{amber.100}',
          200: '{amber.200}',
          300: '{amber.300}',
          400: '{amber.400}',
          500: '{amber.500}',
          600: '{amber.600}',
          700: '{amber.700}',
          800: '{amber.800}',
          900: '{amber.900}',
          950: '{amber.950}',
        },
        surface: {
          0: '#ffffff',
          50: '{gray.50}',
          100: '{gray.100}',
          200: '{gray.200}',
          300: '{gray.300}',
          400: '{gray.400}',
          500: '{gray.500}',
          600: '{gray.600}',
          700: '{gray.700}',
          800: '{gray.800}',
          900: '{gray.900}',
          950: '{gray.950}',
        },
      },
    },
  },
});
