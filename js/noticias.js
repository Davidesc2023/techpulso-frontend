/*
  TechPulso - noticias.js
  Lógica de la vista de Catálogo de Noticias (noticias.html).

  Acá viven 4 cosas que hace esta vista:
  1. El modal para crear una noticia nueva (el botón "+ Agregar Noticia").
  2. Los filtros por categoría (los "pills" de Todas/Tecnología/Educativas...).
  3. El buscador que filtra las tarjetas mientras escribes.
  4. El botón de favorito en cada tarjeta.

  Por ahora todo esto trabaja directo sobre el HTML que ya está en la
  página (no hay datos dinámicos ni JSON todavía, eso lo dejamos para
  cuando conectemos el archivo de noticias más adelante).
*/

document.addEventListener('DOMContentLoaded', function () {

  // --- Elementos del modal de "Agregar Noticia" ---
  const openModalBtn = document.getElementById('open-create-modal');
  const closeModalBtn = document.getElementById('close-create-modal');
  const cancelModalBtn = document.getElementById('cancel-modal');
  const modalBackdrop = document.getElementById('crud-modal-backdrop');
  const modalPanel = document.getElementById('crud-modal-panel');
  const createForm = document.getElementById('create-article-form');

  // --- Elementos de filtros, buscador y notificación ---
  const filterPills = document.querySelectorAll('.filter-pill');
  const articleCards = document.querySelectorAll('.article-card');
  const searchInput = document.getElementById('search-input');
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  // Muestra el mensajito flotante de confirmación (abajo a la derecha)
  // y lo vuelve a ocultar solo después de 3 segundos.
  function showToast(msg) {
    toastMessage.textContent = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
  }

  function openModal() {
    modalBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    modalBackdrop.classList.add('opacity-100', 'pointer-events-auto');
    modalPanel.classList.remove('scale-95');
    modalPanel.classList.add('scale-100');
  }

  function closeModal() {
    modalBackdrop.classList.remove('opacity-100', 'pointer-events-auto');
    modalBackdrop.classList.add('opacity-0', 'pointer-events-none');
    modalPanel.classList.remove('scale-100');
    modalPanel.classList.add('scale-95');
  }

  openModalBtn?.addEventListener('click', openModal);
  closeModalBtn?.addEventListener('click', closeModal);
  cancelModalBtn?.addEventListener('click', closeModal);

  // Si el usuario hace clic afuera del cuadro del modal (en el fondo oscuro),
  // también lo cerramos, como en la mayoría de apps.
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  // Al "publicar" la noticia del formulario todavía no la guardamos en
  // ningún lado (no hay backend ni JSON conectado en esta entrega), solo
  // simulamos que se envió a revisión y cerramos el modal.
  createForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal();
    createForm.reset();
    showToast('Noticia agregada con éxito a revisión');
  });

  // --- Filtro por categoría ---
  // Cada "pill" tiene un data-category. Al hacer clic, marcamos esa como
  // activa y ocultamos las tarjetas que no coincidan con la categoría
  // elegida (o mostramos todas si se eligió "Todas").
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active-pill', 'bg-primary', 'text-on-primary', 'shadow-sm');
        p.classList.add('bg-surface-container-low', 'text-on-surface-variant');
      });
      pill.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
      pill.classList.add('active-pill', 'bg-primary', 'text-on-primary', 'shadow-sm');

      const category = pill.getAttribute('data-category');
      articleCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- Buscador ---
  // Filtro simple: si el texto de la tarjeta (título, descripción, etc.)
  // contiene lo que el usuario escribió, la dejamos visible.
  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    articleCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });

  // --- Botón de favorito en cada tarjeta ---
  // Usamos un data-attribute (data-favorited) para saber el estado actual
  // y vamos cambiando el ícono y el color según toque marcar o desmarcar.
  document.querySelectorAll('.fav-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const icon = btn.querySelector('.material-symbols-outlined');
      const isFilled = btn.dataset.favorited === 'true';

      if (isFilled) {
        btn.dataset.favorited = 'false';
        btn.classList.remove('text-error');
        btn.classList.add('text-on-surface-variant');
        icon.style.fontVariationSettings = "'FILL' 0";
        showToast('Eliminado de Favoritos');
      } else {
        btn.dataset.favorited = 'true';
        btn.classList.remove('text-on-surface-variant');
        btn.classList.add('text-error');
        icon.style.fontVariationSettings = "'FILL' 1";
        showToast('Guardado en Favoritos');
      }
    });
  });

});
