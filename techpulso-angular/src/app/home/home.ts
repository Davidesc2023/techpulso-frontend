/*
  TechPulso - home.ts (vista de Inicio)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Vista principal del sitio. Por ahora solo muestra el contenido temporal
  de home.html; la clase está vacía porque todavía no tiene lógica.
*/
import { Component } from '@angular/core';

@Component({
  // Esta vista no usa otros componentes dentro de su plantilla.
  imports: [],
  // Etiqueta del componente. Las vistas se muestran mediante el router,
  // así que normalmente no se usa directamente en otra plantilla.
  selector: 'app-home',
  // Estilos propios de la vista (los estilos visuales vienen de Tailwind).
  styleUrl: './home.css',
  // Plantilla HTML de la vista.
  templateUrl: './home.html',
})
export class Home {}