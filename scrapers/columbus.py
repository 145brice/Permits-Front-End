#!/usr/bin/env python3
"""
Columbus Permit Scraper
Data source: GIS Open Data Columbus - ArcGIS API
"""

from datetime import datetime, timedelta
import requests
from base_scraper import BaseScraper
from utils import retry_with_backoff, validate_state

class ColumbusScraper(BaseScraper):
    def __init__(self):
        super().__init__("Columbus")
        # Columbus GIS ArcGIS REST API
        self.base_url = "https://services4.arcgis.com/Ccjk7cBSTR91Q1ih/arcgis/rest/services/Building_Permits/FeatureServer/0/query"
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
        Scrape Columbus building permits

        Args:
            max_permits: Maximum number of permits to retrieve
            days_back: Number of days back to search (default 30)
        """
        self.logger.info("=" * 60)
        self.logger.info("🏗️  Columbus OH Construction Permits Scraper")
        self.logger.info(f"Fetching up to {max_permits} permits from last {days_back} days...")

        print(f"🏗️  Columbus OH Construction Permits Scraper")
        print(f"=" * 60)
        print(f"Fetching up to {max_permits} permits from last {days_back} days...")
        print()

        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)

        # Convert to Unix timestamp (milliseconds)
        start_timestamp = int(start_date.timestamp() * 1000)
        end_timestamp = int(end_date.timestamp() * 1000)

        self.logger.info(f"Date Range: {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}")
        print(f"Date Range: {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}")
        print()

        offset = 0
        batch_size = 1000

        while len(self.permits) < max_permits:
            try:
                params = {
                    'where': f"IssueDate >= {start_timestamp} AND IssueDate <= {end_timestamp}",
                    'outFields': '*',
                    'returnGeometry': 'false',
                    'resultOffset': offset,
                    'resultRecordCount': min(batch_size, max_permits - len(self.permits)),
                    'f': 'json'
                }

                data = self._fetch_batch(params)

                if 'features' not in data or not data['features']:
                    break

                for feature in data['features']:
                    attrs = feature.get('attributes', {})
                    permit_id = str(attrs.get('PermitNum', ''))

                    if permit_id and permit_id not in self.seen_permit_ids:
                        self.seen_permit_ids.add(permit_id)

                        # Build address
                        address = f"{attrs.get('Address', '')} Columbus, OH".strip()

                        if not validate_state(address, 'columbus', self.logger):
                            continue

                        # Parse value
                        value = self._parse_value(attrs.get('EstProjectCost', 0))

                        self.permits.append({
                            'permit_number': permit_id,
                            'address': address,
                            'type': attrs.get('WorkType', 'N/A'),
                            'value': f"${value:,.0f}" if value > 0 else 'N/A',
                            'issued_date': self._format_date(attrs.get('IssueDate')),
                            'status': attrs.get('Status', 'N/A'),
                            'city': 'Columbus'
                        })

                if len(data['features']) < batch_size:
                    break

                offset += batch_size
                self.logger.debug(f"Fetched {len(data['features'])} records")

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

    def _format_date(self, timestamp):
        """Convert epoch timestamp to readable date"""
        if not timestamp:
            return 'N/A'
        try:
            return datetime.fromtimestamp(int(timestamp) / 1000).strftime('%Y-%m-%d')
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
    scraper = ColumbusScraper()
    permits, filepath = scraper.run()
    print(f"Scraped {len(permits)} permits, saved to {filepath}")
