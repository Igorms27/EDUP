import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  type: 'student' | 'teacher' | 'coordinator';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly STORAGE_KEY = 'edumanage_user';

  private currentUser = signal<User | null>(this.loadUserFromStorage());
  private isAuthenticated = signal<boolean>(this.loadUserFromStorage() !== null);

  // Usuários simulados
  private readonly users: User[] = [
    {
      id: '1',
      email: 'aluno@teste.com',
      password: '123456',
      name: 'João Silva',
      type: 'student'
    },
    {
      id: '2',
      email: 'professor@teste.com',
      password: '123456',
      name: 'Maria Santos',
      type: 'teacher'
    },
    {
      id: '3',
      email: 'coordenador@teste.com',
      password: '123456',
      name: 'Carlos Coordenador',
      type: 'coordinator'
    }
  ];

  /**
   * Carrega usuário do localStorage ao inicializar o serviço
   */
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

  /**
   * Salva usuário no localStorage
   */
  private saveUserToStorage(user: User): void {
    try {
      // Remove a senha antes de salvar
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error('Erro ao salvar usuário no storage:', error);
    }
  }

  /**
   * Remove usuário do localStorage
   */
  private removeUserFromStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Realiza login do usuário
   */
  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      this.saveUserToStorage(user);
      this.navigateByUserType(user.type);
      return true;
    }
    
    return false;
  }

  /**
   * Realiza logout do usuário
   */
  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.removeUserFromStorage();
    this.router.navigate(['/login']);
  }

  /**
   * Navega para a dashboard correta baseado no tipo de usuário
   */
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
