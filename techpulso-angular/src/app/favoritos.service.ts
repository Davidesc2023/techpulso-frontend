/*
  TechPulso - favoritos.service.ts (servicio de favoritos)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Guarda las noticias favoritas del usuario en localStorage, para que
  sigan ahí aunque cierre o recargue la página. Es un servicio: una única
  copia compartida por todos los componentes (header, Noticias, Detalle y
  Favoritos), por eso el contador del header y la lista de Favoritos
  siempre muestran lo mismo.

  Los datos viven en un "signal" (un valor que avisa a la pantalla cuando
  cambia), así que lo que se dibuja se actualiza solo al agregar o quitar.
*/
import { Injectable, computed, signal } from '@angular/core';
import { Favorito, Noticia } from './noticia';

@Injectable({
  // Una sola copia del servicio para toda la aplicación.
  providedIn: 'root',
})
export class FavoritosService {
  // Nombre con el que se guarda la lista en localStorage.
  private readonly clave = 'techpulso_favoritos';

  // Lista de favoritos, del más reciente al más antiguo. Al crearse el
  // servicio se lee lo que haya guardado en localStorage.
  readonly favoritos = signal<Favorito[]>(this.cargar());

  // Cantidad de favoritos (se recalcula sola cuando cambia la lista).
  readonly cantidad = computed(() => this.favoritos().length);

  // Suma de los minutos de lectura de todos los favoritos. El tiempo de
  // cada noticia es un texto como "4 min", por eso se toma solo el número.
  readonly minutosTotales = computed(() =>
    this.favoritos().reduce(
      (total, favorito) => total + (parseInt(favorito.noticia.lectura, 10) || 0),
      0,
    ),
  );

  // Dice si una noticia ya está guardada en favoritos.
  esFavorito(id: number): boolean {
    return this.favoritos().some((favorito) => favorito.noticia.id === id);
  }

  // Guarda la noticia si no estaba y la quita si ya estaba. Devuelve true
  // si quedó guardada y false si quedó quitada.
  alternar(noticia: Noticia): boolean {
    if (this.esFavorito(noticia.id)) {
      this.quitar(noticia.id);
      return false;
    }
    this.actualizar([{ noticia, guardadoEn: Date.now() }, ...this.favoritos()]);
    return true;
  }

  // Quita de favoritos la noticia con ese id.
  quitar(id: number): void {
    this.actualizar(this.favoritos().filter((favorito) => favorito.noticia.id !== id));
  }

  // Cambia la lista en pantalla y la guarda en localStorage.
  private actualizar(lista: Favorito[]): void {
    this.favoritos.set(lista);
    try {
      localStorage.setItem(this.clave, JSON.stringify(lista));
    } catch {
      // Si el navegador no deja guardar (por ejemplo, modo privado o sin
      // espacio), la lista sigue funcionando mientras la página esté abierta.
    }
  }

  // Lee los favoritos guardados en localStorage. Si no hay nada, o el
  // contenido está dañado, empieza con la lista vacía en vez de fallar.
  private cargar(): Favorito[] {
    try {
      const texto = localStorage.getItem(this.clave);
      if (!texto) {
        return [];
      }
      const datos: unknown = JSON.parse(texto);
      if (!Array.isArray(datos)) {
        return [];
      }
      // Se descarta cualquier elemento que no tenga la forma esperada.
      return datos.filter(
        (dato): dato is Favorito =>
          typeof dato?.noticia?.id === 'number' &&
          typeof dato?.noticia?.titulo === 'string' &&
          typeof dato?.guardadoEn === 'number',
      );
    } catch {
      return [];
    }
  }
}
