# StoryGraph Integration

This site now displays reading progress from both Goodreads and StoryGraph!

## Overview

The reading page (`/reading`) shows:
- **Currently Reading** books from both Goodreads and StoryGraph
- **Read This Year** books from both sources

Each book card displays a badge showing its source (Goodreads or StoryGraph).

## How It Works

### Goodreads Integration
- Fetches data directly from Goodreads at page load (client-side)
- Uses a CORS proxy to bypass browser restrictions
- Real-time data every time the page loads

### StoryGraph Integration
- Fetches data from a local JSON file (`assets/data/storygraph.json`)
- Updated manually by running a Python sync script
- Faster and more reliable than real-time scraping

## Syncing StoryGraph Data

### Prerequisites

1. **Python 3.6+** installed
2. **pip** package manager

### Installation

```bash
# Install required Python packages
pip install -r requirements.txt
```

### Getting Your StoryGraph Token

1. Go to [https://app.thestorygraph.com/](https://app.thestorygraph.com/)
2. Log in to your account
3. Open browser Developer Tools (F12 or right-click → Inspect)
4. Go to the **Application** tab (Chrome) or **Storage** tab (Firefox)
5. Navigate to **Cookies** → `https://app.thestorygraph.com`
6. Find the cookie named `remember_user_token`
7. Copy its **Value**

### Running the Sync Script

```bash
python scripts/sync_storygraph.py --username YOUR_STORYGRAPH_USERNAME --token YOUR_TOKEN
```

**Example:**
```bash
python scripts/sync_storygraph.py --username dankatri --token "abc123xyz456..."
```

This will:
1. Fetch your currently reading books
2. Fetch your read books
3. Fetch your to-read list
4. Save everything to `_data/storygraph.json` and `assets/data/storygraph.json`

### Automation Options

#### Option 1: Manual Updates
Run the script whenever you want to update your reading data:
```bash
python scripts/sync_storygraph.py --username dankatri --token "YOUR_TOKEN"
git add _data/storygraph.json assets/data/storygraph.json
git commit -m "Update StoryGraph reading data"
git push
```

#### Option 2: GitHub Actions (Coming Soon)
Set up automated weekly syncs using GitHub Actions:
- Store your StoryGraph token as a GitHub secret
- Schedule automatic runs (e.g., every Sunday)
- Auto-commit updated data

## File Structure

```
.
├── scripts/
│   └── sync_storygraph.py          # Python script to fetch StoryGraph data
├── _data/
│   └── storygraph.json            # StoryGraph data (for Jekyll builds)
├── assets/
│   └── data/
│       └── storygraph.json        # StoryGraph data (served to clients)
├── reading.md                      # Reading page with dual integration
├── requirements.txt                # Python dependencies
└── README_STORYGRAPH.md           # This file
```

## Data Format

The `storygraph.json` file contains:

```json
{
  "currently_reading": [
    {
      "title": "Book Title",
      "author": "Author Name",
      "coverUrl": "https://...",
      "storyGraphUrl": "https://app.thestorygraph.com/books/...",
      "progress": "Page 150 of 300",
      "rating": null,
      "dateRead": null,
      "dateAdded": "2025-01-15"
    }
  ],
  "read": [
    {
      "title": "Book Title",
      "author": "Author Name",
      "coverUrl": "https://...",
      "storyGraphUrl": "https://app.thestorygraph.com/books/...",
      "progress": "",
      "rating": 5,
      "dateRead": "2025-01-20",
      "dateAdded": "2025-01-10"
    }
  ],
  "to_read": [...],
  "last_updated": "2025-01-21T10:30:00"
}
```

## Styling

Book cards include source badges:
- **Goodreads**: Tan/beige badge
- **StoryGraph**: Light blue badge

Dark mode is fully supported for all elements.

## Troubleshooting

### Script fails with "storygraph-api package not found"
```bash
pip install storygraph-api
```

### "Error fetching data" message
- Check that your token is correct and not expired
- Verify your StoryGraph username is correct
- Try logging out and back into StoryGraph to get a fresh token

### Books not showing on the site
- Make sure you ran the sync script
- Check that `assets/data/storygraph.json` exists and contains data
- Commit and push the changes to GitHub
- Wait a few minutes for GitHub Pages to rebuild

### Token expired
StoryGraph tokens can expire. If syncing stops working:
1. Get a fresh token from your browser (see "Getting Your StoryGraph Token")
2. Run the sync script again with the new token

## Privacy Note

The `remember_user_token` is sensitive. Never commit it to your repository or share it publicly. Consider using:
- Environment variables
- GitHub Secrets (for automated workflows)
- A local `.env` file (add to `.gitignore`)

## Credits

- Uses the unofficial [storygraph-api](https://pypi.org/project/storygraph-api/) Python package
- Goodreads integration via CORS proxy (allorigins.win)
- Jekyll static site generator with Beautiful Jekyll theme
