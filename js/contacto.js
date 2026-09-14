/*
  TechPulso - contacto.js
  Lógica de la vista de Contacto (contacto.html).

  Estas funciones se llaman directo desde los atributos oninput/onsubmit
  del HTML (así las generó la maquetación), por eso las dejamos como
  funciones globales en vez de usar addEventListener; si cambiáramos
  eso también tendríamos que tocar el HTML, y preferimos no arriesgar
  el diseño ya aprobado en esta entrega.

  Qué hace cada una:
  - validateName / validateEmail: van marcando con un ícono verde el
    campo de nombre y de correo mientras el usuario escribe, si el
    formato es válido.
  - updateCharCount: actualiza el contador "x / 1000" del mensaje y lo
    pone en rojo cuando se está acercando al límite.
  - handleFormSubmit: se dispara al enviar el formulario. Todavía no
    manda el mensaje a ningún servidor (no hay backend en esta entrega),
    solo muestra el banner de éxito y limpia el formulario.
*/

function validateName(input) {
  const badge = document.getElementById('nameValidBadge');
  const icon = document.getElementById('nameIcon');
  if (input.value.trim().length >= 3) {
    badge.classList.remove('hidden');
    badge.classList.add('flex');
    icon.classList.remove('text-outline');
    icon.classList.add('text-tertiary');
  } else {
    badge.classList.add('hidden');
    badge.classList.remove('flex');
    icon.classList.add('text-outline');
    icon.classList.remove('text-tertiary');
  }
}

function validateEmail(input) {
  const badge = document.getElementById('emailValidBadge');
  const icon = document.getElementById('emailIcon');
  // Expresión regular sencilla: algo@algo.algo, suficiente para esta validación básica
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (re.test(input.value.trim())) {
    badge.classList.remove('hidden');
    badge.classList.add('flex');
    icon.classList.remove('text-outline');
    icon.classList.add('text-tertiary');
  } else {
    badge.classList.add('hidden');
    badge.classList.remove('flex');
    icon.classList.add('text-outline');
    icon.classList.remove('text-tertiary');
  }
}

function updateCharCount(textarea) {
  const counter = document.getElementById('charCount');
  const length = textarea.value.length;
  counter.textContent = `${length} / 1000`;
  if (length >= 950) {
    counter.classList.add('text-error');
    counter.classList.remove('text-outline');
  } else {
    counter.classList.remove('text-error');
    counter.classList.add('text-outline');
  }
}

function handleFormSubmit() {
  const banner = document.getElementById('successBanner');
  const form = document.getElementById('contactForm');

  banner.classList.remove('hidden');
  banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  form.reset();

  // Dejamos todo (contador, badges de validación) como al principio,
  // para que si el usuario quiere enviar otro mensaje no vea rastros
  // del envío anterior.
  document.getElementById('charCount').textContent = '0 / 1000';
  document.getElementById('nameValidBadge').classList.add('hidden');
  document.getElementById('nameValidBadge').classList.remove('flex');
  document.getElementById('emailValidBadge').classList.add('hidden');
  document.getElementById('emailValidBadge').classList.remove('flex');
  document.getElementById('nameIcon').classList.add('text-outline');
  document.getElementById('nameIcon').classList.remove('text-tertiary');
  document.getElementById('emailIcon').classList.add('text-outline');
  document.getElementById('emailIcon').classList.remove('text-tertiary');
}
