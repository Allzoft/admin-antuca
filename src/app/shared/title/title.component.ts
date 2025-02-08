import { CommonModule } from '@angular/common';
import { Component, Input, booleanAttribute } from '@angular/core';

@Component({
    selector: 'app-title',
    imports: [CommonModule],
    template: `<h1 class="text-3xl">{{ title }}</h1>`
})
export class TitleComponent {
  @Input({ required: true }) public title!: string;
  @Input({ transform: booleanAttribute }) public withShadow: boolean = false;
}
