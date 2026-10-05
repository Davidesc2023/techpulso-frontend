/*
  TechPulso - favoritos.ts (vista de Favoritos)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Contenido temporal: todavía no tiene lógica, por eso la clase está
  vacía. Más adelante recibirá aquí la lista de noticias guardadas en localStorage.
*/
import { Component } from '@angular/core';

@Component({
  // Esta vista no usa otros componentes dentro de su plantilla.
  imports: [],
  // Etiqueta del componente. Las vistas se muestran mediante el router,
  // así que normalmente no se usa directamente en otra plantilla.
  selector: 'app-favoritos',
  // Estilos propios de la vista (los estilos visuales vienen de Tailwind).
  styleUrl: './favoritos.css',
  // Plantilla HTML de la vista.
  templateUrl: './favoritos.html',
})
export class Favoritos {}
