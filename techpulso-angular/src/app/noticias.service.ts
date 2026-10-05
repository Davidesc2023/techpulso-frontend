/*
  TechPulso - noticias.service.ts (servicio de noticias)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Entrega la lista de noticias al catálogo y maneja el mini CRUD:
  - Leer: trae las noticias del archivo public/data/noticias.json con
    HttpClient (en la Entrega 2 se hacía con fetch()).
  - Crear: las noticias nuevas se guardan en localStorage, porque una página
    sin servidor no puede escribir dentro de noticias.json.
  - Eliminar: una noticia creada se borra de localStorage; una del archivo
    JSON se anota como "eliminada" y deja de mostrarse (el archivo no se
    modifica). Al eliminar una noticia también se quita de favoritos.
*/
import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { FavoritosService } from './favoritos.service';
import { Noticia } from './noticia';

// Datos que pide el formulario "Publicar Nueva Noticia".
export interface NuevaNoticia {
  titulo: string;
  categoria: string;
  // Dirección de la imagen. Puede venir vacía.
  imagen: string;
  resumen: string;
}

// Nombre de cada categoría tal como se muestra en pantalla.
const ETIQUETAS: Record<string, string> = {
  tecnologia: 'Tecnología',
  educativas: 'Educativas',
  turisticas: 'Turísticas',
  comerciales: 'Comerciales',
};

@Injectable({
  // Una sola copia del servicio para toda la aplicación.
  providedIn: 'root',
})
export class NoticiasService {
  // Herramienta de Angular para leer archivos y datos por internet.
  private readonly http = inject(HttpClient);
  // Servicio de favoritos (se usa para quitar una noticia eliminada).
  private readonly favoritos = inject(FavoritosService);

  // Nombres con los que se guardan los datos en localStorage.
  private readonly claveCreadas = 'techpulso_noticias_creadas';
  private readonly claveEliminadas = 'techpulso_noticias_eliminadas';

  // Noticias leídas del archivo noticias.json.
  private readonly base = signal<Noticia[]>([]);
  // Noticias que el usuario creó con el formulario.
  private readonly creadas = signal<Noticia[]>(this.leerCreadas());
  // Números de las noticias del archivo que el usuario eliminó.
  private readonly eliminadas = signal<number[]>(this.leerEliminadas());

  // true mientras se espera la respuesta del archivo noticias.json.
  readonly cargando = signal(true);
  // true si no se pudo leer noticias.json.
  readonly error = signal(false);

  // Lista final que se muestra: primero las creadas (la más nueva arriba) y
  // luego las del archivo, sin las eliminadas. Se recalcula sola.
  readonly noticias = computed(() =>
    [...this.creadas(), ...this.base()].filter((n) => !this.eliminadas().includes(n.id)),
  );

  constructor() {
    this.cargar();
  }

  // Lee public/data/noticias.json. La dirección es relativa para que
  // funcione igual en el computador y cuando la página esté publicada.
  private cargar(): void {
    this.http.get<Noticia[]>('data/noticias.json').subscribe({
      next: (datos) => {
        this.base.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }

  // Crea una noticia nueva a partir del formulario y la guarda. Devuelve la
  // noticia creada.
  agregar(datos: NuevaNoticia): Noticia {
    // El número nuevo es mayor que cualquiera usado antes, incluidas las
    // eliminadas, para no repetir números.
    const usados = [
      ...this.base().map((n) => n.id),
      ...this.creadas().map((n) => n.id),
      ...this.eliminadas(),
    ];
    const resumen = datos.resumen.trim();
    // Tiempo de lectura estimado: unas 180 palabras por minuto.
    const palabras = resumen.split(/\s+/).filter(Boolean).length;

    const noticia: Noticia = {
      id: Math.max(0, ...usados) + 1,
      categoria: datos.categoria,
      categoriaLabel: ETIQUETAS[datos.categoria] ?? datos.categoria,
      // Si no escribieron una imagen se usa la que viene en public/.
      imagen: datos.imagen.trim() || 'sin-imagen.svg',
      tiempo: 'Hace un momento',
      lectura: `${Math.max(1, Math.ceil(palabras / 180))} min`,
      titulo: datos.titulo.trim(),
      descripcion: resumen,
      autor: 'Redacción TechPulso',
      autorIniciales: 'TP',
    };
    this.actualizarCreadas([noticia, ...this.creadas()]);
    return noticia;
  }

  // Elimina una noticia del catálogo y de favoritos.
  eliminar(id: number): void {
    if (this.creadas().some((n) => n.id === id)) {
      this.actualizarCreadas(this.creadas().filter((n) => n.id !== id));
    } else {
      this.eliminadas.set([...this.eliminadas(), id]);
      this.guardar(this.claveEliminadas, this.eliminadas());
    }
    this.favoritos.quitar(id);
  }

  // Cambia la lista de noticias creadas y la guarda en localStorage.
  private actualizarCreadas(lista: Noticia[]): void {
    this.creadas.set(lista);
    this.guardar(this.claveCreadas, lista);
  }

  // Guarda un dato en localStorage. Si el navegador no deja, la lista sigue
  // funcionando mientras la página esté abierta.
  private guardar(clave: string, valor: unknown): void {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      // Sin permiso o sin espacio: se ignora.
    }
  }

  // Lee de localStorage las noticias creadas. Descarta lo que esté dañado.
  private leerCreadas(): Noticia[] {
    const datos = this.leer(this.claveCreadas);
    return datos.filter(
      (d): d is Noticia =>
        typeof d?.id === 'number' && typeof d?.titulo === 'string' && typeof d?.categoria === 'string',
    );
  }

  // Lee de localStorage los números de las noticias eliminadas.
  private leerEliminadas(): number[] {
    return this.leer(this.claveEliminadas).filter((d): d is number => typeof d === 'number');
  }

  // Lee una lista guardada en localStorage. Si no hay nada, o está dañada,
  // devuelve una lista vacía en vez de fallar.
  private leer(clave: string): any[] {
    try {
      const texto = localStorage.getItem(clave);
      const datos: unknown = texto ? JSON.parse(texto) : [];
      return Array.isArray(datos) ? datos : [];
    } catch {
      return [];
    }
  }
}
