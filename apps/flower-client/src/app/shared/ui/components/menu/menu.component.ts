import { Component, Input, Output, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MenuItem {
  label: string;
  action: () => void;
  variant?: 'default' | 'danger';
  icon?: string;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  @Input() items: MenuItem[] = [];
  @Input() triggerIcon: string = 'M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z';
  
  @ViewChild('menuTrigger', { static: false }) triggerRef?: ElementRef<HTMLElement>;
  @ViewChild('menuContent', { static: false }) contentRef?: ElementRef<HTMLElement>;

  isOpen = false;

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  onItemClick(item: MenuItem, event: Event): void {
    event.stopPropagation();
    item.action();
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-container')) {
      this.isOpen = false;
    }
  }
}

