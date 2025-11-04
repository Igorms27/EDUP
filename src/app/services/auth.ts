/**
 * Serviço responsável pela autenticação e gerenciamento de usuários.
 * Fornece métodos para login, logout, verificação de autenticação e gerenciamento do estado
 * do usuário autenticado, incluindo persistência no localStorage e navegação baseada no tipo de usuário.
 */
import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  type: 'student' | 'teacher' | 'coordinator';
}

interface BackendLoginResponse {
  id: number;
  name: string;
  email: string;
  message: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly STORAGE_KEY = 'edumanage_user';
  private readonly API_BASE = 'http://localhost:8080/api';

  private currentUser = signal<User | null>(this.loadUserFromStorage());
  private isAuthenticated = signal<boolean>(this.loadUserFromStorage() !== null);

  private loadUserFromStorage(): User | null {
    try {
      const storedUser = localStorage.getItem(this.STORAGE_KEY);
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário do storage:', error);
      localStorage.removeItem(this.STORAGE_KEY);
    }
    return null;
  }

  private saveUserToStorage(user: User): void {
    try {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error('Erro ao salvar usuário no storage:', error);
    }
  }

  private removeUserFromStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<BackendLoginResponse>(`${this.API_BASE}/auth/login`, { email, password }).pipe(
      map((res) => {
        let userType: 'coordinator' | 'teacher' | 'student' = 'coordinator';
        if (res.type?.toLowerCase() === 'teacher') userType = 'teacher';
        if (res.type?.toLowerCase() === 'coordinator') userType = 'coordinator';
        if (res.type?.toLowerCase() === 'student') userType = 'student';
        const user: User = {
          id: String(res.id),
          email: res.email,
          name: res.name,
          type: userType
        };
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        this.saveUserToStorage(user);
        this.navigateByUserType(user.type);
        return true;
      }),
      catchError((err) => {
        console.error('Falha no login', err);
        return of(false);
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.removeUserFromStorage();
    this.router.navigate(['/login']);
  }

  private navigateByUserType(userType: User['type']): void {
    const dashboardMap: Record<User['type'], string> = {
      student: '/student-dashboard',
      teacher: '/professor-dashboard',
      coordinator: '/coordinator-dashboard'
    };
    this.router.navigate([dashboardMap[userType]]);
  }

  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  getIsAuthenticated() {
    return this.isAuthenticated.asReadonly();
  }
}
