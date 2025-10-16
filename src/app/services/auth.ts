import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor() { }

  login(email: string, password: string): void {
    // Simulação de login - apenas exibe no console
    console.log('Tentativa de login:', { email, password });
    
    // Aqui seria implementada a lógica real de autenticação
    // Por enquanto, apenas simula o processo
    console.log('Login simulado realizado com sucesso!');
  }
}
