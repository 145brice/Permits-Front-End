#!/usr/bin/env python3
"""
Houston Permit Scraper
Data source: City of Houston Open Data Portal
"""

from datetime import datetime, timedelta
import requests
from base_scraper import BaseScraper
from utils import retry_with_backoff, validate_state

class HoustonScraper(BaseScraper):
    def __init__(self):
        super().__init__("Houston")
        # Houston Open Data Portal - Building Permits dataset
        # Dataset: Building Permits - https://cohgis-mycity.opendata.arcgis.com/
        self.base_url = "https://services.arcgis.com/su8ic9KbA7PYVxPS/arcgis/rest/services/COH_BUILDING_PERMITS/FeatureServer/0/query"
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
        Scrape Houston building permits

        Args:
            max_permits: Maximum number of permits to retrieve
            days_back: Number of days back to search (default 30)
        """
        self.logger.info("=" * 60)
        self.logger.info("🏗️  Houston TX Construction Permits Scraper")
        self.logger.info(f"Fetching up to {max_permits} permits from last {days_back} days...")

        print(f"🏗️  Houston TX Construction Permits Scraper")
        print(f"=" * 60)
        print(f"Fetching up to {max_permits} permits from last {days_back} days...")
        print()

        # Calculate date range - Houston uses timestamp in milliseconds
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)

        # Convert to milliseconds for ArcGIS timestamp
        start_timestamp = int(start_date.timestamp() * 1000)
        end_timestamp = int(end_date.timestamp() * 1000)

        start_str = start_date.strftime('%Y-%m-%d')
        end_str = end_date.strftime('%Y-%m-%d')

        self.logger.info(f"Date Range: {start_str} to {end_str}")
        print(f"Date Range: {start_str} to {end_str}")
        print()

        offset = 0
        batch_size = 1000

        while len(self.permits) < max_permits:
            try:
                # ArcGIS REST API parameters
                params = {
                    'where': f"ISSUE_DATE >= {start_timestamp} AND ISSUE_DATE <= {end_timestamp}",
                    'outFields': '*',
                    'f': 'json',
                    'resultOffset': offset,
                    'resultRecordCount': min(batch_size, max_permits - len(self.permits)),
                    'orderByFields': 'ISSUE_DATE DESC'
                }

                response_data = self._fetch_batch(params)

                if 'features' not in response_data or not response_data['features']:
                    break

                data = response_data['features']

                for record in data:
                    attributes = record.get('attributes', {})
                    permit_id = str(attributes.get('PERMIT_NBR', ''))

                    if permit_id and permit_id not in self.seen_permit_ids:
                        self.seen_permit_ids.add(permit_id)

                        # Build address
                        street_num = attributes.get('STREET_NBR', '')
                        street_name = attributes.get('STREET_NAME', '')

                        address_parts = [
                            str(street_num) if street_num else '',
                            str(street_name) if street_name else '',
                            'Houston, TX'
                        ]
                        address = ' '.join(filter(None, address_parts))

                        if not validate_state(address, 'houston', self.logger):
                            continue

                        # Get project value
                        value = self._parse_value(attributes.get('PROJECT_VALUE', 0))

                        # Format issue date
                        issue_date_ms = attributes.get('ISSUE_DATE')
                        if issue_date_ms:
                            issue_date = datetime.fromtimestamp(issue_date_ms / 1000).strftime('%Y-%m-%d')
                        else:
                            issue_date = 'N/A'

                        self.permits.append({
                            'permit_number': permit_id,
                            'address': address,
                            'type': attributes.get('PERMIT_TYPE_DESC', 'N/A'),
                            'value': f"${value:,.0f}" if value > 0 else 'N/A',
                            'issued_date': issue_date,
                            'status': attributes.get('STATUS', 'N/A'),
                            'city': 'Houston'
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
    scraper = HoustonScraper()
    permits, filepath = scraper.run()
    print(f"Scraped {len(permits)} permits, saved to {filepath}")
