#!/usr/bin/env python3
"""
Indianapolis Permit Scraper
Data source: City of Indianapolis Open Data Portal
"""

from datetime import datetime, timedelta
import requests
import csv
import time
import os
from base_scraper import BaseScraper
from utils import retry_with_backoff, validate_state

class IndianapolisScraper(BaseScraper):
    def __init__(self):
        super().__init__("indianapolis")
        # Indianapolis uses Socrata Open Data API
        self.base_url = "https://data.indy.gov/resource/8w6f-ft5k.json"
        self.permits = []

    @retry_with_backoff(max_retries=3, initial_delay=2, exceptions=(requests.RequestException,))
    def _fetch_batch(self, params):
        """Fetch a single batch of permits with retry logic"""
        response = requests.get(self.base_url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()

    def get_permits(self, max_permits=5000, days_back=90):
        """
        Scrape Indianapolis building permits

        Args:
            max_permits: Maximum number of permits to retrieve
            days_back: Number of days back to search
        """
        self.logger.info("=" * 60)
        self.logger.info("🏗️  Indianapolis IN Construction Permits Scraper")
        self.logger.info(f"Fetching up to {max_permits} permits from last {days_back} days...")

        print(f"🏗️  Indianapolis IN Construction Permits Scraper")
        print(f"=" * 60)
        print(f"Fetching up to {max_permits} permits from last {days_back} days...")
        print()

        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)

        # Indianapolis Socrata API parameters
        params = {
            '$limit': min(1000, max_permits),
            '$where': f"date_issued >= '{start_date.strftime('%Y-%m-%d')}'",
            '$order': 'date_issued DESC'
        }

        try:
            data = self._fetch_batch(params)
            self.logger.info(f"Fetched {len(data)} permits from Indianapolis API")

            for item in data:
                # Extract permit data
                permit_number = item.get('permit_number', '')
                address = item.get('address', '')

                # STATE VALIDATION: Only accept Indiana addresses
                if not validate_state(address, 'indianapolis', self.logger):
                    continue

                permit = {
                    'permit_number': permit_number,
                    'address': address,
                    'permit_type': item.get('permit_type', 'N/A'),
                    'description': f"Project: {item.get('description', 'N/A')}",
                    'date': self._format_date(item.get('date_issued')),
                    'city': 'Indianapolis'
                }

                self.permits.append(permit)

                if len(self.permits) >= max_permits:
                    break

            self.logger.info(f"Successfully collected {len(self.permits)} Indianapolis permits")
            print(f"✅ Successfully collected {len(self.permits)} Indianapolis permits")
            return self.permits

        except Exception as e:
            self.logger.error(f"Error fetching Indianapolis permits: {e}")
            print(f"❌ Error fetching Indianapolis permits: {e}")
            return []

    def _format_date(self, date_str):
        """Format date string to YYYY-MM-DD"""
        if not date_str:
            return 'N/A'
        try:
            # Handle different date formats
            if isinstance(date_str, str):
                # Try parsing various formats
                for fmt in ['%Y-%m-%dT%H:%M:%S.%fZ', '%Y-%m-%dT%H:%M:%SZ', '%Y-%m-%d']:
                    try:
                        return datetime.strptime(date_str, fmt).strftime('%Y-%m-%d')
                    except ValueError:
                        continue
            return str(date_str)[:10]
        except:
            return 'N/A'

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
    scraper = IndianapolisScraper()
    permits, filepath = scraper.run()
    print(f"Scraped {len(permits)} permits, saved to {filepath}")