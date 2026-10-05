/*
  TechPulso - header.ts (componente Header)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Encabezado compartido por todas las vistas. Todavía no tiene lógica:
  solo muestra el HTML de header.html, por eso la clase está vacía.
*/
import { Component } from '@angular/core';

@Component({
  // Este componente no usa otros componentes dentro de su plantilla.
  imports: [],
  // Etiqueta con la que se usa en otras plantillas: <app-header />
  selector: 'app-header',
  // Estilos propios del componente (los estilos visuales vienen de Tailwind).
  styleUrl: './header.css',
  // Plantilla HTML del componente.
  templateUrl: './header.html',
})
export class Header {}
