import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../../features/auth/auth.service';
import type { User } from '../../../../features/auth/auth.service';
import { OrgRole } from '../../../models/user.model';

export interface SidebarItem {
  label: string;
  route: string;
  icon: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  @Input() isMobileOpen = false;
  @Output() closeMobile = new EventEmitter<void>();

  activeRoute = '';
  currentUser: User | null = null;

  sidebarItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
      label: 'Withdrawals',
      route: '/withdrawals',
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    },
    {
      label: 'Invoices',
      route: '/dashboard/invoices',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      badge: 3,
    },
    {
      label: 'Customers',
      route: '/dashboard/customers',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    },
    {
      label: 'Analytics',
      route: '/dashboard/analytics',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
    {
      label: 'Users',
      route: '/dashboard/users',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    },
  ];

  get visibleSidebarItems(): SidebarItem[] {
    // Filter sidebar items based on user role
    if (!this.currentUser) {
      return this.sidebarItems.filter(item => item.route !== '/dashboard/users');
    }

    const isOrgAdmin = this.currentUser.orgRole === OrgRole.ORG_ADMIN || 
                      this.currentUser.orgRole === 'org_admin';
    
    if (!isOrgAdmin) {
      return this.sidebarItems.filter(item => item.route !== '/dashboard/users');
    }

    return this.sidebarItems;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.url;
      });
    this.activeRoute = this.router.url;
  }

  ngOnInit(): void {
    // Set initial user from storage immediately
    const storedUser = this.authService.getCurrentUser();
    if (storedUser) {
      this.currentUser = storedUser;
    }
    
    // Subscribe to user changes
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      // If user exists but orgRole is missing, refresh user data immediately
      if (user && !user.orgRole) {
        this.authService.refreshUserProfile().subscribe({
          next: (updatedUser) => {
            this.currentUser = updatedUser;
          },
          error: (err) => {
            console.error('Failed to refresh user profile:', err);
          }
        });
      }
    });
    
    // Also check on initial load
    if (storedUser && !storedUser.orgRole) {
      this.authService.refreshUserProfile().subscribe({
        next: (updatedUser) => {
          this.currentUser = updatedUser;
        },
        error: (err) => {
          console.error('Failed to refresh user profile on init:', err);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }

  isActive(route: string): boolean {
    if (route === '/dashboard') {
      return this.activeRoute === '/dashboard' || this.activeRoute === '/';
    }
    return this.activeRoute.startsWith(route);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
    this.closeMobile.emit();
  }
}

