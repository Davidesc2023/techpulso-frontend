/*
  TechPulso - favoritos.js
  Lógica de la vista de Favoritos (favoritos.html).

  Importante: esta vista, tal como la generamos en el diseño, es una
  DEMOSTRACIÓN visual de cómo se comporta la lista de favoritos (por eso
  hay botones para "ver vista vacía" o "reiniciar demo"). Todavía no lee
  ni escribe en localStorage de verdad; eso es justo lo que falta conectar
  para que la funcionalidad sea real y no solo una simulación.

  Lo que sí hace ahora:
  - Cambia entre la vista "con artículos guardados" y la vista "vacía".
  - Permite quitar una tarjeta de la lista (con una animación de salida).
  - Actualiza el contador y el texto de estado según cuántas tarjetas queden.
*/

(function () {
  let count = 3;

  const activeSection = document.getElementById('active-favorites-section');
  const emptySection = document.getElementById('empty-state-section');
  const btnShowActive = document.getElementById('btn-show-active');
  const btnShowEmpty = document.getElementById('btn-show-empty');
  const btnReturnToList = document.getElementById('btn-return-to-list');
  const btnResetDemo = document.getElementById('btn-reset-demo');
  const counterBadge = document.getElementById('items-counter-badge');
  const statusText = document.getElementById('header-status-text');

  // Actualiza el número de artículos guardados y el texto de arriba
  // ("Tienes 3 artículos...", "Tienes 1 artículo...", etc.)
  function updateCounter() {
    if (counterBadge) {
      counterBadge.innerHTML = count + ' <span class="font-label-md text-label-md text-on-surface-variant font-normal">artículos</span>';
    }
    if (statusText) {
      if (count === 0) {
        statusText.textContent = "No tienes artículos en tu lista de favoritos";
      } else if (count === 1) {
        statusText.textContent = "Tienes 1 artículo en tu lista de favoritos";
      } else {
        statusText.textContent = "Tienes " + count + " artículos en tu lista de favoritos";
      }
    }
    // Si ya quitamos alguna tarjeta, mostramos el botón para reiniciar la demo
    if (count < 3 && btnResetDemo) {
      btnResetDemo.classList.remove('hidden');
    }
    if (count === 0) {
      showEmptyView();
    }
  }

  function showActiveView() {
    activeSection.classList.remove('hidden');
    emptySection.classList.add('hidden');
    btnShowActive.className = "flex items-center gap-1.5 px-4 py-2 rounded-md font-label-md text-label-md bg-surface-container-lowest text-primary font-bold shadow-sm transition-all";
    btnShowEmpty.className = "flex items-center gap-1.5 px-4 py-2 rounded-md font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all";
  }

  function showEmptyView() {
    activeSection.classList.add('hidden');
    emptySection.classList.remove('hidden');
    btnShowEmpty.className = "flex items-center gap-1.5 px-4 py-2 rounded-md font-label-md text-label-md bg-surface-container-lowest text-primary font-bold shadow-sm transition-all";
    btnShowActive.className = "flex items-center gap-1.5 px-4 py-2 rounded-md font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all";
  }

  // Esta función queda en window (global) porque el botón "Quitar" de cada
  // tarjeta la llama directo desde el HTML con onclick="removeFavorite('fav-card-1')".
  // La dejamos así, tal como la generó la maquetación, para no tener que
  // reescribir esos botones ahora.
  window.removeFavorite = function (cardId) {
    const card = document.getElementById(cardId);
    if (card) {
      card.style.transition = "all 0.3s ease-out";
      card.style.opacity = "0";
      card.style.transform = "scale(0.95)";
      setTimeout(function () {
        card.style.display = "none";
        count = Math.max(0, count - 1);
        updateCounter();
      }, 300);
    }
  };

  if (btnShowActive) btnShowActive.addEventListener('click', showActiveView);
  if (btnShowEmpty) btnShowEmpty.addEventListener('click', showEmptyView);
  if (btnReturnToList) btnReturnToList.addEventListener('click', function () {
    resetCards();
    showActiveView();
  });

  // Vuelve a poner las 3 tarjetas de ejemplo visibles, para poder repetir
  // la demo sin tener que recargar la página.
  function resetCards() {
    count = 3;
    ['fav-card-1', 'fav-card-2', 'fav-card-3'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = "flex";
        el.style.opacity = "1";
        el.style.transform = "scale(1)";
      }
    });
    if (btnResetDemo) btnResetDemo.classList.add('hidden');
    updateCounter();
  }

  if (btnResetDemo) {
    btnResetDemo.addEventListener('click', function () {
      resetCards();
    });
  }
})();
