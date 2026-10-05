/*
  TechPulso - noticias.ts (vista de Catálogo de Noticias)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Lógica del catálogo: filtra por categoría, busca por texto, reparte las
  noticias en páginas de 6, maneja el formulario para publicar una noticia,
  el botón de eliminar y el de favoritos. Los datos vienen de
  NoticiasService; esta clase solo decide qué se muestra.

  Casi todo son "computed": valores que se recalculan solos cuando cambia
  algo de lo que dependen (la categoría elegida, el texto buscado, la lista
  de noticias, etc.), y la pantalla se actualiza sin código adicional.
*/
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritosService } from '../favoritos.service';
import { Noticia } from '../noticia';
import { NoticiasService } from '../noticias.service';
import { ToastService } from '../toast.service';

// Cantidad de noticias por página.
const NOTICIAS_POR_PAGINA = 6;

@Component({
  // Herramienta de Angular que usa la plantilla noticias.html:
  // - RouterLink: enlaces que navegan entre vistas sin recargar la página.
  imports: [RouterLink],
  // Etiqueta del componente. Las vistas se muestran mediante el router,
  // así que normalmente no se usa directamente en otra plantilla.
  selector: 'app-noticias',
  // Estilos propios de la vista (los estilos visuales vienen de Tailwind).
  styleUrl: './noticias.css',
  // Plantilla HTML de la vista.
  templateUrl: './noticias.html',
})
export class Noticias {
  // Servicios que usa la vista.
  protected readonly servicio = inject(NoticiasService);
  private readonly favoritos = inject(FavoritosService);
  private readonly toast = inject(ToastService);

  // Categorías de los filtros, en el orden en que se muestran.
  protected readonly categorias = [
    { id: 'all', etiqueta: 'Todas' },
    { id: 'tecnologia', etiqueta: 'Tecnología' },
    { id: 'educativas', etiqueta: 'Educativas' },
    { id: 'turisticas', etiqueta: 'Turísticas' },
    { id: 'comerciales', etiqueta: 'Comerciales' },
  ];

  // Lo que el usuario eligió o escribió.
  protected readonly categoriaActiva = signal('all');
  protected readonly busqueda = signal('');
  private readonly pagina = signal(1);
  // true: la ventana "Publicar Nueva Noticia" está abierta.
  protected readonly modalAbierto = signal(false);

  // Cuántas noticias hay en cada categoría (la clave "all" es el total).
  private readonly conteos = computed(() => {
    const cuenta: Record<string, number> = { all: this.servicio.noticias().length };
    for (const noticia of this.servicio.noticias()) {
      cuenta[noticia.categoria] = (cuenta[noticia.categoria] ?? 0) + 1;
    }
    return cuenta;
  });

  // Noticias que cumplen el filtro de categoría y el texto buscado.
  protected readonly filtradas = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const categoria = this.categoriaActiva();
    return this.servicio.noticias().filter((noticia) => {
      const coincideCategoria = categoria === 'all' || noticia.categoria === categoria;
      const coincideTexto =
        !texto ||
        [noticia.titulo, noticia.descripcion, noticia.autor, noticia.categoriaLabel].some((campo) =>
          campo.toLowerCase().includes(texto),
        );
      return coincideCategoria && coincideTexto;
    });
  });

  // Paginación: cuántas páginas hay y cuál se está viendo.
  protected readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.filtradas().length / NOTICIAS_POR_PAGINA)),
  );
  protected readonly paginaActual = computed(() => Math.min(this.pagina(), this.totalPaginas()));
  protected readonly paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1),
  );

  // Las noticias de la página actual (las que se dibujan).
  protected readonly visibles = computed(() => {
    const inicio = (this.paginaActual() - 1) * NOTICIAS_POR_PAGINA;
    return this.filtradas().slice(inicio, inicio + NOTICIAS_POR_PAGINA);
  });

  // ----- Filtros y buscador -----

  protected elegirCategoria(id: string): void {
    this.categoriaActiva.set(id);
    this.pagina.set(1);
  }

  protected buscar(texto: string): void {
    this.busqueda.set(texto);
    this.pagina.set(1);
  }

  // Cantidad de noticias de una categoría, para mostrarla en el filtro.
  protected conteo(id: string): number {
    return this.conteos()[id] ?? 0;
  }

  // ----- Paginación -----

  protected irAPagina(numero: number): void {
    this.pagina.set(numero);
  }

  protected anterior(): void {
    this.pagina.set(Math.max(1, this.paginaActual() - 1));
  }

  protected siguiente(): void {
    this.pagina.set(Math.min(this.totalPaginas(), this.paginaActual() + 1));
  }

  // ----- Mini CRUD: crear -----

  protected abrirModal(): void {
    this.modalAbierto.set(true);
  }

  protected cerrarModal(): void {
    this.modalAbierto.set(false);
  }

  // Un clic en el fondo oscuro (fuera del cuadro) también cierra la ventana.
  protected clicEnFondo(evento: Event): void {
    if (evento.target === evento.currentTarget) {
      this.cerrarModal();
    }
  }

  // Se ejecuta al enviar el formulario (el navegador ya comprobó que los
  // campos obligatorios estén llenos). Crea la noticia y la muestra.
  protected publicar(
    evento: Event,
    titulo: string,
    categoria: string,
    imagen: string,
    resumen: string,
  ): void {
    // Evita que el navegador recargue la página al enviar el formulario.
    evento.preventDefault();
    this.servicio.agregar({ titulo, categoria, imagen, resumen });
    (evento.currentTarget as HTMLFormElement).reset();
    this.cerrarModal();
    // Se muestran todas las noticias para que la nueva se vea arriba.
    this.categoriaActiva.set('all');
    this.busqueda.set('');
    this.pagina.set(1);
    this.toast.mostrar('Noticia publicada con éxito');
  }

  // ----- Mini CRUD: eliminar -----

  protected eliminar(noticia: Noticia): void {
    if (!confirm(`¿Eliminar la noticia "${noticia.titulo}"?`)) {
      return;
    }
    this.servicio.eliminar(noticia.id);
    this.toast.mostrar('Noticia eliminada', 'delete', true);
  }

  // ----- Favoritos -----

  protected esFavorito(id: number): boolean {
    return this.favoritos.esFavorito(id);
  }

  protected alternarFavorito(noticia: Noticia): void {
    const guardada = this.favoritos.alternar(noticia);
    this.toast.mostrar(guardada ? 'Guardado en Favoritos' : 'Eliminado de Favoritos');
  }

  // Ícono de corazón relleno (guardada) o vacío (no guardada).
  protected variacionIcono(relleno: boolean): string {
    return relleno ? "'FILL' 1" : "'FILL' 0";
  }

  // ----- Clases de Tailwind que cambian según el estado -----

  // Clases del distintivo de categoría de cada tarjeta (cada categoría tiene
  // su propio color, igual que en el diseño de la Entrega 2).
  private readonly clasesEtiqueta: Record<string, string> = {
    tecnologia:
      'absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-on-primary px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold tracking-wide',
    educativas:
      'absolute top-3 left-3 bg-secondary/90 backdrop-blur-sm text-on-secondary px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold tracking-wide',
    turisticas:
      'absolute top-3 left-3 bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold tracking-wide',
    comerciales:
      'absolute top-3 left-3 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold tracking-wide',
  };

  protected claseEtiqueta(categoria: string): string {
    return this.clasesEtiqueta[categoria] ?? this.clasesEtiqueta['tecnologia'];
  }

  // Botón de filtro: azul si es la categoría elegida, gris si no.
  protected clasePill(id: string): string {
    return id === this.categoriaActiva()
      ? 'filter-pill active-pill px-4 py-1.5 rounded-full font-label-md text-label-md bg-primary text-on-primary transition-all whitespace-nowrap shadow-sm'
      : 'filter-pill px-4 py-1.5 rounded-full font-label-md text-label-md bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all whitespace-nowrap';
  }

  // Número entre paréntesis del botón de filtro.
  protected claseConteo(id: string): string {
    return id === this.categoriaActiva()
      ? 'ml-1 opacity-80 font-caption text-caption'
      : 'ml-1 opacity-70 font-caption text-caption';
  }

  // Botones "Anterior" y "Siguiente": normales si se pueden usar, apagados si no.
  protected claseNavegar(habilitado: boolean): string {
    return habilitado
      ? 'px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1 transition-colors'
      : 'px-3 py-1.5 rounded-lg bg-surface-container-low text-outline cursor-not-allowed font-label-md text-label-md flex items-center gap-1 opacity-60';
  }

  // Botón de número de página: azul si es la página actual.
  protected clasePagina(numero: number): string {
    return numero === this.paginaActual()
      ? 'w-9 h-9 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center shadow-sm'
      : 'w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center transition-colors';
  }
}
