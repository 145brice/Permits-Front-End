#!/usr/bin/env python3
"""
Run all city scrapers
"""

import os
import sys
import subprocess
from datetime import datetime

def run_scraper(scraper_file):
    """Run a single scraper"""
    try:
        print(f"\n{'='*50}")
        print(f"Running {scraper_file}")
        print(f"{'='*50}")

        result = subprocess.run([
            sys.executable,
            os.path.join('scrapers', scraper_file)
        ], capture_output=True, text=True, cwd=os.path.dirname(__file__))

        print(result.stdout)
        if result.stderr:
            print("Errors:", result.stderr)

        return result.returncode == 0

    except Exception as e:
        print(f"Error running {scraper_file}: {e}")
        return False

def main():
    """Run all scrapers"""
    print(f"Starting scraper run at {datetime.now()}")

    scrapers = [
        # No scrapers in frontend - all scraping done in backend
    ]

    results = {}
    for scraper in scrapers:
        if os.path.exists(os.path.join('scrapers', scraper)):
            results[scraper] = run_scraper(scraper)
        else:
            print(f"Scraper {scraper} not found")
            results[scraper] = False

    print(f"\n{'='*50}")
    print("SCRAPER RUN SUMMARY")
    print(f"{'='*50}")

    for scraper, success in results.items():
        status = "✓ SUCCESS" if success else "✗ FAILED"
        print(f"{scraper}: {status}")

    successful = sum(results.values())
    total = len(results)
    print(f"\nTotal: {successful}/{total} scrapers successful")

if __name__ == "__main__":
    main()