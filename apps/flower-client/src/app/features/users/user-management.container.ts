import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { IUser, OrgRole, OrgRoleLabels } from '../../shared/models/user.model';
import { extractErrorMessage } from '../../shared/utils/error.util';
import { UserManagementPresentationComponent } from './user-management.presentation';
import { AuthService } from '../../features/auth/auth.service';

@Component({
  selector: 'app-user-management-container',
  standalone: true,
  imports: [CommonModule, UserManagementPresentationComponent],
  templateUrl: './user-management.container.html',
  styleUrl: './user-management.container.scss',
})
export class UserManagementContainerComponent implements OnInit {
  users: IUser[] = [];
  loading = false;
  error: string | null = null;
  isOrgAdmin: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // If orgRole is missing, refresh user profile first
    if (!currentUser.orgRole) {
      this.authService.refreshUserProfile().subscribe({
        next: (updatedUser) => {
          this.checkAndLoadUsers(updatedUser);
        },
        error: (err) => {
          console.error('Failed to refresh user profile:', err);
          this.error = 'Failed to load user information. Please try logging out and back in.';
        }
      });
      return;
    }

    this.checkAndLoadUsers(currentUser);
  }

  private checkAndLoadUsers(user: any): void {
    // Only ORG_ADMIN can access user management
    this.isOrgAdmin = user.orgRole === OrgRole.ORG_ADMIN;
    if (!this.isOrgAdmin) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService.getAll().subscribe({
      next: (users: IUser[]) => {
        this.users = users;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = extractErrorMessage(err, 'Failed to load users');
        this.loading = false;
        console.error('Error loading users:', err);
      },
    });
  }

  onUserCreated(): void {
    this.loadUsers();
  }

  onUserRoleUpdated(): void {
    this.loadUsers();
  }

  onUserDeleted(): void {
    this.loadUsers();
  }
}

