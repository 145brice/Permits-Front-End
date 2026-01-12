#!/usr/bin/env python3
"""
Base scraper class for city permit data collection
"""

import requests
import json
import csv
import os
from datetime import datetime, timedelta
from abc import ABC, abstractmethod
import time
import logging

class BaseScraper(ABC):
    def __init__(self, city_name):
        self.city_name = city_name
        self.base_url = ""
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })

        # Setup logging
        logging.basicConfig(
            level=logging.INFO,
            format=f'%(asctime)s - {city_name} - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(city_name)

    @abstractmethod
    def get_permits(self, days_back=30):
        """Abstract method to fetch permits from the city's data source"""
        pass

    def save_to_csv(self, permits, output_dir="leads"):
        """Save permits to CSV file"""
        if not permits:
            self.logger.warning("No permits to save")
            return None

        # Create output directory
        city_dir = os.path.join(output_dir, self.city_name.lower().replace(' ', ''))
        os.makedirs(city_dir, exist_ok=True)

        # Create date-based subdirectory
        today = datetime.now().strftime('%Y-%m-%d')
        output_subdir = os.path.join(city_dir, today)
        os.makedirs(output_subdir, exist_ok=True)

        # Save to CSV
        filename = f"{today}_{self.city_name.lower().replace(' ', '')}.csv"
        filepath = os.path.join(output_subdir, filename)

        if permits:
            fieldnames = ['date', 'city', 'permit_type', 'permit_number', 'address', 'description']
            with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                for permit in permits:
                    # Ensure all required fields are present
                    permit['city'] = self.city_name
                    writer.writerow(permit)

        self.logger.info(f"Saved {len(permits)} permits to {filepath}")
        return filepath

    def clean_text(self, text):
        """Clean and normalize text data"""
        if not text:
            return ""
        return str(text).strip().replace('\n', ' ').replace('\r', ' ')

    def parse_date(self, date_str):
        """Parse various date formats into YYYY-MM-DD"""
        if not date_str:
            return ""

        # Common date formats to try
        formats = [
            '%Y-%m-%d',
            '%Y-%m-%dT%H:%M:%S.%f',  # ISO format with milliseconds
            '%Y-%m-%dT%H:%M:%S',     # ISO format without milliseconds
            '%m/%d/%Y',
            '%Y/%m/%d',
            '%d-%m-%Y',
            '%m-%d-%Y',
            '%B %d, %Y',
            '%b %d, %Y'
        ]

        for fmt in formats:
            try:
                return datetime.strptime(date_str, fmt).strftime('%Y-%m-%d')
            except ValueError:
                continue

        self.logger.warning(f"Could not parse date: {date_str}")
        return str(date_str)

    def is_recent(self, date_str, days_back=30):
        """Check if a date is within the specified number of days"""
        if not date_str:
            return False

        try:
            permit_date = datetime.strptime(date_str, '%Y-%m-%d')
            cutoff_date = datetime.now() - timedelta(days=days_back)
            return permit_date >= cutoff_date
        except ValueError:
            return False

    def run(self, days_back=30, save_to_csv=True):
        """Main method to run the scraper"""
        self.logger.info(f"Starting scrape for {self.city_name}")

        try:
            permits = self.get_permits(days_back)

            if save_to_csv:
                filepath = self.save_to_csv(permits)
                return permits, filepath
            else:
                return permits, None

        except Exception as e:
            self.logger.error(f"Error scraping {self.city_name}: {str(e)}")
            return [], None