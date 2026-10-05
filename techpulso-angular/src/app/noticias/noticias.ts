/*
  TechPulso - noticias.ts (vista de Catálogo de Noticias)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Contenido temporal: todavía no tiene lógica, por eso la clase está
  vacía. Más adelante recibirá aquí la lectura de noticias.json, los filtros por categoría, el buscador y el formulario para agregar noticias.
*/
import { Component } from '@angular/core';

@Component({
  // Esta vista no usa otros componentes dentro de su plantilla.
  imports: [],
  // Etiqueta del componente. Las vistas se muestran mediante el router,
  // así que normalmente no se usa directamente en otra plantilla.
  selector: 'app-noticias',
  // Estilos propios de la vista (los estilos visuales vienen de Tailwind).
  styleUrl: './noticias.css',
  // Plantilla HTML de la vista.
  templateUrl: './noticias.html',
})
export class Noticias {}
