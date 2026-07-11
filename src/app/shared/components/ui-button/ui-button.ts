import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [disabled]="disabled || loading"
      [ngClass]="[
        'flex items-center justify-center rounded-full font-extrabold uppercase tracking-widest text-sm transition-all duration-300 ease-in-out px-8 py-3',
        variant === 'primary' ? 'bg-gradient-to-r from-primary to-orange-600 text-white shadow-md hover:shadow-luxury-hover hover:-translate-y-1' : '',
        variant === 'secondary' ? 'bg-secondary text-white hover:bg-gray-800 shadow-md hover:shadow-luxury-hover hover:-translate-y-1' : '',
        variant === 'outline' ? 'border-2 border-primary text-primary hover:bg-orange-50' : '',
        variant === 'ghost' ? 'text-secondary hover:bg-gray-100' : '',
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      ]"
    >
      <span *ngIf="loading" class="material-icons animate-spin mr-2">autorenew</span>
      <ng-content></ng-content>
    </button>
  `
})
export class UiButton {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary';
  @Input() fullWidth: boolean = false;
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
}
