/*
  TechPulso - footer.ts (componente Footer)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Pie de página compartido por todas las vistas. Todavía no tiene lógica:
  solo muestra el HTML de footer.html, por eso la clase está vacía.
*/
import { Component } from '@angular/core';

@Component({
  // Este componente no usa otros componentes dentro de su plantilla.
  imports: [],
  // Etiqueta con la que se usa en otras plantillas: <app-footer />
  selector: 'app-footer',
  // Estilos propios del componente (los estilos visuales vienen de Tailwind).
  styleUrl: './footer.css',
  // Plantilla HTML del componente.
  templateUrl: './footer.html',
})
export class Footer {}