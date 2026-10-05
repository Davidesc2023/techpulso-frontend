/*
  TechPulso - toast.ts (componente del aviso flotante)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Dibuja el aviso flotante. Está en app.html, así que existe una sola vez
  para toda la aplicación; lo que muestra lo decide ToastService.
*/
import { Component, inject } from '@angular/core';
import { ToastService } from '../toast.service';

@Component({
  // Este componente no usa otros componentes dentro de su plantilla.
  imports: [],
  // Etiqueta con la que se usa en app.html: <app-toast />
  selector: 'app-toast',
  // Estilos propios del componente (los estilos visuales vienen de Tailwind).
  styleUrl: './toast.css',
  // Plantilla HTML del componente.
  templateUrl: './toast.html',
})
export class Toast {
  // Servicio que dice qué mostrar y cuándo (se actualiza solo).
  protected readonly toast = inject(ToastService);
}
