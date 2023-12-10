import { CommonModule } from '@angular/common';
import { Component, Input, booleanAttribute } from '@angular/core';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule],
  template: `<h1 class="text-3xl mb-5">{{ title }}</h1>`,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class TitleComponent {
  @Input({ required: true }) public title!: string;
  @Input({ transform: booleanAttribute }) public withShadow: boolean = false;
}
