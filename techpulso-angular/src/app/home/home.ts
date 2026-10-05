/*
  TechPulso - home.ts (vista de Inicio)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Lógica de la vista de Inicio. En la Entrega 2 este código estaba escrito
  dentro del HTML (onclick y onsubmit); aquí vive en la clase y la
  plantilla home.html lo llama con eventos de Angular: (click) y (submit).
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
export class Home {
  /*
    Botón de marcador de cada tarjeta: pinta el botón de azul y rellena el
    ícono; al volver a hacer clic, los deja como estaban. Por ahora solo
    cambia el aspecto, no guarda nada. Más adelante se reemplaza por los
    favoritos reales, guardados en localStorage.
  */
  alternarFavorito(evento: Event): void {
    const boton = evento.currentTarget as HTMLElement;
    boton.classList.toggle('text-primary');

    const icono = boton.querySelector('span') as HTMLElement | null;
    if (!icono) {
      return;
    }
    // Si el ícono ya está relleno (FILL 1) lo vacía (FILL 0), y viceversa.
    const estaRelleno = icono.style.getPropertyValue('font-variation-settings').includes('1');
    icono.style.setProperty('font-variation-settings', estaRelleno ? "'FILL' 0" : "'FILL' 1");
  }

  /*
    Formulario del newsletter: evita que la página se recargue al enviar,
    muestra un mensaje de confirmación y limpia el campo del correo.
    Todavía no guarda el correo en ningún lado (no hay servidor).
  */
  suscribirse(evento: Event): void {
    evento.preventDefault();
    alert('¡Gracias por unirte al pulso tecnológico!');
    (evento.currentTarget as HTMLFormElement).reset();
  }
}