---
title: Currently Reading
---
# Currently Reading

<div id="reading-container">
  <div id="loading-message" class="loading-spinner">
    <div class="spinner"></div>
    <p>Loading books from Goodreads...</p>
  </div>
  <div id="error-message" style="display: none;">
    <div class="error-container">
      <i class="fas fa-exclamation-circle"></i>
      <p>Unable to load books from Goodreads. Please try again later or <a href="https://www.goodreads.com/review/list/78282943-dan-katri?shelf=currently-reading" target="_blank">visit Goodreads directly</a>.</p>
    </div>
  </div>
  <div id="books-container" style="display: none;">
    <!-- Books will be inserted here dynamically -->
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const booksContainer = document.getElementById('books-container');
  const loadingMessage = document.getElementById('loading-message');
  const errorMessage = document.getElementById('error-message');

  // Create a proxy URL to avoid CORS issues when fetching from Goodreads
  const goodreadsUrl = 'https://www.goodreads.com/review/list/78282943-dan-katri?shelf=currently-reading';
  const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(goodreadsUrl);

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
      
      // Find the book elements in the Goodreads page
      const bookElements = doc.querySelectorAll('.bookalike, .review');
      
      if (bookElements.length === 0) {
        throw new Error('No books found');
      }
      
      // Create HTML for each book
      bookElements.forEach(bookElement => {
        // Extract book information - try multiple selectors to be resilient to Goodreads HTML structure changes
        const coverImg = bookElement.querySelector('.cover img, .book_cover img, .bookCover img');
        const titleElement = bookElement.querySelector('.title a, .bookTitle, .book_title a');
        const authorElement = bookElement.querySelector('.author a, .authorName a, .bookAuthor a');
        const progressElement = bookElement.querySelector('.shelf-status, .reading-status');
        
        if (coverImg && titleElement && authorElement) {
          const bookUrl = titleElement.href.startsWith('http') ? titleElement.href : `https://www.goodreads.com${titleElement.href}`;
          const title = titleElement.textContent.trim();
          const authorRaw = authorElement.textContent.trim();
          // Transform author from "lastName, firstName" to "firstName lastName"
          const author = authorRaw.includes(',') ? 
            authorRaw.split(',').map(part => part.trim()).reverse().join(' ') : 
            authorRaw;
          const coverSrc = coverImg.src;
          const progress = progressElement ? progressElement.textContent.trim() : '';
          
          // Create book card HTML
          const bookCard = document.createElement('div');
          bookCard.className = 'book-card';
          bookCard.innerHTML = `
            <div class="book-cover">
              <a href="${bookUrl}" target="_blank">
                <img src="${coverSrc}" alt="${title} cover">
              </a>
            </div>
            <div class="book-details">
              <h3 class="book-title">
                <a href="${bookUrl}" target="_blank">${title}</a>
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
      console.error('Error fetching books from Goodreads:', error);
      loadingMessage.style.display = 'none';
      errorMessage.style.display = 'block';
    });
});
</script>

<h1>Read this year</h1>

<div id="read-container">
  <div id="read-loading-message" class="loading-spinner">
    <div class="spinner"></div>
    <p>Loading books from Goodreads...</p>
  </div>
  <div id="read-error-message" style="display: none;">
    <div class="error-container">
      <i class="fas fa-exclamation-circle"></i>
      <p>Unable to load books from Goodreads. Please try again later or <a href="https://www.goodreads.com/review/list/78282943-dan-katri?shelf=read" target="_blank">visit Goodreads directly</a>.</p>
    </div>
  </div>
  <div id="read-books-container" style="display: none;">
    <!-- Books will be inserted here dynamically -->
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const readBooksContainer = document.getElementById('read-books-container');
  const readLoadingMessage = document.getElementById('read-loading-message');
  const readErrorMessage = document.getElementById('read-error-message');

  // Create a proxy URL to avoid CORS issues when fetching from Goodreads
  const readGoodreadsUrl = 'https://www.goodreads.com/review/list/78282943-dan-katri?shelf=read';
  const readProxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(readGoodreadsUrl);

  fetch(readProxyUrl)
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
      
      // Find the book elements in the Goodreads page
      const bookElements = doc.querySelectorAll('.bookalike, .review');
      
      if (bookElements.length === 0) {
        throw new Error('No books found');
      }
      
      // Get current year
      const currentYear = new Date().getFullYear();
      let booksDisplayed = 0;
      
      // Create HTML for each book
      bookElements.forEach(bookElement => {
        // Extract book information - try multiple selectors to be resilient to Goodreads HTML structure changes
        const coverImg = bookElement.querySelector('.cover img, .book_cover img, .bookCover img');
        const titleElement = bookElement.querySelector('.title a, .bookTitle, .book_title a');
        const authorElement = bookElement.querySelector('.author a, .authorName a, .bookAuthor a');
        const dateReadElement = bookElement.querySelector('.date_read_value');
        
        // Only add books read in the current year
        if (coverImg && titleElement && authorElement && dateReadElement) {
          const dateRead = dateReadElement.textContent.trim();
          const readYear = new Date(dateRead).getFullYear();
          
          if (readYear === currentYear) {
            const bookUrl = titleElement.href.startsWith('http') ? titleElement.href : `https://www.goodreads.com${titleElement.href}`;
            const title = titleElement.textContent.trim();
            const authorRaw = authorElement.textContent.trim();
            // Transform author from "lastName, firstName" to "firstName lastName"
            const author = authorRaw.includes(',') ? 
              authorRaw.split(',').map(part => part.trim()).reverse().join(' ') : 
              authorRaw;
            const coverSrc = coverImg.src;
            
            // Create book card HTML
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.innerHTML = `
              <div class="book-cover">
                <a href="${bookUrl}" target="_blank">
                  <img src="${coverSrc}" alt="${title} cover">
                </a>
              </div>
              <div class="book-details">
                <h3 class="book-title">
                  <a href="${bookUrl}" target="_blank">${title}</a>
                </h3>
                <p class="book-author">${author}</p>
                <p class="book-date-read">Read: ${dateRead}</p>
              </div>
            `;
            
            readBooksContainer.appendChild(bookCard);
            booksDisplayed++;
          }
        }
      });
      
      // Show the books container if any books were displayed
      readLoadingMessage.style.display = 'none';
      if (booksDisplayed > 0) {
        readBooksContainer.style.display = 'flex';
      } else {
        readErrorMessage.style.display = 'block';
        readErrorMessage.querySelector('p').textContent = `No books read in ${currentYear} found.`;
      }
    })
    .catch(error => {
      console.error('Error fetching read books from Goodreads:', error);
      readLoadingMessage.style.display = 'none';
      readErrorMessage.style.display = 'block';
    });
});
</script>

<style>
#reading-container, #read-container {
  margin-top: 2rem;
}

#books-container, #read-books-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
  justify-content: flex-start;
}

.book-card {
  width: 100%;
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #fff;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
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

.book-progress, .book-date-read {
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

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #0085A1;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-container {
  padding: 1.5rem;
  border: 1px solid #ffcdd2;
  background-color: #ffebee;
  border-radius: 8px;
  color: #c62828;
  display: flex;
  align-items: center;
  margin: 2rem 0;
}

.error-container i {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.error-container a {
  color: #c62828;
  text-decoration: underline;
}
</style>