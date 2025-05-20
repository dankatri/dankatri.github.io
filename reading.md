---
---
# Currently Reading

<div id="reading-container">
  <div id="loading-message">Loading books from StoryGraph...</div>
  <div id="error-message" style="display: none; color: red;">Unable to load books. Please try again later.</div>
  <div id="books-container" style="display: none;">
    <!-- Books will be inserted here dynamically -->
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const booksContainer = document.getElementById('books-container');
  const loadingMessage = document.getElementById('loading-message');
  const errorMessage = document.getElementById('error-message');

  // Create a proxy URL to avoid CORS issues
  const storygraphUrl = 'https://app.thestorygraph.com/currently-reading/dkatri';
  const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(storygraphUrl);

  fetch(proxyUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(html => {
      // Parse the HTML string
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Find the book elements in the StoryGraph page
      const bookElements = doc.querySelectorAll('.book-pane-container');
      
      if (bookElements.length === 0) {
        throw new Error('No books found');
      }
      
      // Create HTML for each book
      bookElements.forEach(bookElement => {
        // Extract book information
        const coverImg = bookElement.querySelector('.book-cover img');
        const titleElement = bookElement.querySelector('.book-title-author-and-series a');
        const authorElement = bookElement.querySelector('.book-title-author-and-series span:nth-child(3)');
        const progressElement = bookElement.querySelector('.currently-reading-progress');
        
        if (coverImg && titleElement && authorElement) {
          const bookUrl = titleElement.href;
          const title = titleElement.textContent.trim();
          const author = authorElement.textContent.trim();
          const coverSrc = coverImg.src;
          const progress = progressElement ? progressElement.textContent.trim() : '';
          
          // Create book card HTML
          const bookCard = document.createElement('div');
          bookCard.className = 'book-card';
          bookCard.innerHTML = `
            <div class="book-cover">
              <a href="https://app.thestorygraph.com${bookUrl}" target="_blank">
                <img src="${coverSrc}" alt="${title} cover">
              </a>
            </div>
            <div class="book-details">
              <h3 class="book-title">
                <a href="https://app.thestorygraph.com${bookUrl}" target="_blank">${title}</a>
              </h3>
              <p class="book-author">${author}</p>
              ${progress ? `<p class="book-progress">${progress}</p>` : ''}
            </div>
          `;
          
          booksContainer.appendChild(bookCard);
        }
      });
      
      // Show the books container
      loadingMessage.style.display = 'none';
      booksContainer.style.display = 'flex';
    })
    .catch(error => {
      console.error('Error fetching books:', error);
      loadingMessage.style.display = 'none';
      errorMessage.style.display = 'block';
    });
});
</script>

<style>
#reading-container {
  margin-top: 2rem;
}

#books-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
}

.book-card {
  width: 100%;
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.book-cover {
  text-align: center;
  margin-bottom: 1rem;
}

.book-cover img {
  max-width: 150px;
  max-height: 225px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.book-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.book-title {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.book-author {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-style: italic;
  color: #666;
}

.book-progress {
  margin-top: auto;
  font-weight: bold;
  color: #0085A1;
}

@media (max-width: 768px) {
  #books-container {
    justify-content: center;
  }
  
  .book-card {
    max-width: 100%;
  }
}
</style>