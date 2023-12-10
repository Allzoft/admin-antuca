import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-loader',
  standalone: true,
  imports: [CommonModule],
  template: `<h1>Hola mundo</h1>`,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class UsersLoaderComponent {}
