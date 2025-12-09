#!/usr/bin/env python3
"""
Nashville Permit Scraper
Data source: Nashville Open Data Portal
"""

import requests
import json
from datetime import datetime, timedelta
from base_scraper import BaseScraper

class NashvilleScraper(BaseScraper):
    def __init__(self):
        super().__init__("Nashville")
        self.base_url = "https://data.nashville.gov/resource"

    def get_permits(self, days_back=30):
        """Fetch permits from Nashville Open Data Portal"""
        permits = []

        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)

        # Nashville Building Permits dataset
        # Found via: https://data.nashville.gov/browse?q=building%20permits
        dataset_id = "nm4z-zb7c"  # Nashville Building Permits

        # Build Socrata API query
        query = f"""
        SELECT
            permit_number,
            permit_type_description,
            permit_subtype_description,
            date_issued,
            address,
            description
        WHERE
            date_issued >= '{start_date.strftime('%Y-%m-%d')}' AND
            date_issued <= '{end_date.strftime('%Y-%m-%d')}' AND
            permit_type_description IS NOT NULL
        ORDER BY date_issued DESC
        LIMIT 5000
        """

        url = f"{self.base_url}/{dataset_id}.json"
        params = {
            '$query': query
        }

        try:
            self.logger.info(f"Fetching real Nashville permits from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}")

            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()

            data = response.json()

            for item in data:
                permit = {
                    'date': self.parse_date(item.get('date_issued', '')),
                    'city': 'Nashville',
                    'permit_type': self.clean_text(item.get('permit_type_description', '')),
                    'permit_number': self.clean_text(item.get('permit_number', '')),
                    'address': self.clean_text(item.get('address', '')),
                    'description': self.clean_text(item.get('description', ''))
                }

                if permit['date'] and permit['permit_number']:
                    permits.append(permit)

            self.logger.info(f"Found {len(permits)} real Nashville permits")

        except requests.exceptions.RequestException as e:
            self.logger.error(f"Error fetching Nashville data: {e}")
            # Fallback to sample data if API fails
            self.logger.info("Falling back to sample data...")
            permits = self._generate_sample_data(days_back)
        except json.JSONDecodeError as e:
            self.logger.error(f"Error parsing Nashville JSON: {e}")
            permits = self._generate_sample_data(days_back)

        return permits

    def _generate_sample_data(self, days_back):
        """Generate sample data as fallback"""
        permits = []
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)

        import random
        permit_types = ['Residential', 'Commercial']
        descriptions = ['Kitchen remodel', 'Bathroom addition', 'Home renovation']

        current_date = start_date
        while current_date <= end_date and len(permits) < 10:
            for i in range(random.randint(0, 2)):
                permit = {
                    'date': current_date.strftime('%Y-%m-%d'),
                    'city': 'Nashville',
                    'permit_type': random.choice(permit_types),
                    'permit_number': f'SAMPLE{current_date.strftime("%y%m%d")}{i+1:02d}',
                    'address': f'{random.randint(100, 9999)} Sample St, Nashville',
                    'description': random.choice(descriptions)
                }
                permits.append(permit)
            current_date += timedelta(days=1)

        return permits

if __name__ == "__main__":
    scraper = NashvilleScraper()
    permits, filepath = scraper.run()
    print(f"Scraped {len(permits)} permits, saved to {filepath}")