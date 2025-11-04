/**
 * Componente raiz da aplicação Angular.
 * Define o componente principal que será renderizado na aplicação, contendo o RouterOutlet
 * para gerenciar a navegação entre as rotas da aplicação.
 */
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected readonly title = signal('edumanage');
}
