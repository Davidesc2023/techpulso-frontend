/*
  TechPulso - app.config.ts (configuración global de la aplicación)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Aquí se activan las funciones que toda la aplicación necesita. Cada una
  se registra en la lista "providers". Más adelante se agregará aquí
  provideHttpClient(), que permitirá leer el archivo noticias.json.
*/
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Hace que Angular capture los errores globales del navegador
    // (por ejemplo, un error que nadie atrapó) y los registre.
    provideBrowserGlobalErrorListeners(),
    // Activa el router con la tabla de rutas de app.routes.ts, más el
    // control del desplazamiento de la página:
    // - scrollPositionRestoration: al ir a otra vista sube al inicio de la
    //   página (por ejemplo, tras hacer clic en un enlace del footer), y al
    //   volver con la flecha del navegador regresa a donde estabas.
    // - anchorScrolling: permite que los enlaces a una sección de la misma
    //   página, como #catalogo, bajen hasta esa sección.
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
  ],
};
