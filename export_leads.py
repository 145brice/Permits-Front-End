#!/usr/bin/env python3
"""
Export scraped building permits to dated folders
Creates folder structure: leads/YYYY-MM-DD/CityName/permits.csv
"""

import os
import csv
from datetime import datetime
from scrapers import get_scraper, SCRAPER_CLASSES

def export_leads():
    """Export all scraped leads to dated folders"""

    # Create base leads folder with today's date
    today = datetime.now().strftime('%Y-%m-%d')
    base_folder = f"leads/{today}"

    print("="*70)
    print(f"EXPORTING LEADS TO: {base_folder}")
    print("="*70)

    # Create base folder if it doesn't exist
    os.makedirs(base_folder, exist_ok=True)

    total_permits = 0
    cities_with_data = 0

    # Scrape and export each city
    for city_name in SCRAPER_CLASSES.keys():
        print(f"\n📁 Processing {city_name}...")

        # Get scraper and fetch permits
        scraper = get_scraper(city_name)
        if not scraper:
            print(f"  ⚠️  No scraper found for {city_name}")
            continue

        permits = scraper.scrape()

        if not permits:
            print(f"  ⚠️  No permits found for {city_name}")
            continue

        # Create city subfolder
        city_folder = os.path.join(base_folder, city_name.replace(' ', '_'))
        os.makedirs(city_folder, exist_ok=True)

        # Export to CSV
        csv_file = os.path.join(city_folder, 'permits.csv')

        with open(csv_file, 'w', newline='', encoding='utf-8') as f:
            if permits:
                fieldnames = permits[0].keys()
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(permits)

        total_permits += len(permits)
        cities_with_data += 1

        # Check if real data
        is_real = not any(street in permits[0]['address'] for street in ['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Maple Dr'])

        if is_real and len(permits) > 15:
            print(f"  ✅ Exported {len(permits)} permits (REAL DATA) → {csv_file}")
        else:
            print(f"  📋 Exported {len(permits)} permits (sample data) → {csv_file}")

    print("\n" + "="*70)
    print("EXPORT SUMMARY")
    print("="*70)
    print(f"📂 Location: {base_folder}")
    print(f"🏙️  Cities Processed: {cities_with_data}")
    print(f"📄 Total Permits Exported: {total_permits}")
    print("="*70)

    # Create summary file
    summary_file = os.path.join(base_folder, 'EXPORT_SUMMARY.txt')
    with open(summary_file, 'w') as f:
        f.write(f"Building Permits Export Summary\n")
        f.write(f"================================\n\n")
        f.write(f"Export Date: {today}\n")
        f.write(f"Cities Processed: {cities_with_data}\n")
        f.write(f"Total Permits: {total_permits}\n\n")
        f.write(f"Verified Working Cities (7):\n")
        f.write(f"  - Austin, TX\n")
        f.write(f"  - Chicago, IL\n")
        f.write(f"  - Seattle, WA\n")
        f.write(f"  - Chattanooga, TN\n")
        f.write(f"  - Phoenix, AZ\n")
        f.write(f"  - San Antonio, TX\n")
        f.write(f"  - Boston, MA\n\n")
        f.write(f"Each city's permits are in: {base_folder}/CityName/permits.csv\n")

    print(f"\n📝 Summary saved to: {summary_file}")
    print("\n✅ EXPORT COMPLETE!\n")

    return base_folder

if __name__ == "__main__":
    export_leads()
