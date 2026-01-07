#!/usr/bin/env python3
"""
Sync reading data from StoryGraph to Jekyll _data directory.

This script fetches your currently reading and read books from StoryGraph
and stores them as JSON files for use in your Jekyll site.

Usage:
    python scripts/sync_storygraph.py --username YOUR_USERNAME --token YOUR_TOKEN

To get your token:
1. Go to https://app.thestorygraph.com/
2. Log in
3. Open browser Dev Tools (F12)
4. Go to Application > Cookies > https://app.thestorygraph.com
5. Copy the value of 'remember_user_token'
"""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path

try:
    from storygraph_api import StoryGraphAPI
except ImportError:
    print("Error: storygraph-api package not found.")
    print("Install it with: pip install storygraph-api")
    sys.exit(1)


def format_book_data(book):
    """Format book data for Jekyll consumption."""
    return {
        'title': book.get('title', 'Unknown Title'),
        'author': book.get('author', 'Unknown Author'),
        'coverUrl': book.get('cover_url', ''),
        'storyGraphUrl': book.get('url', ''),
        'progress': book.get('progress', ''),
        'rating': book.get('rating'),
        'dateRead': book.get('date_read', ''),
        'dateAdded': book.get('date_added', ''),
    }


def fetch_storygraph_data(username, token):
    """Fetch reading data from StoryGraph."""
    print(f"Fetching StoryGraph data for user: {username}")

    api = StoryGraphAPI(remember_user_token=token)

    data = {
        'currently_reading': [],
        'read': [],
        'to_read': [],
        'last_updated': datetime.now().isoformat()
    }

    try:
        # Fetch currently reading
        print("Fetching currently reading books...")
        currently_reading = api.get_currently_reading(username)
        if currently_reading:
            data['currently_reading'] = [format_book_data(book) for book in currently_reading]
            print(f"  Found {len(data['currently_reading'])} currently reading books")

        # Fetch read books
        print("Fetching read books...")
        read_books = api.get_read_books(username)
        if read_books:
            data['read'] = [format_book_data(book) for book in read_books]
            print(f"  Found {len(data['read'])} read books")

        # Fetch to-read books
        print("Fetching to-read books...")
        to_read = api.get_to_read(username)
        if to_read:
            data['to_read'] = [format_book_data(book) for book in to_read]
            print(f"  Found {len(data['to_read'])} to-read books")

    except Exception as e:
        print(f"Error fetching data: {e}")
        raise

    return data


def save_data(data, output_dir):
    """Save data to JSON files in the _data directory."""
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Save complete data
    output_file = output_path / 'storygraph.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nData saved to {output_file}")
    print(f"Last updated: {data['last_updated']}")


def main():
    parser = argparse.ArgumentParser(
        description='Sync StoryGraph reading data to Jekyll site'
    )
    parser.add_argument(
        '--username',
        required=True,
        help='Your StoryGraph username'
    )
    parser.add_argument(
        '--token',
        required=True,
        help='Your remember_user_token from StoryGraph cookies'
    )
    parser.add_argument(
        '--output',
        default='_data',
        help='Output directory (default: _data)'
    )

    args = parser.parse_args()

    try:
        data = fetch_storygraph_data(args.username, args.token)
        save_data(data, args.output)
        print("\n✓ Successfully synced StoryGraph data!")

    except Exception as e:
        print(f"\n✗ Error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
