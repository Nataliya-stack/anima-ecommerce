// src/scripts/searchPage.js

export function initSearchPage() {
  const input = document.getElementById('search-input');
  const clearInputBtn = document.getElementById('clear-input-btn');
  const recentTagsList = document.getElementById('recent-tags-list');
  const clearAllBtn = document.getElementById('clear-all-recent');

  const STORAGE_KEY = 'anima_recent_searches';

  // Получаем текущие параметры из URL прямо в браузере
  const urlParams = new URLSearchParams(window.location.search);
  const currentSearchTerm = urlParams.get('q')?.trim() || '';

  if (input) {
    input.value = '';
  }

  // Сохраняем поисковый запрос в localStorage, если он есть
  if (currentSearchTerm) {
    let searches = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    searches = [currentSearchTerm, ...searches.filter(s => s.toLowerCase() !== currentSearchTerm.toLowerCase())];
    searches = searches.slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  }

  function renderRecentSearches() {
    if (!recentTagsList) return;

    const searches = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    recentTagsList.innerHTML = '';

    if (searches.length === 0) {
      recentTagsList.innerHTML = '<span class="text-neutral-400 italic font-light">No hay búsquedas recientes</span>';
      if (clearAllBtn) clearAllBtn.style.display = 'none';
      return;
    }

    if (clearAllBtn) clearAllBtn.style.display = 'inline';

    searches.forEach(term => {
      const tag = document.createElement('div');
      tag.className = 'inline-flex items-center gap-2 bg-neutral-100 px-3 py-1 text-neutral-800';
      
      const link = document.createElement('a');
      link.href = `/search?q=${encodeURIComponent(term)}`;
      link.textContent = term;
      link.className = 'hover:underline';

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = '✕';
      removeBtn.className = 'text-neutral-400 hover:text-black font-bold ml-1 cursor-pointer';
      
      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let currentSearches = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        currentSearches = currentSearches.filter(s => s !== term);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSearches));
        
        renderRecentSearches();

        if (currentSearchTerm && currentSearchTerm.toLowerCase() === term.toLowerCase()) {
          window.location.href = '/search';
        }
      });

      tag.appendChild(link);
      tag.appendChild(removeBtn);
      recentTagsList.appendChild(tag);
    });
  }

  renderRecentSearches();

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      renderRecentSearches();
      window.location.href = '/search';
    });
  }

  if (clearInputBtn) {
    clearInputBtn.addEventListener('click', () => {
      window.location.href = '/search';
    });
  }
}

// Автоматически запускаем инициализацию
initSearchPage();