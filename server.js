const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// API endpoint to fetch snippets from GitHub
app.get('/api/snippets', async (req, res) => {
  const { query, language } = req.query;
  let url = `https://api.github.com/search/code?q=${query}+in:file`;
  if (language && language !== 'All') {
    url += `+language:${language}`;
  }

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${process.env.API_KEY}`
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch snippets' });
  }
});

// API endpoint to fetch docs from Google Custom Search API
app.get('/api/docs', async (req, res) => {
  const { query } = req.query;
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = '103b56957fcc64424'; // Your Custom Search Engine ID
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}+site:developer.mozilla.org`;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch docs' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
