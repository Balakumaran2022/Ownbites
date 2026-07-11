import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="animate-pulse bg-gray-200"
      [ngClass]="[
        type === 'circle' ? 'rounded-full' : 'rounded-lg',
        widthClass,
        heightClass
      ]"
    ></div>
  `
})
export class SkeletonLoader {
  @Input() type: 'rect' | 'circle' = 'rect';
  @Input() widthClass: string = 'w-full';
  @Input() heightClass: string = 'h-4';
}
