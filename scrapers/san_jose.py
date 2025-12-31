#!/usr/bin/env python3
"""
San Jose Permit Scraper
Data source: San Jose Open Data Portal
"""

from datetime import datetime, timedelta
import requests
from base_scraper import BaseScraper
from utils import retry_with_backoff, validate_state

class SanJoseScraper(BaseScraper):
    def __init__(self):
        super().__init__("San Jose")
        # San Jose Open Data - CKAN API
        self.base_url = "https://data.sanjoseca.gov/api/3/action/datastore_search"
        self.resource_id = "7f3c0ee4-7c87-4b9f-9fc8-7f5a5e8f9c8d"  # Active Building Permits resource
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
        Scrape San Jose building permits

        Args:
            max_permits: Maximum number of permits to retrieve
            days_back: Number of days back to search (default 30)
        """
        self.logger.info("=" * 60)
        self.logger.info("🏗️  San Jose CA Construction Permits Scraper")
        self.logger.info(f"Fetching up to {max_permits} permits from last {days_back} days...")

        print(f"🏗️  San Jose CA Construction Permits Scraper")
        print(f"=" * 60)
        print(f"Fetching up to {max_permits} permits from last {days_back} days...")
        print()

        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)

        self.logger.info(f"Date Range: {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}")
        print(f"Date Range: {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}")
        print()

        offset = 0
        batch_size = 100  # CKAN typical limit

        while len(self.permits) < max_permits:
            try:
                params = {
                    'resource_id': self.resource_id,
                    'limit': min(batch_size, max_permits - len(self.permits)),
                    'offset': offset
                }

                response = self._fetch_batch(params)

                if not response.get('success'):
                    self.logger.error("API returned unsuccessful response")
                    break

                data = response.get('result', {}).get('records', [])

                if not data:
                    break

                for record in data:
                    permit_id = str(record.get('permit_number', ''))

                    if permit_id and permit_id not in self.seen_permit_ids:
                        self.seen_permit_ids.add(permit_id)

                        # Build address
                        address = f"{record.get('address', '')} San Jose, CA".strip()

                        if not validate_state(address, 'san_jose', self.logger):
                            continue

                        # Check if within date range
                        issue_date = record.get('issue_date', '')
                        if not self.is_recent(self._format_date(issue_date), days_back):
                            continue

                        # Parse value
                        value = self._parse_value(record.get('valuation', 0))

                        self.permits.append({
                            'permit_number': permit_id,
                            'address': address,
                            'type': record.get('permit_type', 'N/A'),
                            'value': f"${value:,.0f}" if value > 0 else 'N/A',
                            'issued_date': self._format_date(issue_date),
                            'status': record.get('status', 'N/A'),
                            'city': 'San Jose'
                        })

                if len(data) < batch_size:
                    break

                offset += batch_size
                self.logger.debug(f"Fetched {len(data)} records")

            except Exception as e:
                self.logger.error(f"Error: {e}")
                break

        print(f"✅ Scraping Complete! Found {len(self.permits)} permits")
        print(f"=" * 60)
        print()

        return self.permits

    def _parse_value(self, value):
        """Parse construction value"""
        if not value:
            return 0
        try:
            return float(str(value).replace('$', '').replace(',', ''))
        except:
            return 0

    def _format_date(self, date_str):
        """Format date to YYYY-MM-DD"""
        if not date_str:
            return 'N/A'
        try:
            return date_str[:10]
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
    scraper = SanJoseScraper()
    permits, filepath = scraper.run()
    print(f"Scraped {len(permits)} permits, saved to {filepath}")
