/*
  TechPulso - app.config.ts (configuración global de la aplicación)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Aquí se activan las funciones que toda la aplicación necesita. Cada una
  se registra en la lista "providers". Más adelante se agregará aquí
  provideHttpClient(), que permitirá leer el archivo noticias.json.
*/
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Hace que Angular capture los errores globales del navegador
    // (por ejemplo, un error que nadie atrapó) y los registre.
    provideBrowserGlobalErrorListeners(),
    // Activa el router con la tabla de rutas de app.routes.ts.
    provideRouter(routes)
  ]
}