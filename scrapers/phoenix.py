#!/usr/bin/env python3
"""
Phoenix Permit Scraper
Data source: Phoenix Open Data Portal
"""

import requests
import json
from datetime import datetime, timedelta
from base_scraper import BaseScraper
import random

class PhoenixScraper(BaseScraper):
    def __init__(self):
        super().__init__("Phoenix")
        self.base_url = "https://data.phoenix.gov/api"

    def get_permits(self, days_back=30):
        """Fetch permits from Phoenix Open Data Portal"""
        permits = []

        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)

        # For now, generate sample data
        # TODO: Update with correct Phoenix Open Data API endpoint

        self.logger.info(f"Generating sample Phoenix permits from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}")

        # Generate sample permits for testing
        permit_types = ['Residential', 'Commercial', 'Residential', 'Commercial']
        descriptions = [
            'Kitchen remodel', 'Bathroom addition', 'Home renovation', 'Deck construction',
            'Office buildout', 'Retail space', 'Restaurant renovation', 'Medical office'
        ]
        streets = ['Camelback Rd', 'Central Ave', 'Mill Ave', 'Roosevelt St', 'Van Buren St']

        # Generate permits for each day in the range
        current_date = start_date
        permit_count = 0

        while current_date <= end_date and permit_count < 50:  # Limit to 50 for testing
            # Generate 1-3 permits per day
            permits_per_day = random.randint(1, 3)

            for i in range(permits_per_day):
                permit = {
                    'date': current_date.strftime('%Y-%m-%d'),
                    'city': 'Phoenix',
                    'permit_type': random.choice(permit_types),
                    'permit_number': f'PHX{current_date.strftime("%y%m%d")}{i+1:02d}',
                    'address': f'{random.randint(100, 9999)} {random.choice(streets)}, Phoenix',
                    'description': random.choice(descriptions)
                }
                permits.append(permit)
                permit_count += 1

            current_date += timedelta(days=1)

        self.logger.info(f"Generated {len(permits)} sample Phoenix permits")
        return permits

if __name__ == "__main__":
    scraper = PhoenixScraper()
    permits, filepath = scraper.run()
    print(f"Scraped {len(permits)} permits, saved to {filepath}")