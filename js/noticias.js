/*
  TechPulso - noticias.js
  Lógica de la vista de Catálogo de Noticias (noticias.html).

  A diferencia de la primera versión de este archivo, ahora las noticias
  YA NO están escritas directo en el HTML: las leemos desde
  data/noticias.json con fetch() y las dibujamos en pantalla al cargar
  la página. Por eso hay que abrir este archivo desde un servidor local
  (Live Server, por ejemplo) y no con doble clic, porque los navegadores
  bloquean el fetch() de archivos locales abiertos con file://.

  Acá viven 5 cosas que hace esta vista:
  1. Traer las noticias del JSON y dibujar las tarjetas (renderArticles).
  2. El modal para crear una noticia nueva (el botón "+ Agregar Noticia").
  3. Los filtros por categoría (los "pills" de Todas/Tecnología/Educativas...).
  4. El buscador que filtra las tarjetas mientras escribes.
  5. El botón de favorito en cada tarjeta.
*/

document.addEventListener('DOMContentLoaded', function () {

  const articlesGrid = document.getElementById('articles-grid');

  // Clases de color del badge de categoría, tal como venían en el diseño
  // original (cada categoría tiene su propio color para diferenciarse
  // rápido dentro del catálogo).
  const badgeClasesPorCategoria = {
    tecnologia: 'bg-primary/90 backdrop-blur-sm text-on-primary',
    educativas: 'bg-secondary/90 backdrop-blur-sm text-on-secondary',
    turisticas: 'bg-tertiary-container text-on-tertiary-container',
    comerciales: 'bg-secondary-container text-on-secondary-container'
  };

  // Construye el HTML de una tarjeta de noticia a partir de un objeto
  // del JSON. Usamos exactamente las mismas clases de Tailwind que traía
  // el diseño original, solo que ahora las armamos con datos en vez de
  // tenerlas escritas a mano una por una.
  function crearTarjetaHTML(noticia) {
    const badgeClase = badgeClasesPorCategoria[noticia.categoria] || 'bg-primary text-on-primary';

    return `
      <article class="article-card flex flex-col bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden" data-category="${noticia.categoria}">
        <div class="relative w-full h-52 overflow-hidden bg-surface-container">
          <img class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" src="${noticia.imagen}" alt="${noticia.titulo}"/>
          <div class="absolute top-3 left-3 ${badgeClase} px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold tracking-wide">
            ${noticia.categoriaLabel}
          </div>
          <button class="fav-toggle absolute top-3 right-3 w-9 h-9 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center text-on-surface-variant hover:text-error transition-colors shadow-sm" data-favorited="false" title="Guardar en favoritos" type="button">
            <span class="material-symbols-outlined text-[20px]">favorite</span>
          </button>
        </div>
        <div class="flex-1 p-space-md flex flex-col justify-between">
          <div class="space-y-space-xs">
            <div class="flex items-center gap-space-xs text-outline font-caption text-caption">
              <span class="material-symbols-outlined text-[16px]">schedule</span>
              <span>${noticia.tiempo}</span>
              <span>•</span>
              <span>Lectura: ${noticia.lectura}</span>
            </div>
            <h3 class="font-headline-sm text-headline-sm text-on-surface font-semibold line-clamp-2 hover:text-primary transition-colors cursor-pointer">
              ${noticia.titulo}
            </h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 leading-relaxed">
              ${noticia.descripcion}
            </p>
          </div>
          <div class="pt-space-md mt-space-sm flex items-center justify-between">
            <div class="flex items-center gap-space-xs">
              <div class="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-label-sm text-label-sm font-bold">
                ${noticia.autorIniciales}
              </div>
              <span class="font-caption text-caption text-on-surface-variant font-medium">${noticia.autor}</span>
            </div>
            <a class="inline-flex items-center gap-1 text-primary hover:text-primary-container font-label-md text-label-md font-semibold transition-colors" href="detalle.html">
              <span>Ver más</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>
        </div>
      </article>
    `;
  }

  // Trae el JSON y dibuja todas las tarjetas dentro del grid. Si algo
  // sale mal (por ejemplo, si alguien abre el archivo con doble clic en
  // vez de con un servidor local), mostramos un aviso en vez de dejar
  // la pantalla en blanco sin explicación.
  function cargarNoticias() {
    fetch('data/noticias.json')
      .then(function (respuesta) {
        if (!respuesta.ok) throw new Error('No se pudo leer el archivo de noticias');
        return respuesta.json();
      })
      .then(function (noticias) {
        articlesGrid.innerHTML = noticias.map(crearTarjetaHTML).join('');
        inicializarInteraccionesDeTarjetas();
      })
      .catch(function (error) {
        console.error('Error cargando noticias.json:', error);
        articlesGrid.innerHTML = `
          <p class="col-span-full text-center text-error font-body-sm text-body-sm py-space-lg">
            No se pudieron cargar las noticias. Si abriste este archivo con doble clic,
            recuerda que necesitas un servidor local (por ejemplo, la extensión "Live Server" de VS Code)
            para que el navegador pueda leer data/noticias.json.
          </p>
        `;
      });
  }

  // --- Elementos del modal de "Agregar Noticia" ---
  const openModalBtn = document.getElementById('open-create-modal');
  const closeModalBtn = document.getElementById('close-create-modal');
  const cancelModalBtn = document.getElementById('cancel-modal');
  const modalBackdrop = document.getElementById('crud-modal-backdrop');
  const modalPanel = document.getElementById('crud-modal-panel');
  const createForm = document.getElementById('create-article-form');

  // --- Elementos de filtros, buscador y notificación ---
  const filterPills = document.querySelectorAll('.filter-pill');
  const searchInput = document.getElementById('search-input');
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

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
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  // Al "publicar" la noticia del formulario todavía no la guardamos en
  // el JSON (eso implicaría escribir en el servidor, que no tenemos en
  // esta entrega), solo simulamos que se envió a revisión.
  createForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal();
    createForm.reset();
    showToast('Noticia agregada con éxito a revisión');
  });

  // --- Filtro por categoría ---
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active-pill', 'bg-primary', 'text-on-primary', 'shadow-sm');
        p.classList.add('bg-surface-container-low', 'text-on-surface-variant');
      });
      pill.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
      pill.classList.add('active-pill', 'bg-primary', 'text-on-primary', 'shadow-sm');

      const category = pill.getAttribute('data-category');
      document.querySelectorAll('.article-card').forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- Buscador ---
  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    document.querySelectorAll('.article-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });

  // --- Botón de favorito en cada tarjeta ---
  // Esta función se vuelve a llamar cada vez que se dibujan las tarjetas
  // (después del fetch), porque antes de eso las tarjetas ni existen en
  // la página todavía.
  function inicializarInteraccionesDeTarjetas() {
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
  }

  cargarNoticias();

});
