/*
  TechPulso - header.ts (componente Header)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Encabezado compartido por todas las vistas. Aquí están los datos del menú
  de navegación: header.html recorre la lista "enlaces" y dibuja un enlace
  por cada elemento, marcando con el subrayado azul el de la vista abierta.
  También entrega la cantidad de favoritos que muestra junto al ícono de
  marcador.
*/
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FavoritosService } from '../favoritos.service';

// Forma de cada elemento del menú.
interface EnlaceMenu {
  // Palabra que se muestra en el menú.
  texto: string;
  // Dirección a la que lleva (definida en app.routes.ts).
  ruta: string;
  // true: se marca como activo solo en esa dirección exacta. Inicio lo
  // necesita porque su dirección "/" está dentro de todas las demás.
  exacta: boolean;
  // false: nunca se marca como activo (se usa en "Categorías").
  marcable: boolean;
  // Sección de la vista a la que baja el enlace (opcional). Con "categorias"
  // la dirección queda /noticias#categorias.
  fragmento?: string;
}

@Component({
  // Herramientas de Angular que usa la plantilla header.html:
  // - RouterLink: hace que los enlaces naveguen entre vistas sin recargar.
  // - RouterLinkActive: indica si un enlace corresponde a la vista abierta.
  imports: [RouterLink, RouterLinkActive],
  // Etiqueta con la que se usa en otras plantillas: <app-header />
  selector: 'app-header',
  // Estilos propios del componente (los estilos visuales vienen de Tailwind).
  styleUrl: './header.css',
  // Plantilla HTML del componente.
  templateUrl: './header.html',
})
export class Header {
  // Servicio que guarda los favoritos del usuario.
  private readonly favoritos = inject(FavoritosService);

  // Cantidad de noticias guardadas en favoritos (se actualiza sola).
  protected readonly cantidad = this.favoritos.cantidad;

  // Clases de Tailwind de un enlace del menú cuando su vista está abierta
  // (subrayado azul). Son las mismas del diseño de la Entrega 2.
  protected readonly claseActivo =
    'transition-colors text-primary font-bold border-b-2 border-primary pb-1';

  // Clases de Tailwind de un enlace del menú cuando su vista no está abierta.
  protected readonly claseInactivo =
    'font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors pb-1';

  // Elementos del menú, en el orden en que se muestran.
  protected readonly enlaces: EnlaceMenu[] = [
    { texto: 'Inicio', ruta: '/', exacta: true, marcable: true },
    { texto: 'Noticias', ruta: '/noticias', exacta: false, marcable: true },
    { texto: 'Favoritos', ruta: '/favoritos', exacta: false, marcable: true },
    { texto: 'Categorías', ruta: '/noticias', fragmento: 'categorias', exacta: false, marcable: false },
    { texto: 'Contacto', ruta: '/contacto', exacta: false, marcable: true },
  ];
}
