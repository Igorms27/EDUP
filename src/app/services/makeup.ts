import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService, User } from './auth';

export type MakeupStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CreateMakeupPayload {
  date?: string;   // yyyy-MM-dd (opcional)
  time?: string;   // HH:mm (opcional)
  subject: string;
  reason: string;
}

export interface MakeupRequest {
  id: number;
  studentId: number;
  date?: string | null;
  time?: string | null;
  subject: string;
  reason: string;
  status: MakeupStatus;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class MakeupService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly API_BASE = 'http://localhost:8080/api';

  private getCurrentUserId(): string | null {
    const userSig = this.auth.getCurrentUser();
    const user: User | null = userSig();
    return user?.id ?? null;
  }

  createMakeup(payload: CreateMakeupPayload): Observable<MakeupRequest> {
    const studentId = this.getCurrentUserId();
    const params = new HttpParams().set('studentId', studentId ?? '');
    return this.http.post<MakeupRequest>(`${this.API_BASE}/makeups`, payload, { params });
  }

  listByStatus(status: MakeupStatus): Observable<MakeupRequest[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<MakeupRequest[]>(`${this.API_BASE}/makeups`, { params });
  }

  approve(id: number): Observable<MakeupRequest> {
    return this.http.patch<MakeupRequest>(`${this.API_BASE}/makeups/${id}/approve`, {});
  }

  reject(id: number): Observable<MakeupRequest> {
    return this.http.patch<MakeupRequest>(`${this.API_BASE}/makeups/${id}/reject`, {});
  }

  listMine(studentId: number): Observable<MakeupRequest[]> {
    return this.http.get<MakeupRequest[]>(`${this.API_BASE}/makeups/student/${studentId}`);
  }

  deleteByStatus(status: MakeupStatus): Observable<number> {
    return this.http.delete<number>(`${this.API_BASE}/makeups`, { params: new HttpParams().set('status', status) });
  }

  deleteMineByStatus(studentId: number, status: MakeupStatus): Observable<number> {
    return this.http.delete<number>(`${this.API_BASE}/makeups/student/${studentId}`, { params: new HttpParams().set('status', status) });
  }
}


