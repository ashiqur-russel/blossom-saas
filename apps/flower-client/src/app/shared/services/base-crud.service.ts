/**
 * Base CRUD service
 * Provides common CRUD operations for entities
 * Follows DRY principle and reduces code duplication
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { extractId, normalizeDateField, toNumber } from '../utils/normalization.util';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export abstract class BaseCrudService<T extends BaseEntity, TCreate, TUpdate> {
  protected abstract apiUrl: string;
  protected abstract normalizeEntity(entity: any): T;

  constructor(protected http: HttpClient) {}

  /**
   * Get all entities
   */
  getAll(): Observable<T[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((entities: any[]) => entities.map((entity: any) => this.normalizeEntity(entity)))
    );
  }

  /**
   * Get entity by ID
   */
  getById(id: string): Observable<T> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((entity: any) => this.normalizeEntity(entity))
    );
  }

  /**
   * Create new entity
   */
  create(entity: TCreate): Observable<T> {
    const payload = this.preparePayload(entity);
    return this.http.post<any>(this.apiUrl, payload).pipe(
      map((response: any) => this.normalizeEntity(response))
    );
  }

  /**
   * Update existing entity
   */
  update(id: string, entity: TUpdate): Observable<T> {
    const payload = this.preparePayload(entity);
    return this.http.patch<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map((response: any) => this.normalizeEntity(response))
    );
  }

  /**
   * Delete entity
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Prepare payload for API request
   * Converts dates to ISO strings and handles other transformations
   */
  protected preparePayload(entity: any): any {
    const payload = { ...entity };
    
    // Convert Date objects to ISO strings
    Object.keys(payload).forEach(key => {
      if (payload[key] instanceof Date) {
        payload[key] = payload[key].toISOString();
      }
    });
    
    return payload;
  }

  /**
   * Normalize entity ID
   */
  protected normalizeId(entity: any): string {
    return extractId(entity);
  }

  /**
   * Normalize date field
   */
  protected normalizeDate(dateValue: any): Date {
    return normalizeDateField(dateValue);
  }

  /**
   * Normalize number field
   */
  protected normalizeNumber(value: any, defaultValue: number = 0): number {
    return toNumber(value, defaultValue);
  }
}

