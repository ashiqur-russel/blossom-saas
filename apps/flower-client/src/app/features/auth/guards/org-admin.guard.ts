import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../auth.service';
import { OrgRole } from '../../../shared/models/user.model';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const orgAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // If orgRole is missing, try to refresh user profile
  if (!currentUser.orgRole) {
    return authService.refreshUserProfile().pipe(
        map((updatedUser) => {
          const isOrgAdmin = updatedUser.orgRole === OrgRole.ORG_ADMIN || 
                            updatedUser.orgRole === 'org_admin';
          if (isOrgAdmin) {
            return true;
          }
          router.navigate(['/dashboard']);
          return false;
        }),
      catchError(() => {
        router.navigate(['/dashboard']);
        return of(false);
      })
    );
  }

      // Only ORG_ADMIN can access
      // Check both string and enum value for compatibility
      const isOrgAdmin = currentUser.orgRole === OrgRole.ORG_ADMIN || 
                        currentUser.orgRole === 'org_admin';
      
      if (!isOrgAdmin) {
        router.navigate(['/dashboard']);
        return false;
      }

      return true;
};

