import { Injectable, signal } from '@angular/core';
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
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);

  // Usuários simulados
  private users: User[] = [
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

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      
      // Redireciona baseado no tipo de usuário
      if (user.type === 'student') {
        this.router.navigate(['/student-dashboard']);
      } else if (user.type === 'teacher') {
        this.router.navigate(['/professor-dashboard']);
      } else if (user.type === 'coordinator') {
        this.router.navigate(['/coordinator-dashboard']);
      }
      
      return true;
    }
    
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  getIsAuthenticated() {
    return this.isAuthenticated.asReadonly();
  }
}
