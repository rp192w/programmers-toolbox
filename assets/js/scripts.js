// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Define references to the tabs in the DOM
  const tabs = {
    news: document.getElementById('news-tab'),
    snippets: document.getElementById('snippets-tab'),
    docs: document.getElementById('docs-tab'),
    favorites: document.getElementById('favorites-tab')
  };

  // Define references to the content sections in the DOM
  const contents = {
    news: document.getElementById('news-content'),
    snippets: document.getElementById('snippets-content'),
    docs: document.getElementById('docs-content'),
    favorites: document.getElementById('favorites-content')
  };

  // Define references to the search buttons in the DOM
  const searchButtons = {
    snippets: document.getElementById('snippet-search-btn'),
    docs: document.getElementById('docs-search-btn')
  };

  // Define references to the result containers in the DOM
  const results = {
    snippets: document.getElementById('snippets-result'),
    news: document.getElementById('news-result'),
    docs: document.getElementById('docs-result'),
    snippetsFavorites: document.getElementById('snippets-favorites'),
    articlesFavorites: document.getElementById('articles-favorites'),
    docsFavorites: document.getElementById('docs-favorites')
  };

  // Define references to the modal elements in the DOM
  const modal = {
    container: document.getElementById('modal'),
    title: document.getElementById('modal-title'),
    body: document.getElementById('modal-body'),
    close: document.getElementById('modal-close')
  };

  // Add click event listeners to each tab
  Object.keys(tabs).forEach(tab => {
    tabs[tab].addEventListener('click', () => switchTab(tab));
  });

  // Add click event listeners to the search buttons
  searchButtons.snippets.addEventListener('click', () => {
    const query = document.getElementById('snippet-search').value;
    const language = document.getElementById('language-select').value;
    fetchSnippets(query, language);
  });
  searchButtons.docs.addEventListener('click', () => fetchDocs(document.getElementById('docs-search').value));

  // Add click event listener to the modal close button
  modal.close.addEventListener('click', () => modal.container.classList.remove('is-active'));

  // Function to switch tabs
  function switchTab(activeTab) {
    // For each tab, toggle the 'is-active' class on the parent element and the 'is-hidden' class on the content
    Object.keys(tabs).forEach(tab => {
      tabs[tab].parentElement.classList.toggle('is-active', tab === activeTab);
      contents[tab].classList.toggle('is-hidden', tab !== activeTab);
    });
    // If the 'news' tab is active, fetch news
    if (activeTab === 'news') fetchNews();
    // If the 'favorites' tab is active, show favorites
    if (activeTab === 'favorites') showFavorites();
  }

  // Function to fetch snippets from the GitHub API
  function fetchSnippets(query, language) {
    let url = `https://api.github.com/search/code?q=${query}+in:file`;
    if (language && language !== 'All') {
      url += `+language:${language}`;
    }
    const token = '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'; // Replace with your actual token

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
      })
      .then(data => {
        console.log('Fetch Snippets Data:', data);
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          updateResults('snippets', data.items, formatGist);
        } else {
          console.error('No data items found in response or data.items is not an array');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  // Function to fetch details of a specific gist from the GitHub API
  function fetchGistDetails(id) {
    fetch(`https://api.github.com/gists/${id}`)
      .then(response => response.json())
      .then(data => {
        // Update the modal with the gist details and show it
        modal.title.innerText = data.description || 'No description';
        modal.body.innerHTML = Object.values(data.files).map(file => `<pre>${file.content}</pre>`).join('');
        modal.container.classList.add('is-active');
      });
  }

  // Function to fetch news from the dev.to API
  function fetchNews() {
    fetch('https://dev.to/api/articles')
      .then(response => response.json())
      .then(data => updateResults('news', data, formatArticle));
  }

  // Function to fetch docs from the Google Custom Search API
  function fetchDocs(query) {
    fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyBee8zSsPxlQcm79apDe1eVEMiwx4AFkNk&cx=103b56957fcc64424&q=${query}+site%3Adeveloper.mozilla.org`)      
      .then(response => response.json())
      .then(data => updateResults('docs', data.items, formatDoc));
  }

  // Function to format a gist for display
  function formatGist(item) {
    const repo = item.repository;
    return `
      <div class="box">
        <h3 class="title is-5">${item.name || 'No name'}</h3>
        <p>Path: ${item.path}</p>
        <p>Repository: <a href="${repo.html_url}" target="_blank">${repo.full_name}</a></p>
        <p>Description: ${repo.description || 'No description'}</p>
        <a href="${item.html_url}" target="_blank" class="button is-small is-link">View File</a>
        <button class="button is-small is-info save-favorite" data-id="${item.html_url}" data-desc="${item.name}" data-type="snippet">Save to Favorites</button>
      </div>
    `;
  }

  // Function to format an article for display
  function formatArticle(article) {
    return `
      <div class="box">
        <h3 class="title is-5">${article.title}</h3>
        <p>${article.description || ''}</p>
        <a href="${article.url}" target="_blank" class="button is-small is-link">Read More</a>
        <button class="button is-small is-info save-favorite" data-id="${article.url}" data-desc="${article.title}" data-type="article">Save to Favorites</button>
      </div>
    `;
  }

  // Function to format a doc for display
  function formatDoc(doc) {
    return `
      <div class="box">
        <h3 class="title is-5">${doc.title}</h3>
        <p>${doc.snippet || ''}</p>
        <a href="${doc.link}" target="_blank" class="button is-small is-link">Read More</a>
        <button class="button is-small is-info save-favorite" data-id="${doc.link}" data-desc="${doc.title}" data-type="doc">Save to Favorites</button>
      </div>
    `;
  }

  // Function to update the results section with the fetched data
  function updateResults(type, data, formatter) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error(`No valid data to display for ${type}`);
      return;
    }
    // Update the results section with the formatted data
    results[type].innerHTML = data.map(formatter).join('');
    // Add click event listeners to the 'view-details' buttons
    document.querySelectorAll('.view-details').forEach(button => {
      button.addEventListener('click', event => fetchGistDetails(event.target.dataset.id));
    });
    // Add click event listeners to the 'save-favorite' buttons
    document.querySelectorAll('.save-favorite').forEach(button => {
      button.addEventListener('click', event => saveFavorite(event.target.dataset.id, event.target.dataset.desc, event.target.dataset.type));
    });
  }

  // Function to save a favorite to local storage
  function saveFavorite(id, description, type) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push({ id, description, type });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Saved to favorites!');
  }

  // Function to show the saved favorites
  function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const snippetsFavoritesList = favorites.filter(fav => fav.type === 'snippet');
    const articlesFavoritesList = favorites.filter(fav => fav.type === 'article');
    const docsFavoritesList = favorites.filter(fav => fav.type === 'doc');

    // Update the favorites sections with the saved favorites
    results.snippetsFavorites.innerHTML = `<h3>Favorite Snippets</h3>${snippetsFavoritesList.length ? snippetsFavoritesList.map(formatFavorite).join('') : '<p>No favorite snippets saved yet.</p>'}`;
    results.articlesFavorites.innerHTML = `<h3>Favorite Articles</h3>${articlesFavoritesList.length ? articlesFavoritesList.map(formatFavorite).join('') : '<p>No favorite articles saved yet.</p>'}`;
    results.docsFavorites.innerHTML = `<h3>Favorite Docs</h3>${docsFavoritesList.length ? docsFavoritesList.map(formatFavorite).join('') : '<p>No favorite docs saved yet.</p>'}`;

    // Add click event listeners to the 'remove-favorite' buttons
    document.querySelectorAll('.remove-favorite').forEach(button => {
      button.addEventListener('click', event => removeFavorite(event.target.dataset.index));
    });
  }

  // Function to format a favorite for display
  function formatFavorite(fav, index) {
    return `
      <div class="box">
        <h3 class="title is-5">${fav.description}</h3>
        <a href="${fav.id}" target="_blank" class="button is-small is-link">Read More</a>
        <button class="button is-small is-danger remove-favorite" data-index="${index}">Remove from Favorites</button>
      </div>
    `;
  }

  // Function to remove a favorite from local storage
  function removeFavorite(index) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites();
  }

  // Initially activate the 'news' tab
  switchTab('news');
});
