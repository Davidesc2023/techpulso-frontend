/*
  TechPulso - index.js
  Lógica de la vista de Inicio (Home).

  Por ahora esta vista solo tiene el formulario de suscripción al
  newsletter. No lo conectamos a ningún backend todavía (eso no lo
  pide esta entrega), simplemente evitamos que la página se recargue
  al enviar y mostramos un mensaje de confirmación.
*/

document.addEventListener('DOMContentLoaded', function () {
  const newsletterForm = document.getElementById('newsletter-form');

  // Si por algún motivo el formulario no está en la página, no hacemos nada
  // (evita errores en consola si alguien reutiliza este JS en otra vista).
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', function (event) {
    // Evitamos que el navegador intente enviar el form y recargue la página
    event.preventDefault();

    alert('¡Gracias por unirte al pulso tecnológico!');

    // Limpiamos el campo de correo para que quede listo si alguien
    // más quiere suscribirse desde el mismo dispositivo.
    newsletterForm.reset();
  });
});
