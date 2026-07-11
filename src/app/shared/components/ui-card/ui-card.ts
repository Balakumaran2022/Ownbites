import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [ngClass]="[
        'bg-white rounded-3xl overflow-hidden shadow-luxury border-none transition-all duration-500 flex',
        hoverable ? 'hover:shadow-luxury-hover hover:-translate-y-2' : '',
        glass ? 'glass' : '',
        padding ? 'p-4' : '',
        horizontal ? 'flex-row' : 'flex-col'
      ]"
      class="h-full w-full"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class UiCard {
  @Input() hoverable: boolean = false;
  @Input() glass: boolean = false;
  @Input() padding: boolean = true;
  @Input() horizontal: boolean = false;
}
