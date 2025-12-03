from datetime import datetime, timedelta
import requests
import csv
import time
import os
from .utils import retry_with_backoff, setup_logger, ScraperHealthCheck, save_partial_results

class NashvillePermitScraper:
    def __init__(self):
        # Nashville MapServer endpoint for building permits
        # API: https://maps.nashville.gov/arcgis/rest/services/Codes/BuildingPermits/MapServer/0
        self.mapserver_url = 'https://maps.nashville.gov/arcgis/rest/services/Codes/BuildingPermits/MapServer/0/query'
        self.permits = []
        self.seen_permit_ids = set()
        self.logger = setup_logger('nashville')
        self.health_check = ScraperHealthCheck('nashville')

    def _discover_arcgis_datasets(self):
        """Discover current ArcGIS Hub datasets for Nashville"""
        try:
            # Try to find building permits datasets
            search_url = f"{self.arcgis_base_url}/../datasets"
            params = {
                'q': 'building permits',
                'limit': 20,
                'f': 'json'
            }
            response = requests.get(search_url, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()

            datasets = []
            for item in data.get('data', []):
                if 'building' in item.get('name', '').lower() and 'permit' in item.get('name', '').lower():
                    datasets.append(item.get('id'))
                    self.logger.info(f"Found ArcGIS dataset: {item.get('name')} ({item.get('id')})")

            return datasets
        except Exception as e:
            self.logger.warning(f"ArcGIS dataset discovery failed: {e}")
            # Fallback to known dataset
            return ['Building_Permits']

    @retry_with_backoff(max_retries=3, initial_delay=2, exceptions=(requests.RequestException,))
    def _fetch_arcgis_batch(self, params):
        """Fetch ArcGIS data with retry logic"""
        url = f"{self.arcgis_base_url}/{self.dataset_id}/query"
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()

    def scrape_permits(self, max_permits=5000, days_back=90):
        """Scrape Nashville permits using MapServer API"""
        self.logger.info("🏗️  Nashville TN Construction Permits Scraper")
        print(f"🏗️  Nashville TN Construction Permits Scraper")
        print(f"=" * 60)
        print(f"📡 Using Nashville MapServer API...")

        try:
            offset = 0
            batch_size = 1000
            consecutive_failures = 0
            max_consecutive_failures = 3

            while len(self.permits) < max_permits:
                try:
                    params = {
                        'where': '1=1',  # Get all active construction permits
                        'outFields': 'CASE_NUMBER,LOCATION,CASE_TYPE_DESC,CONSTVAL,DATE_ISSUED,STATUS_CODE',
                        'returnGeometry': 'false',
                        'resultRecordCount': min(batch_size, max_permits - len(self.permits)),
                        'resultOffset': offset,
                        'orderByFields': 'DATE_ISSUED DESC',
                        'f': 'json'
                    }

                    response = requests.get(self.mapserver_url, params=params, timeout=30)
                    response.raise_for_status()
                    data = response.json()

                    if not data.get('features'):
                        self.logger.info(f"No more data at offset {offset}")
                        break

                    # Reset failure counter on success
                    consecutive_failures = 0

                    for feature in data['features']:
                        attrs = feature.get('attributes', {})
                        permit_id = str(attrs.get('CASE_NUMBER', ''))

                        if permit_id and permit_id not in self.seen_permit_ids:
                            self.seen_permit_ids.add(permit_id)
                            self.permits.append({
                                'permit_number': permit_id,
                                'address': attrs.get('LOCATION') or 'N/A',
                                'type': attrs.get('CASE_TYPE_DESC') or 'N/A',
                                'value': self._parse_cost(attrs.get('CONSTVAL') or 0),
                                'issued_date': self._format_arcgis_date(attrs.get('DATE_ISSUED')),
                                'status': attrs.get('STATUS_CODE') or 'N/A'
                            })

                    print(f"✓ Fetched {len(self.permits)} permits so far...")

                    if len(data['features']) < batch_size:
                        break
                    offset += batch_size
                    time.sleep(0.5)

                except requests.RequestException as e:
                    consecutive_failures += 1
                    self.logger.warning(f"Batch error at offset {offset}: {e}")

                    if consecutive_failures >= max_consecutive_failures:
                        self.logger.error(f"Too many consecutive failures, stopping")
                        break

                    offset += batch_size
                    time.sleep(2)

            if len(self.permits) > 0:
                self.logger.info(f"✅ Success! Got {len(self.permits)} permits from MapServer")
                self.health_check.record_success(len(self.permits))
                print(f"\n✅ Success! Got {len(self.permits)} Nashville permits")
                return self.permits
            else:
                self.logger.warning("No permits found")
                self.health_check.record_failure("No permits found")
                print(f"⚠️  No permits found - will retry next run")
                return []

        except Exception as e:
            self.logger.error(f"Nashville MapServer endpoint failed: {e}")
            self.health_check.record_failure(str(e))
            print(f"❌ Nashville MapServer endpoint failed: {e}")
            return []
    
    def _parse_cost(self, value):
        try:
            cost = float(value) if value else 0
            return f"${cost:,.2f}"
        except:
            return "$0.00"
    
    def _format_arcgis_date(self, timestamp_ms):
        """Convert ArcGIS timestamp (milliseconds) to date string"""
        if not timestamp_ms:
            return 'N/A'
        try:
            # ArcGIS timestamps are in milliseconds since Unix epoch
            timestamp_s = int(timestamp_ms) / 1000
            return datetime.fromtimestamp(timestamp_s).strftime('%Y-%m-%d')
        except:
            return 'N/A'
    
    def save_to_csv(self, filename=None):
        if not self.permits:
            return
        if filename is None:
            today = datetime.now().strftime('%Y-%m-%d')
            filename = f'../leads/nashville/{today}/{today}_nashville.csv'
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=list(self.permits[0].keys()))
            writer.writeheader()
            writer.writerows(self.permits)
        print(f"✅ Saved {len(self.permits)} permits to {filename}")

    def run(self):
        """Main execution with error handling and auto-recovery"""
        try:
            permits = self.scrape_permits()
            if permits:
                self.save_to_csv()
                self.logger.info(f"✅ Scraped {len(permits)} permits for nashville")
                print(f"✅ Scraped {len(permits)} permits for nashville")
                return permits
            else:
                self.logger.warning("❌ No permits scraped for nashville")
                print(f"❌ No permits scraped for nashville - will retry next run")
                return []
        except Exception as e:
            self.logger.error(f"Fatal error in scraper: {e}", exc_info=True)
            self.health_check.record_failure(str(e))
            print(f"❌ Fatal error in nashville scraper: {e}")
            return []

def scrape_permits():
    return NashvillePermitScraper().scrape_permits()

def save_to_csv(permits):
    scraper = NashvillePermitScraper()
    scraper.permits = permits
    scraper.save_to_csv()
