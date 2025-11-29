import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IUser, ICreateUser, IUpdateUserRole } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private usersCache$: Observable<IUser[]> | null = null;
  private cachedUsers: IUser[] | null = null;
  private readonly CACHE_TTL = 3 * 60 * 1000; // 3 minutes cache
  private cacheTimestamp = 0;

  constructor(private http: HttpClient) {}

  create(createUserDto: ICreateUser): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl, createUserDto).pipe(
      tap(() => this.invalidateCache())
    );
  }

  getAll(forceRefresh: boolean = false): Observable<IUser[]> {
    // Return cached data if available and not expired
    if (!forceRefresh && this.cachedUsers && (Date.now() - this.cacheTimestamp) < this.CACHE_TTL) {
      return of(this.cachedUsers);
    }

    // Return shared observable if already in progress
    if (this.usersCache$ && !forceRefresh) {
      return this.usersCache$;
    }

    // Create new request with caching
    this.usersCache$ = this.http.get<IUser[]>(this.apiUrl).pipe(
      tap((users) => {
        this.cachedUsers = users;
        this.cacheTimestamp = Date.now();
      }),
      shareReplay(1),
      tap({
        finalize: () => {
          setTimeout(() => {
            this.usersCache$ = null;
          }, 100);
        }
      })
    );

    return this.usersCache$;
  }

  getOne(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/${id}`);
  }

  updateRole(id: string, updateRoleDto: IUpdateUserRole): Observable<IUser> {
    return this.http.patch<IUser>(`${this.apiUrl}/${id}/role`, updateRoleDto).pipe(
      tap(() => this.invalidateCache())
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.invalidateCache())
    );
  }

  /**
   * Invalidate users cache
   */
  invalidateCache(): void {
    this.cachedUsers = null;
    this.usersCache$ = null;
    this.cacheTimestamp = 0;
  }
}

