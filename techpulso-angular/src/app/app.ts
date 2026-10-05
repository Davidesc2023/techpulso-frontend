/*
  TechPulso - app.ts (componente raíz)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Es el componente principal de la aplicación: todo lo demás se dibuja
  dentro de él. Su plantilla está en app.html y sus estilos en app.css.
*/
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';

@Component({
  // Componentes y herramientas que la plantilla app.html puede usar:
  // - RouterOutlet: el espacio donde se mostrará cada vista según la ruta.
  // - Header: el encabezado, que se usa con la etiqueta <app-header />.
  // - Footer: el pie de página, que se usa con la etiqueta <app-footer />.
  imports: [RouterOutlet, Header, Footer],
  // Nombre de la etiqueta de este componente. src/index.html la usa
  // como <app-root> para arrancar la aplicación.
  selector: 'app-root',
  // Archivo de estilos propio de este componente.
  styleUrl: './app.css',
  // Archivo de la plantilla (el HTML) de este componente.
  templateUrl: './app.html',
})
export class App {
  // Valor reactivo (signal) con el nombre del proyecto. Lo trajo Angular
  // al crear el proyecto; por ahora no se muestra en pantalla.
  protected readonly title = signal('techpulso-angular');
}