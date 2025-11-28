import { Component, Input, Output, EventEmitter, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../../shared/ui/components/card/card.component';
import { ButtonComponent } from '../../shared/ui/components/button/button.component';
import { InputComponent } from '../../shared/ui/components/input/input.component';
import { DropdownComponent } from '../../shared/ui/components/dropdown/dropdown.component';
import { DialogComponent } from '../../shared/ui/components/dialog/dialog.component';
import { MenuComponent, MenuItem } from '../../shared/ui/components/menu/menu.component';
import { UserService } from './user.service';
import { IUser, OrgRole, OrgRoleLabels } from '../../shared/models/user.model';
import { extractErrorMessage } from '../../shared/utils/error.util';
import { AuthService } from '../../features/auth/auth.service';

@Component({
  selector: 'app-user-management-presentation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, ButtonComponent, InputComponent, DropdownComponent, DialogComponent, MenuComponent],
  templateUrl: './user-management.presentation.html',
  styleUrl: './user-management.presentation.scss',
})
export class UserManagementPresentationComponent implements OnInit {
  @Input() users: IUser[] = [];
  @Input() loading: boolean = false;
  @Output() userCreated = new EventEmitter<void>();
  @Output() userRoleUpdated = new EventEmitter<void>();
  @Output() userDeleted = new EventEmitter<void>();

  createUserForm!: FormGroup;
  showCreateDialog = signal(false);
  creating = false;
  createError: string | null = null;
  updatingRole: { [key: string]: boolean } = {};
  deletingUser: { [key: string]: boolean } = {};
  searchQuery = signal('');

  orgRoles = Object.values(OrgRole);
  orgRoleLabels = OrgRoleLabels;
  currentUserId: string | null = null;
  currentUserOrgRole: OrgRole | null = null;
  isOrgAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.initializeCreateForm();
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUserId = currentUser.id;
      this.currentUserOrgRole = currentUser.orgRole as OrgRole;
      this.isOrgAdmin = currentUser.orgRole === OrgRole.ORG_ADMIN;
    }
  }

  initializeCreateForm(): void {
    this.createUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      orgRole: [OrgRole.ORG_USER, [Validators.required]],
    });
  }

  onCreateUser(): void {
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    this.creating = true;
    this.createError = null;

    const formValue = this.createUserForm.value;
    this.userService.create(formValue).subscribe({
      next: () => {
        this.creating = false;
        this.showCreateDialog.set(false);
        this.createUserForm.reset({
          orgRole: OrgRole.ORG_USER,
        });
        this.userCreated.emit();
      },
      error: (err: any) => {
        this.createError = extractErrorMessage(err, 'Failed to create user');
        this.creating = false;
        console.error('Error creating user:', err);
      },
    });
  }

  onUpdateRole(user: IUser, newRole: OrgRole): void {
    if (user.orgRole === newRole) {
      return;
    }

    // Prevent org admin from changing their own role
    if (user.id === this.currentUserId && user.orgRole === OrgRole.ORG_ADMIN) {
      alert('You cannot change your own role as organization admin');
      return;
    }

    this.updatingRole[user.id] = true;

    this.userService.updateRole(user.id, { orgRole: newRole }).subscribe({
      next: () => {
        this.updatingRole[user.id] = false;
        this.userRoleUpdated.emit();
      },
      error: (err: any) => {
        this.updatingRole[user.id] = false;
        alert(extractErrorMessage(err, 'Failed to update user role'));
        console.error('Error updating user role:', err);
      },
    });
  }

  onDeleteUser(user: IUser): void {
    // Prevent org admin from deleting themselves
    if (user.id === this.currentUserId && user.orgRole === OrgRole.ORG_ADMIN) {
      alert('You cannot delete yourself as organization admin');
      return;
    }

    if (!confirm(`Are you sure you want to remove ${user.firstName} ${user.lastName}?`)) {
      return;
    }

    this.deletingUser[user.id] = true;

    this.userService.delete(user.id).subscribe({
      next: () => {
        this.deletingUser[user.id] = false;
        this.userDeleted.emit();
      },
      error: (err: any) => {
        this.deletingUser[user.id] = false;
        alert(extractErrorMessage(err, 'Failed to delete user'));
        console.error('Error deleting user:', err);
      },
    });
  }

  isCurrentUser(user: IUser): boolean {
    return user.id === this.currentUserId;
  }

  canEditUser(user: IUser): boolean {
    // Only org admin can edit users, but not themselves
    return this.isOrgAdmin && !this.isCurrentUser(user);
  }

  canDeleteUser(user: IUser): boolean {
    // Only org admin can delete users, but not themselves
    return this.isOrgAdmin && !this.isCurrentUser(user);
  }

  getFieldError(fieldName: string): string {
    const field = this.createUserForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    if (field.errors['required']) {
      return 'This field is required';
    } else if (field.errors['email']) {
      return 'Please enter a valid email address';
    } else if (field.errors['minlength']) {
      const min = field.errors['minlength'].requiredLength;
      return `Must be at least ${min} characters`;
    }

    return '';
  }

  getFullName(user: IUser): string {
    return `${user.firstName} ${user.lastName}`;
  }

  getRoleBadgeClass(role: OrgRole): string {
    const roleClasses: { [key: string]: string } = {
      [OrgRole.ORG_ADMIN]: 'role-badge-admin',
      [OrgRole.ORG_MANAGER]: 'role-badge-manager',
      [OrgRole.ORG_SUPERVISOR]: 'role-badge-supervisor',
      [OrgRole.ORG_SALES]: 'role-badge-sales',
      [OrgRole.ORG_USER]: 'role-badge-user',
    };
    return roleClasses[role] || 'role-badge-user';
  }

  getRoleOptions(): { value: OrgRole; label: string }[] {
    return this.orgRoles.map(role => ({
      value: role,
      label: this.orgRoleLabels[role]
    }));
  }

  // Filtered users based on search query
  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.users;
    return this.users.filter(user => 
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  // Stats
  totalUsers = computed(() => this.users.length);
  totalAdmins = computed(() => this.users.filter(u => u.orgRole === OrgRole.ORG_ADMIN).length);
  totalManagers = computed(() => this.users.filter(u => u.orgRole === OrgRole.ORG_MANAGER).length);

  // Menu items for each user
  getUserMenuItems(user: IUser): MenuItem[] {
    const items: MenuItem[] = [
      {
        label: 'View Profile',
        action: () => this.onViewProfile(user),
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      },
      {
        label: 'Edit User',
        action: () => this.onEditUser(user),
        icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
      }
    ];

    if (this.canEditUser(user)) {
      items.push({
        label: 'Change Role',
        action: () => {}, // Role change handled by dropdown
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
      });
    }

    if (this.canDeleteUser(user)) {
      items.push({
        label: 'Remove User',
        action: () => this.onDeleteUser(user),
        variant: 'danger',
        icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
      });
    }

    return items;
  }

  onViewProfile(user: IUser): void {
    // TODO: Implement view profile
    console.log('View profile:', user);
  }

  onEditUser(user: IUser): void {
    // TODO: Implement edit user
    console.log('Edit user:', user);
  }

  toggleCreateDialog(): void {
    this.showCreateDialog.set(!this.showCreateDialog());
    if (!this.showCreateDialog()) {
      this.createUserForm.reset({
        orgRole: OrgRole.ORG_USER,
      });
      this.createError = null;
    }
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }
}

