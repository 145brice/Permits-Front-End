#!/usr/bin/env python3
"""
Memphis Permit Scraper
Data source: City of Memphis Open Data Portal
"""

from datetime import datetime, timedelta
import requests
import csv
import time
import os
from base_scraper import BaseScraper
from utils import retry_with_backoff, validate_state

class MemphisScraper(BaseScraper):
    def __init__(self):
        super().__init__("memphis")
        # Memphis uses ArcGIS REST API
        self.base_url = "https://services.arcgis.com/GB4b8F8jgedeJv3F/arcgis/rest/services/Building_Permits/FeatureServer/0/query"
        self.permits = []

    @retry_with_backoff(max_retries=3, initial_delay=2, exceptions=(requests.RequestException,))
    def _fetch_batch(self, params):
        """Fetch a single batch of permits with retry logic"""
        response = requests.get(self.base_url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()

    def get_permits(self, max_permits=5000, days_back=90):
        """
        Scrape Memphis building permits

        Args:
            max_permits: Maximum number of permits to retrieve
            days_back: Number of days back to search
        """
        self.logger.info("=" * 60)
        self.logger.info("🏗️  Memphis TN Construction Permits Scraper")
        self.logger.info(f"Fetching up to {max_permits} permits from last {days_back} days...")

        print(f"🏗️  Memphis TN Construction Permits Scraper")
        print(f"=" * 60)
        print(f"Fetching up to {max_permits} permits from last {days_back} days...")
        print()

        offset = 0
        batch_size = 1000

        while len(self.permits) < max_permits:
            try:
                params = {
                    'where': '1=1',
                    'outFields': '*',
                    'returnGeometry': 'false',
                    'resultOffset': offset,
                    'resultRecordCount': min(batch_size, max_permits - len(self.permits)),
                    'f': 'json'
                }

                data = self._fetch_batch(params)

                if 'features' not in data or not data['features']:
                    self.logger.info(f"No more data at offset {offset}")
                    break

                for feature in data['features']:
                    attrs = feature.get('attributes', {})

                    permit_number = str(attrs.get('PERMIT_NO') or attrs.get('Permit_Number') or '')
                    address = attrs.get('ADDRESS') or attrs.get('Address') or 'N/A'

                    # STATE VALIDATION: Only accept Tennessee addresses
                    if not validate_state(address, 'memphis', self.logger):
                        continue

                    permit = {
                        'permit_number': permit_number,
                        'address': address,
                        'permit_type': attrs.get('PERMIT_TYPE') or attrs.get('Permit_Type') or 'N/A',
                        'description': f"Project: {attrs.get('DESCRIPTION', 'N/A')}",
                        'date': self._format_date(attrs.get('ISSUE_DATE') or attrs.get('Date_Issued')),
                        'city': 'Memphis'
                    }

                    self.permits.append(permit)

                    if len(self.permits) >= max_permits:
                        break

                self.logger.debug(f"Fetched batch at offset {offset}: {len(data['features'])} records")
                offset += batch_size
                time.sleep(0.5)

            except requests.RequestException as e:
                self.logger.warning(f"Request error at offset {offset}: {e}")
                break
            except Exception as e:
                self.logger.error(f"Unexpected error at offset {offset}: {e}", exc_info=True)
                break

        self.logger.info(f"Successfully collected {len(self.permits)} Memphis permits")
        print(f"✅ Successfully collected {len(self.permits)} Memphis permits")
        return self.permits

    def _format_date(self, timestamp):
        """Format timestamp to YYYY-MM-DD"""
        if not timestamp:
            return 'N/A'
        try:
            if isinstance(timestamp, (int, float)):
                return datetime.fromtimestamp(int(timestamp) / 1000).strftime('%Y-%m-%d')
            return str(timestamp)[:10]
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
    scraper = MemphisScraper()
    permits, filepath = scraper.run()
    print(f"Scraped {len(permits)} permits, saved to {filepath}")