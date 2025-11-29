import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { IUser, OrgRole, OrgRoleLabels } from '../../shared/models/user.model';
import { extractErrorMessage } from '../../shared/utils/error.util';
import { UserManagementPresentationComponent } from './user-management.presentation';
import { AuthService } from '../../features/auth/auth.service';
import { LoadingComponent } from '../../shared/ui/components/loading/loading.component';

@Component({
  selector: 'app-user-management-container',
  standalone: true,
  imports: [CommonModule, UserManagementPresentationComponent, LoadingComponent],
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
    // Check both string and enum value for compatibility
    const isOrgAdmin = user.orgRole === OrgRole.ORG_ADMIN || 
                      user.orgRole === 'org_admin';
    this.isOrgAdmin = isOrgAdmin;
    
    if (!this.isOrgAdmin) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadUsers();
  }

  loadUsers(forceRefresh: boolean = false): void {
    // Only show loading if we don't have cached data
    const hasCachedData = this.users.length > 0;
    if (!hasCachedData || forceRefresh) {
      this.loading = true;
    }
    this.error = null;

    this.userService.getAll(forceRefresh).subscribe({
      next: (users: IUser[]) => {
        this.users = users;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.error = extractErrorMessage(err, 'Failed to load users');
        console.error('Error loading users:', err);
      },
    });
  }

  onUserCreated(): void {
    this.loadUsers(true); // Force refresh after mutation
  }

  onUserRoleUpdated(): void {
    this.loadUsers(true); // Force refresh after mutation
  }

  onUserDeleted(): void {
    this.loadUsers(true); // Force refresh after mutation
  }
}

