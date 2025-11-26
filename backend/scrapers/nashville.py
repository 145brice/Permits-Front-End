import sys
import csv
import datetime
import requests
from bs4 import BeautifulSoup

city = sys.argv[1] if len(sys.argv) > 1 else 'nashville'

# Example scraper for Nashville permits
# Replace with real scraping logic

def scrape_permits():
    # Mock data - replace with real scraping
    permits = [
        {'address': '123 Main St', 'type': 'Residential', 'value': '$50,000'},
        {'address': '456 Oak Ave', 'type': 'Commercial', 'value': '$100,000'},
        # Add more...
    ]
    
    # In real: 
    # url = 'https://permits.nashville.gov/search'
    # response = requests.get(url)
    # soup = BeautifulSoup(response.text, 'html.parser')
    # permits = parse_permits(soup)
    
    return permits

def save_to_csv(permits):
    date_str = datetime.date.today().isoformat()
    filename = f'../leads/{city}/{date_str}.csv'
    os.makedirs(f'../leads/{city}', exist_ok=True)
    
    with open(filename, 'w', newline='') as f:
        if permits:
            writer = csv.DictWriter(f, fieldnames=permits[0].keys())
            writer.writeheader()
            writer.writerows(permits)

if __name__ == '__main__':
    permits = scrape_permits()
    save_to_csv(permits)
    print(f'Scraped {len(permits)} permits for {city}')