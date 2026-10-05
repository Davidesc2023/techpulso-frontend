/*
  TechPulso - favoritos.ts (vista de Favoritos)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Muestra las noticias que el usuario guardó. Los datos vienen del servicio
  de favoritos (que las guarda en localStorage), así que la lista se
  actualiza sola al quitar una noticia, y cuando no queda ninguna aparece
  el mensaje de "Aún no tienes favoritos".

  En la Entrega 2 esta vista era una demostración con tres tarjetas fijas y
  botones para simular la vista vacía. Aquí funciona con datos reales, por
  eso esos botones de demostración ya no existen.
*/
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritosService } from '../favoritos.service';

@Component({
  // Herramienta de Angular que usa la plantilla favoritos.html:
  // - RouterLink: enlaces que navegan entre vistas sin recargar la página.
  imports: [RouterLink],
  // Etiqueta del componente. Las vistas se muestran mediante el router,
  // así que normalmente no se usa directamente en otra plantilla.
  selector: 'app-favoritos',
  // Estilos propios de la vista (los estilos visuales vienen de Tailwind).
  styleUrl: './favoritos.css',
  // Plantilla HTML de la vista.
  templateUrl: './favoritos.html',
})
export class Favoritos {
  // Servicio que guarda y entrega los favoritos.
  private readonly servicio = inject(FavoritosService);

  // Datos que muestra la plantilla (vienen del servicio y se actualizan solos).
  protected readonly favoritos = this.servicio.favoritos;
  protected readonly cantidad = this.servicio.cantidad;
  protected readonly minutosTotales = this.servicio.minutosTotales;

  // "artículo" o "artículos" según la cantidad.
  protected readonly palabraArticulos = computed(() =>
    this.cantidad() === 1 ? 'artículo' : 'artículos',
  );

  // Frase de estado que aparece debajo del título.
  protected readonly textoEstado = computed(() => {
    const total = this.cantidad();
    if (total === 0) {
      return 'No tienes artículos en tu lista de favoritos';
    }
    if (total === 1) {
      return 'Tienes 1 artículo en tu lista de favoritos';
    }
    return `Tienes ${total} artículos en tu lista de favoritos`;
  });

  // Clases de Tailwind de la etiqueta de categoría de cada tarjeta. Cada
  // categoría tiene su propio color, igual que en el diseño de la Entrega 2.
  private readonly clasesEtiqueta: Record<string, string> = {
    tecnologia:
      'px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold tracking-wide shadow-sm',
    educativas:
      'px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold tracking-wide shadow-sm',
    comerciales:
      'px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm font-semibold tracking-wide shadow-sm',
    turisticas:
      'px-3 py-1 rounded-full bg-tertiary text-on-tertiary font-label-sm text-label-sm font-semibold tracking-wide shadow-sm',
  };

  // Devuelve las clases de la etiqueta según la categoría de la noticia.
  protected claseEtiqueta(categoria: string): string {
    return this.clasesEtiqueta[categoria] ?? this.clasesEtiqueta['tecnologia'];
  }

  // Convierte el momento en que se guardó en un texto como "hace 2 horas".
  protected haceCuanto(marca: number): string {
    const segundos = Math.floor((Date.now() - marca) / 1000);
    if (segundos < 60) {
      return 'hace unos segundos';
    }
    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) {
      return minutos === 1 ? 'hace 1 minuto' : `hace ${minutos} minutos`;
    }
    const horas = Math.floor(minutos / 60);
    if (horas < 24) {
      return horas === 1 ? 'hace 1 hora' : `hace ${horas} horas`;
    }
    const dias = Math.floor(horas / 24);
    return dias === 1 ? 'ayer' : `hace ${dias} días`;
  }

  // Botón "Quitar" de una tarjeta: la saca de favoritos.
  protected quitar(id: number): void {
    this.servicio.quitar(id);
  }
}
