/*
  TechPulso - detalle.js
  Lógica de la vista de Detalle de Noticia (detalle.html).

  Esta vista es la que tiene más interacciones. Acá manejamos:
  1. La barra de progreso de lectura (arriba, se va llenando según scrolleas).
  2. El botón de "Agregar a Favoritos".
  3. El modal de "Eliminar noticia" (la parte de borrado del mini CRUD).
  4. El modal de "Contactar al Autor".
  5. Compartir/copiar el link de la noticia.

  Todo usa el mismo mensajito de confirmación (showToast) para no repetir
  ese código en cada sección.
*/

document.addEventListener('DOMContentLoaded', function () {

  // --- Barra de progreso de lectura ---
  // Calculamos qué porcentaje del artículo ya se scrolleó y ajustamos
  // el ancho de la barra en la parte de arriba de la página.
  const progressBar = document.getElementById('read-progress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  });

  // --- Notificación tipo "toast" ---
  // La reutilizamos para avisar de favoritos, eliminación, mensaje enviado, etc.
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');
  let toastTimeout;

  function showToast(message, icon = 'check_circle', isError = false) {
    clearTimeout(toastTimeout);
    toastMsg.textContent = message;
    toastIcon.textContent = icon;
    toastIcon.className = isError
      ? 'material-symbols-outlined text-[20px] text-error'
      : 'material-symbols-outlined text-[20px] text-tertiary-fixed';

    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    toastTimeout = setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 3200);
  }

  // --- 1. Botón de Favoritos ---
  // Guardamos el estado en una variable simple (isFavorited); no persiste
  // al recargar la página porque todavía no está conectado a localStorage,
  // eso queda pendiente para cuando integremos la vista de Favoritos con
  // almacenamiento real.
  let isFavorited = false;
  const favBtn = document.getElementById('favorite-btn');
  const favIcon = document.getElementById('favorite-icon');
  const favText = document.getElementById('favorite-text');

  favBtn.addEventListener('click', () => {
    isFavorited = !isFavorited;
    if (isFavorited) {
      favIcon.textContent = 'bookmark';
      favIcon.style.fontVariationSettings = "'FILL' 1";
      favIcon.classList.remove('text-primary');
      favIcon.classList.add('text-primary-container');
      favBtn.classList.add('bg-primary-fixed', 'text-on-primary-fixed');
      favText.textContent = 'Guardado en Favoritos';
      showToast('Artículo añadido a tus marcadores guardados', 'bookmark_added');
    } else {
      favIcon.textContent = 'bookmark_border';
      favIcon.style.fontVariationSettings = "'FILL' 0";
      favIcon.classList.add('text-primary');
      favIcon.classList.remove('text-primary-container');
      favBtn.classList.remove('bg-primary-fixed', 'text-on-primary-fixed');
      favText.textContent = 'Agregar a Favoritos';
      showToast('Artículo eliminado de tus marcadores', 'bookmark_remove');
    }
  });

  // --- 2. Modal de "Eliminar noticia" (mini CRUD) ---
  // Pedimos confirmación antes de "eliminar" (todavía no borra nada real,
  // solo cierra el modal y avisa con el toast).
  const deleteTrigger = document.getElementById('delete-trigger-btn');
  const deleteModal = document.getElementById('delete-modal');
  const cancelDelete = document.getElementById('cancel-delete-btn');
  const confirmDelete = document.getElementById('confirm-delete-btn');

  deleteTrigger.addEventListener('click', () => {
    deleteModal.classList.remove('hidden');
    deleteModal.classList.add('flex');
  });

  cancelDelete.addEventListener('click', () => {
    deleteModal.classList.add('hidden');
    deleteModal.classList.remove('flex');
  });

  confirmDelete.addEventListener('click', () => {
    deleteModal.classList.add('hidden');
    deleteModal.classList.remove('flex');
    showToast('La noticia ha sido eliminada con éxito', 'delete', true);
  });

  // --- 3. Modal de "Contactar al Autor" ---
  const contactTrigger = document.getElementById('contact-btn');
  const contactModal = document.getElementById('contact-modal');
  const closeContact = document.getElementById('close-contact-modal');
  const dismissContact = document.getElementById('dismiss-contact');
  const contactForm = document.getElementById('contact-form');

  function toggleContactModal(show) {
    if (show) {
      contactModal.classList.remove('hidden');
      contactModal.classList.add('flex');
    } else {
      contactModal.classList.add('hidden');
      contactModal.classList.remove('flex');
    }
  }

  contactTrigger.addEventListener('click', () => toggleContactModal(true));
  closeContact.addEventListener('click', () => toggleContactModal(false));
  dismissContact.addEventListener('click', () => toggleContactModal(false));

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    toggleContactModal(false);
    contactForm.reset();
    showToast('Mensaje enviado a la Dra. Elena Ramos', 'mail');
  });

  // --- 4. Compartir y copiar enlace ---
  // El botón de copiar sí funciona de verdad (usa el portapapeles del
  // navegador); los de X y LinkedIn por ahora solo simulan la acción con
  // el toast, ya que integrar el compartido real no es parte de esta entrega.
  document.getElementById('copy-link-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    showToast('Enlace copiado al portapapeles', 'link');
  });

  document.getElementById('share-x-btn').addEventListener('click', () => {
    showToast('Preparando publicación en X (Twitter)...', 'share');
  });

  document.getElementById('share-linkedin-btn').addEventListener('click', () => {
    showToast('Abriendo cuadro de diálogo de LinkedIn...', 'hub');
  });

});
