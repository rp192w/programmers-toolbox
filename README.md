# Programmer's Toolbox Application

## Link to Deployed App

[Programmer's Toolbox](https://rp192w.github.io/programmers-toolbox/)

## Overview

This repository hosts the code for the Programmer's Toolbox application, a versatile tool designed for developers. The app includes the following features:

- **Tech News Feed:** Provides the latest tech news using the dev.to API.
- **Code Snippet Search:** Allows users to search for code snippets from GitHub Gists.
- **Documentation Search:** Enables users to search for documentation from MDN Web Docs.
- **Favorites:** Users can save their favorite articles, code snippets, and documents for easy access.

## File Structure

### HTML Files

- **index.html**: The main page that displays the Programmer's Toolbox with various tabs for tech news, code snippets, documentation search, and favorites.

### CSS Files

- **assets/css/styles.css**: General styles for the Programmer's Toolbox application, including styles for tabs, content sections, and modals.

### JavaScript Files

- **assets/js/scripts.js**: Contains JavaScript code for handling tab navigation, fetching data from APIs (dev.to, GitHub Gists, MDN Web Docs), managing localStorage for favorites, and displaying content dynamically.

## Setup and Running

To run the application, go to the provided URL or clone the repo and open `index.html` in a web browser. Ensure your browser supports localStorage, which is required to save favorites.

## Features

### Tech News Feed

- Displays the latest tech news articles from the dev.to API.
- Users can read more by clicking on article links or save articles to favorites.

### Code Snippet Search

- Allows users to search for code snippets using keywords and language filters.
- Fetches public gists from GitHub and displays matching snippets.
- Users can view detailed gist content and save snippets to favorites.

### Documentation Search

- Enables users to search for documentation on MDN Web Docs using the Google Custom Search API.
- Displays search results with links to relevant documentation.
- Users can save documentation links to favorites.

### Favorites

- Users can view and manage their saved articles, code snippets, and documentation links.
- Saved items are stored in localStorage for persistence across sessions.

## Known Issues

- **API Rate Limits:** The application may encounter rate limits from the APIs (dev.to, GitHub, Google Custom Search) if used excessively.
- **LocalStorage:** Favorites will not persist if localStorage is disabled in your browser. Check your browser settings if items are not saving.

## Screenshots

![Programmer's Toolbox Screenshot](./assets/images/screenshot.png)

---

Feel free to customize further based on your specific requirements!
