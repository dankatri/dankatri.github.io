---
title: Currently Reading
---
# Currently Reading

<div id="reading-container">
  <div id="loading-message" class="loading-spinner">
    <div class="spinner"></div>
    <p>Loading books from Goodreads and StoryGraph...</p>
  </div>
  <div id="error-message" style="display: none;">
    <div class="error-container">
      <i class="fas fa-exclamation-circle"></i>
      <p>Unable to load books. Please try again later.</p>
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

  let goodreadsLoaded = false;
  let storyGraphLoaded = false;

  function checkIfAllLoaded() {
    if (goodreadsLoaded && storyGraphLoaded) {
      loadingMessage.style.display = 'none';
      if (booksContainer.children.length > 0) {
        booksContainer.style.display = 'flex';
      } else {
        errorMessage.style.display = 'block';
      }
    }
  }

  function createBookCard(book, source) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';

    const sourceClass = source === 'goodreads' ? 'source-goodreads' : 'source-storygraph';
    const sourceLabel = source === 'goodreads' ? 'Goodreads' : 'StoryGraph';

    bookCard.innerHTML = `
      <div class="book-source-badge ${sourceClass}">${sourceLabel}</div>
      <div class="book-cover">
        <a href="${book.url}" target="_blank">
          <img src="${book.coverUrl}" alt="${book.title} cover">
        </a>
      </div>
      <div class="book-details">
        <h3 class="book-title">
          <a href="${book.url}" target="_blank">${book.title}</a>
        </h3>
        <p class="book-author">${book.author}</p>
        ${book.progress ? `<p class="book-progress">${book.progress}</p>` : ''}
      </div>
    `;

    return bookCard;
  }

  // Load StoryGraph books from local data
  fetch('{{ site.baseurl }}/assets/data/storygraph.json')
    .then(response => response.json())
    .then(data => {
      if (data.currently_reading && data.currently_reading.length > 0) {
        data.currently_reading.forEach(book => {
          const bookData = {
            title: book.title,
            author: book.author,
            coverUrl: book.coverUrl,
            url: book.storyGraphUrl || '#',
            progress: book.progress
          };
          const bookCard = createBookCard(bookData, 'storygraph');
          booksContainer.appendChild(bookCard);
        });
      }
      storyGraphLoaded = true;
      checkIfAllLoaded();
    })
    .catch(error => {
      console.log('StoryGraph data not available:', error);
      storyGraphLoaded = true;
      checkIfAllLoaded();
    });

  // Load Goodreads books
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
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const bookElements = doc.querySelectorAll('.bookalike, .review');

      bookElements.forEach(bookElement => {
        const coverImg = bookElement.querySelector('.cover img, .book_cover img, .bookCover img');
        const titleElement = bookElement.querySelector('.title a, .bookTitle, .book_title a');
        const authorElement = bookElement.querySelector('.author a, .authorName a, .bookAuthor a');
        const progressElement = bookElement.querySelector('.shelf-status, .reading-status');

        if (coverImg && titleElement && authorElement) {
          const bookUrl = titleElement.href.startsWith('http') ? titleElement.href : `https://www.goodreads.com${titleElement.href}`;
          const title = titleElement.textContent.trim();
          const authorRaw = authorElement.textContent.trim();
          const author = authorRaw.includes(',') ?
            authorRaw.split(',').map(part => part.trim()).reverse().join(' ') :
            authorRaw;
          const coverSrc = coverImg.src;
          const progress = progressElement ? progressElement.textContent.trim() : '';

          const bookData = {
            title: title,
            author: author,
            coverUrl: coverSrc,
            url: bookUrl,
            progress: progress
          };

          const bookCard = createBookCard(bookData, 'goodreads');
          booksContainer.appendChild(bookCard);
        }
      });

      goodreadsLoaded = true;
      checkIfAllLoaded();
    })
    .catch(error => {
      console.error('Error fetching books from Goodreads:', error);
      goodreadsLoaded = true;
      checkIfAllLoaded();
    });
});
</script>

<h1>Read this year</h1>

<div id="read-container">
  <div id="read-loading-message" class="loading-spinner">
    <div class="spinner"></div>
    <p>Loading books from Goodreads and StoryGraph...</p>
  </div>
  <div id="read-error-message" style="display: none;">
    <div class="error-container">
      <i class="fas fa-exclamation-circle"></i>
      <p>Unable to load books. Please try again later.</p>
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

  let goodreadsReadLoaded = false;
  let storyGraphReadLoaded = false;

  function checkIfAllReadLoaded() {
    if (goodreadsReadLoaded && storyGraphReadLoaded) {
      readLoadingMessage.style.display = 'none';
      if (readBooksContainer.children.length > 0) {
        readBooksContainer.style.display = 'flex';
      } else {
        readErrorMessage.style.display = 'block';
        readErrorMessage.querySelector('p').textContent = `No books read in ${new Date().getFullYear()} found.`;
      }
    }
  }

  function createReadBookCard(book, source) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';

    const sourceClass = source === 'goodreads' ? 'source-goodreads' : 'source-storygraph';
    const sourceLabel = source === 'goodreads' ? 'Goodreads' : 'StoryGraph';

    bookCard.innerHTML = `
      <div class="book-source-badge ${sourceClass}">${sourceLabel}</div>
      <div class="book-cover">
        <a href="${book.url}" target="_blank">
          <img src="${book.coverUrl}" alt="${book.title} cover">
        </a>
      </div>
      <div class="book-details">
        <h3 class="book-title">
          <a href="${book.url}" target="_blank">${book.title}</a>
        </h3>
        <p class="book-author">${book.author}</p>
        ${book.dateRead ? `<p class="book-date-read">Read: ${book.dateRead}</p>` : ''}
        ${book.rating ? `<p class="book-rating">${'⭐'.repeat(book.rating)}</p>` : ''}
      </div>
    `;

    return bookCard;
  }

  // Load StoryGraph read books from local data
  fetch('{{ site.baseurl }}/assets/data/storygraph.json')
    .then(response => response.json())
    .then(data => {
      const currentYear = new Date().getFullYear();

      if (data.read && data.read.length > 0) {
        data.read.forEach(book => {
          // Filter by current year if dateRead is available
          if (book.dateRead) {
            const readYear = new Date(book.dateRead).getFullYear();
            if (readYear === currentYear) {
              const bookData = {
                title: book.title,
                author: book.author,
                coverUrl: book.coverUrl,
                url: book.storyGraphUrl || '#',
                dateRead: book.dateRead,
                rating: book.rating
              };
              const bookCard = createReadBookCard(bookData, 'storygraph');
              readBooksContainer.appendChild(bookCard);
            }
          }
        });
      }
      storyGraphReadLoaded = true;
      checkIfAllReadLoaded();
    })
    .catch(error => {
      console.log('StoryGraph data not available:', error);
      storyGraphReadLoaded = true;
      checkIfAllReadLoaded();
    });

  // Load Goodreads read books
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
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const bookElements = doc.querySelectorAll('.bookalike, .review');
      const currentYear = new Date().getFullYear();

      bookElements.forEach(bookElement => {
        const coverImg = bookElement.querySelector('.cover img, .book_cover img, .bookCover img');
        const titleElement = bookElement.querySelector('.title a, .bookTitle, .book_title a');
        const authorElement = bookElement.querySelector('.author a, .authorName a, .bookAuthor a');
        const dateReadElement = bookElement.querySelector('.date_read_value');

        if (coverImg && titleElement && authorElement && dateReadElement) {
          const dateRead = dateReadElement.textContent.trim();
          const readYear = new Date(dateRead).getFullYear();

          if (readYear === currentYear) {
            const bookUrl = titleElement.href.startsWith('http') ? titleElement.href : `https://www.goodreads.com${titleElement.href}`;
            const title = titleElement.textContent.trim();
            const authorRaw = authorElement.textContent.trim();
            const author = authorRaw.includes(',') ?
              authorRaw.split(',').map(part => part.trim()).reverse().join(' ') :
              authorRaw;
            const coverSrc = coverImg.src;

            const bookData = {
              title: title,
              author: author,
              coverUrl: coverSrc,
              url: bookUrl,
              dateRead: dateRead
            };

            const bookCard = createReadBookCard(bookData, 'goodreads');
            readBooksContainer.appendChild(bookCard);
          }
        }
      });

      goodreadsReadLoaded = true;
      checkIfAllReadLoaded();
    })
    .catch(error => {
      console.error('Error fetching read books from Goodreads:', error);
      goodreadsReadLoaded = true;
      checkIfAllReadLoaded();
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
  position: relative;
}

body.dark-mode .book-card {
  background-color: #2d2d2d;
  border-color: #444;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

body.dark-mode .book-card:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.4);
}

.book-source-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.source-goodreads {
  background-color: #F4F1EA;
  color: #382110;
  border: 1px solid #D8D0C1;
}

body.dark-mode .source-goodreads {
  background-color: #4a3929;
  color: #f4f1ea;
  border: 1px solid #5a4939;
}

.source-storygraph {
  background-color: #E8F5F7;
  color: #0B4F5F;
  border: 1px solid #B8D8DD;
}

body.dark-mode .source-storygraph {
  background-color: #1a4450;
  color: #a8d5dd;
  border: 1px solid #2a5460;
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

body.dark-mode .book-cover img {
  box-shadow: 0 4px 8px rgba(0,0,0,0.5);
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

body.dark-mode .book-author {
  color: #bbb;
}

.book-progress, .book-date-read {
  margin-top: auto;
  font-weight: bold;
  color: #0085A1;
}

.book-rating {
  margin-top: 0.25rem;
  font-size: 1rem;
}

body.dark-mode .book-progress,
body.dark-mode .book-date-read {
  color: #5CB4D0;
}

@media (max-width: 768px) {
  #books-container, #read-books-container {
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
