/*
  TechPulso - toast.service.ts (servicio del aviso flotante)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Maneja el aviso que aparece abajo a la derecha para confirmar una acción
  ("Guardado en Favoritos", "Mensaje enviado", etc.). En la Entrega 2 cada
  página tenía su propio aviso con su propio código; aquí hay uno solo,
  compartido por todas las vistas. Cualquier componente llama a mostrar()
  y el componente Toast (toast.html) lo dibuja.
*/
import { Injectable, signal } from '@angular/core';

@Injectable({
  // Una sola copia del servicio para toda la aplicación.
  providedIn: 'root',
})
export class ToastService {
  // Texto del aviso.
  readonly mensaje = signal('');
  // Nombre del ícono de Material Symbols que acompaña al texto.
  readonly icono = signal('check_circle');
  // true: el aviso es de error (ícono rojo); false: es de confirmación.
  readonly esError = signal(false);
  // true: el aviso está a la vista; false: está escondido.
  readonly visible = signal(false);

  // Temporizador que esconde el aviso solo, pasados unos segundos.
  private temporizador: ReturnType<typeof setTimeout> | undefined;

  // Muestra el aviso y lo esconde solo a los 3,2 segundos. Si se pide otro
  // aviso mientras hay uno visible, el nuevo reemplaza al anterior.
  mostrar(mensaje: string, icono = 'check_circle', esError = false): void {
    clearTimeout(this.temporizador);
    this.mensaje.set(mensaje);
    this.icono.set(icono);
    this.esError.set(esError);
    this.visible.set(true);
    this.temporizador = setTimeout(() => this.visible.set(false), 3200);
  }
}
