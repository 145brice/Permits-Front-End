#!/usr/bin/env python3
"""
Jacksonville Permit Scraper
Data source: Jacksonville Open Data (to be verified)
"""

from datetime import datetime, timedelta
import requests
from base_scraper import BaseScraper
from utils import retry_with_backoff, validate_state

class JacksonvilleScraper(BaseScraper):
    def __init__(self):
        super().__init__("Jacksonville")
        # Jacksonville data portal - needs verification
        self.base_url = "https://transparency.jaxsheriff.org/api/3/action/datastore_search"
        self.permits = []
        self.seen_permit_ids = set()

    @retry_with_backoff(max_retries=3, initial_delay=2, exceptions=(requests.RequestException,))
    def _fetch_batch(self, params):
        """Fetch a single batch of permits with retry logic"""
        response = requests.get(self.base_url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()

    def get_permits(self, max_permits=5000, days_back=30):
        """
        Scrape Jacksonville building permits

        Args:
            max_permits: Maximum number of permits to retrieve
            days_back: Number of days back to search (default 30)
        """
        self.logger.info("=" * 60)
        self.logger.info("🏗️  Jacksonville FL Construction Permits Scraper")
        self.logger.info(f"Fetching up to {max_permits} permits from last {days_back} days...")

        print(f"🏗️  Jacksonville FL Construction Permits Scraper")
        print(f"=" * 60)
        print(f"⚠️  NOTE: Jacksonville API needs verification - using placeholder")
        print(f"Fetching up to {max_permits} permits from last {days_back} days...")
        print()

        # TODO: Update with actual Jacksonville API endpoint once verified
        self.logger.warning("Jacksonville API endpoint needs verification")
        print("❌ Jacksonville API not yet configured")
        print("   Please update this scraper with verified Jacksonville Open Data Portal URL")
        print(f"=" * 60)
        print()

        return self.permits

    def run(self):
        try:
            permits = self.get_permits()
            if permits:
                filepath = self.save_to_csv(permits)
                return permits, filepath
            return [], None
        except Exception as e:
            self.logger.error(f"Fatal error: {e}")
            return [], None

if __name__ == "__main__":
    scraper = JacksonvilleScraper()
    permits, filepath = scraper.run()
    print(f"Scraped {len(permits)} permits, saved to {filepath}")
