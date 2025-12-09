# City Permit Scrapers

This directory contains web scrapers for collecting building permit data from various US cities. Each scraper is designed to fetch recent permit data (last 30 days by default) and save it to CSV files.

## Current Scrapers

- **nashville.py** - Nashville, TN permits
- **charlotte.py** - Charlotte, NC permits
- **austin.py** - Austin, TX permits
- **chattanooga.py** - Chattanooga, TN permits
- **houston.py** - Houston, TX permits
- **phoenix.py** - Phoenix, AZ permits
- **sanantonio.py** - San Antonio, TX permits

## How It Works

Each scraper inherits from `BaseScraper` and implements the `get_permits()` method. Currently, they generate sample data for testing purposes.

### File Structure
```
leads/
├── city_name/
│   ├── YYYY-MM-DD/
│   │   └── YYYY-MM-DD_city_name.csv
```

## Usage

### Run Individual Scrapers
```bash
python3 scrapers/nashville.py
python3 scrapers/charlotte.py
# etc.
```

### Run All Scrapers
```bash
python3 run_scrapers.py
```

## Updating Scrapers for Real Data

Currently, the scrapers generate sample data. To connect to real city APIs:

1. **Find the correct API endpoint** for each city (usually Socrata/Open Data portals)
2. **Update the `get_permits()` method** in each scraper
3. **Test the API connection** and data parsing

### Example API Update

Replace the sample data generation with real API calls:

```python
def get_permits(self, days_back=30):
    # Real API implementation
    dataset_id = "actual-dataset-id"
    url = f"{self.base_url}/{dataset_id}.json"
    params = {
        '$query': f"SELECT * WHERE date_field >= '{start_date}' AND date_field <= '{end_date}'"
    }

    response = self.session.get(url, params=params)
    data = response.json()

    for item in data:
        permit = {
            'date': self.parse_date(item.get('actual_date_field')),
            'city': self.city_name,
            'permit_type': item.get('actual_type_field'),
            'permit_number': item.get('actual_number_field'),
            'address': item.get('actual_address_field'),
            'description': item.get('actual_description_field')
        }
        permits.append(permit)
```

## City Data Portals

- Nashville: https://data.nashville.gov/
- Charlotte: https://data.charlottenc.gov/
- Austin: https://data.austintexas.gov/
- Chattanooga: https://data.chattanooga.gov/
- Houston: https://data.houston.gov/
- Phoenix: https://data.phoenix.gov/
- San Antonio: https://data.sanantonio.gov/

## Dependencies

- requests
- python-dateutil (for date parsing)

## Output Format

CSV files contain:
- date: YYYY-MM-DD format
- city: City name
- permit_type: Residential/Commercial
- permit_number: Unique permit identifier
- address: Full address
- description: Work description