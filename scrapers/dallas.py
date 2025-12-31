#!/usr/bin/env python3
"""
Dallas Permit Scraper
Data source: Dallas OpenData - Socrata API
"""

from datetime import datetime, timedelta
import requests
from base_scraper import BaseScraper
from utils import retry_with_backoff, validate_state

class DallasScraper(BaseScraper):
    def __init__(self):
        super().__init__("Dallas")
        # Dallas OpenData Socrata API
        self.base_url = "https://www.dallasopendata.com/resource/e7gq-4sah.json"
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
        Scrape Dallas building permits

        Args:
            max_permits: Maximum number of permits to retrieve
            days_back: Number of days back to search (default 30)
        """
        self.logger.info("=" * 60)
        self.logger.info("🏗️  Dallas TX Construction Permits Scraper")
        self.logger.info(f"Fetching up to {max_permits} permits from last {days_back} days...")

        print(f"🏗️  Dallas TX Construction Permits Scraper")
        print(f"=" * 60)
        print(f"Fetching up to {max_permits} permits from last {days_back} days...")
        print()

        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)

        # Socrata date format: YYYY-MM-DD
        start_str = start_date.strftime('%Y-%m-%d')
        end_str = end_date.strftime('%Y-%m-%d')

        self.logger.info(f"Date Range: {start_str} to {end_str}")
        print(f"Date Range: {start_str} to {end_str}")
        print()

        offset = 0
        batch_size = 1000  # Socrata limit

        while len(self.permits) < max_permits:
            try:
                params = {
                    '$where': f"issue_date >= '{start_str}' AND issue_date <= '{end_str}'",
                    '$limit': min(batch_size, max_permits - len(self.permits)),
                    '$offset': offset,
                    '$order': 'issue_date DESC'
                }

                data = self._fetch_batch(params)

                if not data:
                    self.logger.info(f"No more data available at offset {offset}")
                    break

                for record in data:
                    permit_id = str(record.get('permit_number', ''))

                    if permit_id and permit_id not in self.seen_permit_ids:
                        self.seen_permit_ids.add(permit_id)

                        # Extract and validate address
                        street = record.get('street_name', '')
                        street_num = record.get('street_number', '')
                        address = f"{street_num} {street}, Dallas, TX".strip()

                        if not validate_state(address, 'dallas', self.logger):
                            continue

                        # Parse permit value
                        value = self._parse_value(record.get('construction_cost', 0))

                        self.permits.append({
                            'permit_number': permit_id,
                            'address': address,
                            'type': record.get('permit_type_desc', 'N/A'),
                            'value': f"${value:,.0f}" if value > 0 else 'N/A',
                            'issued_date': self._format_date(record.get('issue_date')),
                            'status': record.get('status', 'N/A'),
                            'city': 'Dallas'
                        })

                if len(data) < batch_size:
                    break

                offset += batch_size
                self.logger.debug(f"Fetched {len(data)} records at offset {offset}")

            except Exception as e:
                self.logger.error(f"Error at offset {offset}: {e}")
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
    scraper = DallasScraper()
    permits, filepath = scraper.run()
    print(f"Scraped {len(permits)} permits, saved to {filepath}")
