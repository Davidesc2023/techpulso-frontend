/*
  TechPulso - contacto.ts (vista de Contacto)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Lógica del formulario de contacto: define los campos, sus reglas de
  validación y qué pasa al enviar. Usa formularios reactivos de Angular:
  los campos y las reglas se declaran aquí, en la clase, y la plantilla
  contacto.html se conecta a ellos.

  En la Entrega 2 esto se hacía con funciones sueltas (validateName,
  validateEmail, updateCharCount, handleFormSubmit) llamadas desde el HTML.
*/
import { Component, Injector, afterNextRender, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

// Nombres de los campos del formulario.
type Campo = 'nombre' | 'correo' | 'asunto' | 'mensaje' | 'privacidad';

// Regla: el texto, sin contar espacios al inicio y al final, debe tener al
// menos "minimo" caracteres. Si está vacío no se queja (de eso se encarga
// la regla noVacio, que va antes).
function textoMinimo(minimo: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const texto = String(control.value ?? '').trim();
    return texto.length === 0 || texto.length >= minimo ? null : { corto: true };
  };
}

// Regla: no puede estar vacío ni tener solo espacios.
function noVacio(control: AbstractControl): ValidationErrors | null {
  return String(control.value ?? '').trim().length > 0 ? null : { required: true };
}

@Component({
  // Herramienta de Angular que usa la plantilla contacto.html:
  // - ReactiveFormsModule: conecta los campos de la plantilla con el
  //   formulario de esta clase ([formGroup] y formControlName).
  imports: [ReactiveFormsModule],
  // Etiqueta del componente. Las vistas se muestran mediante el router,
  // así que normalmente no se usa directamente en otra plantilla.
  selector: 'app-contacto',
  // Estilos propios de la vista (los estilos visuales vienen de Tailwind).
  styleUrl: './contacto.css',
  // Plantilla HTML de la vista.
  templateUrl: './contacto.html',
})
export class Contacto {
  // Necesario para pedir una acción "después de dibujar" (ver enviar()).
  private readonly injector = inject(Injector);

  // true: el aviso verde de "Mensaje enviado con éxito" está visible.
  protected readonly enviado = signal(false);

  // El formulario: un control por cada campo, con su valor inicial y sus
  // reglas. "nonNullable" hace que al limpiar el formulario cada campo
  // vuelva a su valor inicial (texto vacío o casilla sin marcar).
  protected readonly formulario = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [noVacio, textoMinimo(3)],
    }),
    correo: new FormControl('', {
      nonNullable: true,
      // Formato sencillo: algo@algo.algo, suficiente para esta validación básica.
      validators: [noVacio, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)],
    }),
    asunto: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    mensaje: new FormControl('', {
      nonNullable: true,
      validators: [noVacio, Validators.maxLength(1000)],
    }),
    privacidad: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  });

  // Textos de error de cada campo.
  private readonly textosError: Record<string, Record<string, string>> = {
    nombre: {
      required: 'Escribe tu nombre completo.',
      corto: 'El nombre debe tener al menos 3 letras.',
    },
    correo: {
      required: 'Escribe tu correo electrónico.',
      pattern: 'Escribe un correo válido, por ejemplo nombre@dominio.com.',
    },
    asunto: { required: 'Selecciona un asunto.' },
    mensaje: { required: 'Escribe tu mensaje.' },
    privacidad: { required: 'Debes aceptar la política de privacidad.' },
  };

  // Cantidad de caracteres escritos en el mensaje (para el contador).
  protected longitudMensaje(): number {
    return this.formulario.controls.mensaje.value.length;
  }

  // true si el campo cumple todas sus reglas (muestra la insignia "Válido").
  protected valido(campo: 'nombre' | 'correo'): boolean {
    return this.formulario.controls[campo].valid;
  }

  // true si hay que mostrar el error de un campo: está mal y el usuario ya
  // pasó por él (o intentó enviar el formulario).
  protected mostrarError(campo: Campo): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && control.touched;
  }

  // Texto del primer error que tenga el campo.
  protected mensajeError(campo: Campo): string {
    const errores = this.formulario.controls[campo].errors ?? {};
    const clave = Object.keys(errores)[0];
    return this.textosError[campo][clave] ?? 'Revisa este campo.';
  }

  // Se ejecuta al enviar el formulario.
  protected enviar(): void {
    // Si falta algo, se marcan todos los campos como "tocados" para que
    // cada uno muestre su error, y no se envía.
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    // Todavía no se manda a ningún servidor (no hay en esta entrega): solo
    // se limpia el formulario y se muestra el aviso de éxito.
    this.formulario.reset();
    this.enviado.set(true);
    // Cuando el aviso ya esté dibujado, se baja la página hasta él.
    afterNextRender(
      () => {
        document
          .getElementById('mensaje-enviado')
          ?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
      },
      { injector: this.injector },
    );
  }
}
