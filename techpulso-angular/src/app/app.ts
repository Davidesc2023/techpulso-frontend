/*
  TechPulso - app.ts (componente raíz)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Es el componente principal de la aplicación: todo lo demás se dibuja
  dentro de él. Su plantilla está en app.html y sus estilos en app.css.
*/
import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Toast } from './toast/toast';

@Component({
  // Componentes y herramientas que la plantilla app.html puede usar:
  // - RouterOutlet: el espacio donde se mostrará cada vista según la ruta.
  // - Header: el encabezado, que se usa con la etiqueta <app-header />.
  // - Footer: el pie de página, que se usa con la etiqueta <app-footer />.
  // - Toast: el aviso flotante, que se usa con la etiqueta <app-toast />.
  imports: [RouterOutlet, Header, Footer, Toast],
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

  // Algunos enlaces del diseño solo son marcadores sin destino (href="#"),
  // por ejemplo los íconos de redes sociales. Como la página tiene
  // <base href="/">, un clic en uno de ellos haría que el navegador
  // volviera a cargar la página de inicio. Este método lo evita.
  @HostListener('document:click', ['$event'])
  protected evitarEnlacesVacios(evento: MouseEvent): void {
    const objetivo = evento.target as Element | null;
    if (objetivo?.closest?.('a[href="#"]')) {
      evento.preventDefault();
    }
  }
}
