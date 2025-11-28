import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IUser, ICreateUser, IUpdateUserRole } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  create(createUserDto: ICreateUser): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl, createUserDto);
  }

  getAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl);
  }

  getOne(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/${id}`);
  }

  updateRole(id: string, updateRoleDto: IUpdateUserRole): Observable<IUser> {
    return this.http.patch<IUser>(`${this.apiUrl}/${id}/role`, updateRoleDto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

