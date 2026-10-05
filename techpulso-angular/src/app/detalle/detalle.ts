/*
  TechPulso - detalle.ts (vista de Detalle de Noticia)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Lógica de la vista de Detalle: la barra de progreso de lectura, el botón de
  favoritos, las ventanas de eliminar y de contactar al autor, y los botones
  de compartir. Los avisos de confirmación los dibuja el servicio de avisos.
*/
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritosService } from '../favoritos.service';
import { Noticia } from '../noticia';
import { ToastService } from '../toast.service';

// El artículo que muestra esta vista. Es fijo, por eso sus datos están aquí:
// se necesitan para guardarlo en favoritos. Su número (0) no coincide con el
// de ninguna noticia del catálogo, que empiezan en 1.
const ARTICULO: Noticia = {
  id: 0,
  categoria: 'tecnologia',
  categoriaLabel: 'Tecnología',
  imagen:
    'img/detalle-b0f34b41.jpg',
  tiempo: '24 de Octubre, 2025',
  lectura: '5 min',
  titulo: 'Modelos de Razonamiento Híbridos: La nueva frontera computacional que redefinirá la IA',
  descripcion:
    'Durante años, el debate del machine learning se centró estrictamente en la escala de parámetros y la fuerza bruta de computación masiva. Sin embargo, un nuevo paradigma arquitectónico basado en razonamiento híbrido —que sincroniza inferencia probabilística con verificación simbólica formal— está desafiando las premisas de toda la industria tecnológica global.',
  autor: 'Dra. Elena Ramos',
  autorIniciales: 'ER',
};

@Component({
  // Herramienta de Angular que usa la plantilla detalle.html:
  // - RouterLink: enlaces que navegan entre vistas sin recargar la página.
  imports: [RouterLink],
  // Etiqueta del componente. Las vistas se muestran mediante el router,
  // así que normalmente no se usa directamente en otra plantilla.
  selector: 'app-detalle',
  // Estilos propios de la vista (los estilos visuales vienen de Tailwind).
  styleUrl: './detalle.css',
  // Plantilla HTML de la vista.
  templateUrl: './detalle.html',
})
export class Detalle {
  // Servicios que usa la vista.
  private readonly favoritos = inject(FavoritosService);
  private readonly toast = inject(ToastService);

  // Porcentaje del artículo que ya se recorrió (0 a 100): ancho de la barra.
  protected readonly progreso = signal(0);
  // true: la ventana correspondiente está abierta.
  protected readonly mostrarEliminar = signal(false);
  protected readonly mostrarContacto = signal(false);

  // true si el artículo está guardado en favoritos (se actualiza solo).
  protected readonly esFavorito = computed(() => this.favoritos.esFavorito(ARTICULO.id));

  // Barra de progreso: se recalcula cada vez que el usuario se desplaza por
  // la página, según lo que ha bajado respecto a lo que se puede bajar.
  @HostListener('window:scroll')
  protected actualizarProgreso(): void {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total > 0) {
      this.progreso.set(Math.min(100, Math.max(0, (window.scrollY / total) * 100)));
    }
  }

  // ----- Favoritos -----

  // Guarda el artículo en favoritos o lo quita, y lo avisa.
  protected alternarFavorito(): void {
    if (this.favoritos.alternar(ARTICULO)) {
      this.toast.mostrar('Artículo añadido a tus marcadores guardados', 'bookmark_added');
    } else {
      this.toast.mostrar('Artículo eliminado de tus marcadores', 'bookmark_remove');
    }
  }

  // Ícono de marcador relleno (guardado) o vacío (no guardado).
  protected variacionIcono(): string {
    return this.esFavorito() ? "'FILL' 1" : "'FILL' 0";
  }

  // ----- Ventana de eliminar (simulada) -----

  protected abrirEliminar(): void {
    this.mostrarEliminar.set(true);
  }

  protected cerrarEliminar(): void {
    this.mostrarEliminar.set(false);
  }

  // Este artículo es fijo y no pertenece al catálogo, así que la eliminación
  // es simulada: solo cierra la ventana y muestra el aviso.
  protected confirmarEliminar(): void {
    this.mostrarEliminar.set(false);
    this.toast.mostrar('La noticia ha sido eliminada con éxito', 'delete', true);
  }

  // ----- Ventana de contactar al autor -----

  protected abrirContacto(): void {
    this.mostrarContacto.set(true);
  }

  protected cerrarContacto(): void {
    this.mostrarContacto.set(false);
  }

  // Se ejecuta al enviar el formulario (el navegador ya comprobó que los
  // campos obligatorios estén llenos). Todavía no se envía a ningún servidor.
  protected enviarMensaje(evento: Event): void {
    // Evita que el navegador recargue la página al enviar el formulario.
    evento.preventDefault();
    this.mostrarContacto.set(false);
    this.toast.mostrar('Mensaje enviado a la Dra. Elena Ramos', 'mail');
  }

  // ----- Compartir -----

  // Copia la dirección de la página al portapapeles.
  protected copiarEnlace(): void {
    navigator.clipboard?.writeText(window.location.href).catch(() => {
      // Si el navegador no deja copiar, el aviso se muestra igual.
    });
    this.toast.mostrar('Enlace copiado al portapapeles', 'link');
  }

  // Los botones de X y LinkedIn solo simulan la acción con un aviso:
  // compartir de verdad no es parte de esta entrega.
  protected compartirX(): void {
    this.toast.mostrar('Preparando publicación en X (Twitter)...', 'share');
  }

  protected compartirLinkedIn(): void {
    this.toast.mostrar('Abriendo cuadro de diálogo de LinkedIn...', 'hub');
  }
}
