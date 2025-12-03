from datetime import datetime, timedelta
import requests
import csv
import time
import os
from .utils import retry_with_backoff, setup_logger, ScraperHealthCheck

class PhiladelphiaPermitScraper:
    def __init__(self):
        self.endpoints = ['https://phl.carto.com/api/v2/sql']
        self.permits = []
        self.seen_permit_ids = set()
        self.logger = setup_logger('philadelphia')
        self.health_check = ScraperHealthCheck('philadelphia')

    @retry_with_backoff(max_retries=3, initial_delay=2, exceptions=(requests.RequestException,))
    def _fetch_batch(self, endpoint_url, params):
        response = requests.get(endpoint_url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()

    def scrape_permits(self, max_permits=5000, days_back=90):
        print("🏗️  Philadelphia PA Construction Permits Scraper")
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)
        start_str = start_date.strftime('%Y-%m-%d')

        for endpoint in self.endpoints:
            try:
                offset = 0
                while len(self.permits) < max_permits:
                    query = f"SELECT * FROM li_permits WHERE permitissuedate >= '{start_str}' ORDER BY permitissuedate DESC LIMIT 1000 OFFSET {offset}"
                    params = {'q': query}
                    result = self._fetch_batch(endpoint, params)
                    data = result.get('rows', [])
                    if not data:
                        break
                    for record in data:
                        pid = record.get('permitnumber')
                        if pid and pid not in self.seen_permit_ids:
                            self.seen_permit_ids.add(pid)
                            self.permits.append({
                                'permit_number': pid,
                                'address': record.get('address') or 'N/A',
                                'type': record.get('permit_type_name') or record.get('permittype') or 'N/A',
                                'value': f"${float(record.get('estimatedcost',0)):,.2f}" if record.get('estimatedcost') else "$0.00",
                                'issued_date': record.get('permitissuedate','').split('T')[0] if record.get('permitissuedate') else 'N/A',
                                'status': record.get('status') or 'N/A'
                            })
                    if len(data) < 1000:
                        break
                    offset += 1000
                if self.permits:
                    break
            except Exception as e:
                self.logger.error(f"Error: {e}")
        return self.permits

    def save_to_csv(self, filename=None):
        if not self.permits:
            return
        if not filename:
            today = datetime.now().strftime('%Y-%m-%d')
            filename = f'leads/philadelphia/{today}/{today}_philadelphia.csv'
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=list(self.permits[0].keys()))
            writer.writeheader()
            writer.writerows(self.permits)

    def run(self):
        try:
            permits = self.scrape_permits()
            if permits:
                self.save_to_csv()
            return permits
        except Exception as e:
            self.logger.error(f"Fatal error: {e}")
            return []
