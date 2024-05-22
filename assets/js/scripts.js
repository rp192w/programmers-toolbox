document.addEventListener('DOMContentLoaded', () => {
  // Get references to the tabs and their content
  const snippetsTab = document.getElementById('snippets-tab');
  const newsTab = document.getElementById('news-tab');
  const docsTab = document.getElementById('docs-tab');
  const favoritesTab = document.getElementById('favorites-tab');
  const snippetsContent = document.getElementById('snippets-content');
  const newsContent = document.getElementById('news-content');
  const docsContent = document.getElementById('docs-content');
  const favoritesContent = document.getElementById('favorites-content');

  // Get references to the search buttons and result containers
  const snippetSearchBtn = document.getElementById('snippet-search-btn');
  const docsSearchBtn = document.getElementById('docs-search-btn');
  const snippetsResult = document.getElementById('snippets-result');
  const newsResult = document.getElementById('news-result');
  const docsResult = document.getElementById('docs-result');
  const favoritesResult = document.getElementById('favorites-result');

  // Get references to the modal elements
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  // Add event listeners to the tabs to switch content
  snippetsTab.addEventListener('click', () => {
    snippetsTab.parentElement.classList.add('is-active');
    newsTab.parentElement.classList.remove('is-active');
    docsTab.parentElement.classList.remove('is-active');
    favoritesTab.parentElement.classList.remove('is-active');
    snippetsContent.classList.remove('is-hidden');
    newsContent.classList.add('is-hidden');
    docsContent.classList.add('is-hidden');
    favoritesContent.classList.add('is-hidden');
  });

  newsTab.addEventListener('click', () => {
    newsTab.parentElement.classList.add('is-active');
    snippetsTab.parentElement.classList.remove('is-active');
    docsTab.parentElement.classList.remove('is-active');
    favoritesTab.parentElement.classList.remove('is-active');
    newsContent.classList.remove('is-hidden');
    snippetsContent.classList.add('is-hidden');
    docsContent.classList.add('is-hidden');
    favoritesContent.classList.add('is-hidden');
    fetchNews();
  });

  docsTab.addEventListener('click', () => {
    docsTab.parentElement.classList.add('is-active');
    snippetsTab.parentElement.classList.remove('is-active');
    newsTab.parentElement.classList.remove('is-active');
    favoritesTab.parentElement.classList.remove('is-active');
    docsContent.classList.remove('is-hidden');
    snippetsContent.classList.add('is-hidden');
    newsContent.classList.add('is-hidden');
    favoritesContent.classList.add('is-hidden');
  });

  favoritesTab.addEventListener('click', () => {
    favoritesTab.parentElement.classList.add('is-active');
    snippetsTab.parentElement.classList.remove('is-active');
    newsTab.parentElement.classList.remove('is-active');
    docsTab.parentElement.classList.remove('is-active');
    favoritesContent.classList.remove('is-hidden');
    snippetsContent.classList.add('is-hidden');
    newsContent.classList.add('is-hidden');
    docsContent.classList.add('is-hidden');
    showFavorites();
  });

  snippetSearchBtn.addEventListener('click', () => {
    const query = document.getElementById('snippet-search').value;
    fetchSnippets(query);
  });

  docsSearchBtn.addEventListener('click', () => {
    const query = document.getElementById('docs-search').value;
    fetchDocs(query);
  });

  modalClose.addEventListener('click', () => {
    modal.classList.remove('is-active');
  });

  function fetchSnippets(query) {
    fetch(`https://api.github.com/gists/public?q=${query}`)
      .then(response => response.json())
      .then(data => {
        snippetsResult.innerHTML = '';
        data.forEach(gist => {
          const gistElement = document.createElement('div');
          gistElement.className = 'box';
          gistElement.innerHTML = `
            <h3 class="title is-5">${gist.description || 'No description'}</h3>
            <button class="button is-small is-link view-details" data-id="${gist.id}">View Details</button>
            <button class="button is-small is-info save-favorite" data-id="${gist.id}" data-desc="${gist.description || 'No description'}">Save to Favorites</button>
          `;
          snippetsResult.appendChild(gistElement);
        });

        document.querySelectorAll('.view-details').forEach(button => {
          button.addEventListener('click', (event) => {
            const gistId = event.target.getAttribute('data-id');
            fetchGistDetails(gistId);
          });
        });

        document.querySelectorAll('.save-favorite').forEach(button => {
          button.addEventListener('click', (event) => {
            const gistId = event.target.getAttribute('data-id');
            const gistDesc = event.target.getAttribute('data-desc');
            saveFavorite(gistId, gistDesc);
          });
        });
      });
  }

  function fetchGistDetails(id) {
    fetch(`https://api.github.com/gists/${id}`)
      .then(response => response.json())
      .then(data => {
        modalTitle.innerText = data.description || 'No description';
        modalBody.innerHTML = '';
        for (let file in data.files) {
          const fileContent = data.files[file].content;
          const fileElement = document.createElement('pre');
          fileElement.innerText = fileContent;
          modalBody.appendChild(fileElement);
        }
        modal.classList.add('is-active');
      });
  }

  function saveFavorite(id, description) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push({ id, description });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Saved to favorites!');
  }

  function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesResult.innerHTML = '';
    if (favorites.length === 0) {
      favoritesResult.innerHTML = '<p>No favorites saved yet.</p>';
    } else {
      favorites.forEach(fav => {
        const favElement = document.createElement('div');
        favElement.className = 'box';
        favElement.innerHTML = `
          <h3 class="title is-5">${fav.description}</h3>
          <button class="button is-small is-link view-details" data-id="${fav.id}">View Details</button>
          
        `;
        favoritesResult.appendChild(favElement);
      });

      document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', (event) => {
          const gistId = event.target.getAttribute('data-id');
          fetchGistDetails(gistId);
        });
      });
    }
    favoritesResult.classList.remove('is-hidden');
    snippetsResult.classList.add('is-hidden');
  }

  function fetchNews() {
    fetch('https://dev.to/api/articles')
      .then(response => response.json())
      .then(data => {
        newsResult.innerHTML = '';
        data.forEach(article => {
          const articleElement = document.createElement('div');
          articleElement.className = 'box';
          articleElement.innerHTML = `
            <h3 class="title is-5">${article.title}</h3>
            <p>${article.description || ''}</p>
            <a href="${article.url}" target="_blank" class="button is-small is-link">Read More</a>
          `;
          newsResult.appendChild(articleElement);
        });
      });
  }

  function fetchDocs(query) {
    fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyBee8zSsPxlQcm79apDe1eVEMiwx4AFkNk&cx=103b56957fcc64424&q=${query}+site%3Adeveloper.mozilla.org`)
      .then(response => response.json())
      .then(data => {
        docsResult.innerHTML = '';
        data.items.forEach(doc => {
          const docElement = document.createElement('div');
          docElement.className = 'box';
          docElement.innerHTML = `
            <h3 class="title is-5">${doc.title}</h3>
            <p>${doc.snippet || ''}</p>
            <a href="${doc.link}" target="_blank" class="button is-small is-link">Read More</a>
          `;
          docsResult.appendChild(docElement);
        });
      });
  }
});