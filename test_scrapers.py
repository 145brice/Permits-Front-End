#!/usr/bin/env python3
"""
Test script for all city scrapers
Shows which cities have working APIs vs mock data
"""

import scrapers_new as scrapers
from datetime import datetime

def test_all_scrapers():
    """Test all scrapers and report results"""

    print("="*70)
    print("TESTING ALL 20 CITY SCRAPERS")
    print("="*70)
    print()

    results = {}
    working_apis = []
    mock_data = []

    for city_name in sorted(scrapers.SCRAPER_CLASSES.keys()):
        print(f"Testing {city_name}...", end=" ")

        try:
            scraper = scrapers.get_scraper(city_name)
            permits = scraper.scrape()

            # Check if this is real or mock data
            # Mock data usually has generic addresses like "Main St", "Oak Ave", etc.
            is_mock = any(addr in permits[0]['address'] for addr in ['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Maple Dr'])

            count = len(permits)

            if is_mock:
                status = "⚠️  MOCK"
                mock_data.append(city_name)
                print(f"{status} ({count} samples)")
            else:
                status = "✅ REAL"
                working_apis.append(city_name)
                print(f"{status} ({count} permits)")

            results[city_name] = {
                'count': count,
                'status': status,
                'sample': permits[0] if permits else None
            }

        except Exception as e:
            print(f"❌ ERROR: {e}")
            results[city_name] = {'count': 0, 'status': '❌ ERROR', 'error': str(e)}

    # Print summary
    print()
    print("="*70)
    print("SUMMARY")
    print("="*70)
    print()

    print(f"✅ Working APIs ({len(working_apis)} cities):")
    for city in working_apis:
        print(f"   - {city}: {results[city]['count']} permits")

    print()
    print(f"⚠️  Mock Data ({len(mock_data)} cities):")
    for city in mock_data:
        print(f"   - {city}")

    print()
    print("="*70)
    print(f"Total: {len(working_apis)}/{len(scrapers.SCRAPER_CLASSES)} cities with real APIs")
    print("="*70)

    # Show sample from working API
    if working_apis:
        sample_city = working_apis[0]
        sample = results[sample_city]['sample']
        print()
        print(f"Sample permit from {sample_city}:")
        print(f"  Contractor: {sample['contractor_name']}")
        print(f"  Address: {sample['address']}")
        print(f"  Type: {sample['permit_type']}")
        print(f"  Value: ${sample['value']:,}" if sample['value'] else "  Value: N/A")
        print(f"  Date: {sample['issue_date']}")

if __name__ == "__main__":
    test_all_scrapers()
