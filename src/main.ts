/**
 * Arquivo principal de inicialização da aplicação Angular.
 * Responsável por fazer o bootstrap da aplicação, inicializando o componente raiz (AppComponent)
 * com as configurações definidas em app.config.
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
