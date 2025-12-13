#!/usr/bin/env python3
"""
Import leads from CSV scrapers to Firestore
Only imports the most recent 30 days to respect Firebase limits
"""

import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
import csv
import os
import glob
from pathlib import Path

# Initialize Firebase Admin SDK
cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Cities to import
CITIES = [
    'philadelphia', 'chicago', 'houston', 'phoenix', 'san_antonio',
    'austin', 'charlotte', 'columbus', 'fort_worth', 'jacksonville',
    'indianapolis', 'san_francisco'
]

# Only import leads from last 30 days (Firebase limit consideration)
DAYS_TO_IMPORT = 30

def parse_date(date_string):
    """Parse date from various formats"""
    if not date_string or date_string == 'N/A':
        return None

    try:
        # Try YYYY-MM-DD format
        return datetime.strptime(date_string, '%Y-%m-%d')
    except ValueError:
        try:
            # Try MM/DD/YYYY format
            return datetime.strptime(date_string, '%m/%d/%Y')
        except ValueError:
            try:
                # Try other formats
                return datetime.strptime(date_string, '%Y/%m/%d')
            except ValueError:
                print(f"Warning: Could not parse date: {date_string}")
                return None

def is_within_days(date_string, days=30):
    """Check if a date is within the last N days"""
    parsed_date = parse_date(date_string)
    if not parsed_date:
        return False

    cutoff_date = datetime.now() - timedelta(days=days)
    return parsed_date >= cutoff_date

def import_city_leads(city_name, csv_path):
    """Import leads from a CSV file to Firestore"""
    print(f"\n📍 Importing {city_name.upper()} leads from {csv_path}")

    if not os.path.exists(csv_path):
        print(f"   ⚠️  File not found: {csv_path}")
        return 0

    imported_count = 0
    skipped_old = 0
    skipped_duplicate = 0

    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            permit_number = row.get('permit_number', '')
            issued_date = row.get('issued_date', '')

            # Skip if no permit number
            if not permit_number:
                continue

            # Skip if older than 30 days
            if not is_within_days(issued_date, DAYS_TO_IMPORT):
                skipped_old += 1
                continue

            # Check if this permit already exists in Firestore
            existing_query = db.collection('leads').where('permit_number', '==', permit_number).limit(1).get()
            if len(existing_query) > 0:
                skipped_duplicate += 1
                continue

            # Create lead document
            lead_data = {
                'permit_number': permit_number,
                'address': row.get('address', 'N/A'),
                'type': row.get('type', 'N/A'),
                'value': row.get('value', '$0.00'),
                'issued_date': issued_date,
                'status': row.get('status', 'N/A'),
                'city': city_name.lower(),
                'assigned_to': None,  # Not assigned yet
                'assigned_date': None,
                'subscription_id': None,
                'imported_at': firestore.SERVER_TIMESTAMP,
                'source': 'csv_scraper'
            }

            # Add to Firestore
            db.collection('leads').add(lead_data)
            imported_count += 1

            # Progress indicator every 100 leads
            if imported_count % 100 == 0:
                print(f"   ✓ Imported {imported_count} leads...")

    print(f"   ✅ Imported: {imported_count} | Skipped (old): {skipped_old} | Skipped (duplicate): {skipped_duplicate}")
    return imported_count

def find_latest_csv(city_name):
    """Find the most recent CSV file for a city"""
    # Check in backend directory structure
    backend_pattern = f'../contractor-leads-backend/leads/{city_name}/*/*.csv'
    csv_files = glob.glob(backend_pattern)

    if not csv_files:
        # Try alternative pattern
        backend_pattern = f'backend/leads/{city_name}/*/*.csv'
        csv_files = glob.glob(backend_pattern)

    if not csv_files:
        return None

    # Sort by modification time, return most recent
    csv_files.sort(key=os.path.getmtime, reverse=True)
    return csv_files[0]

def import_all_cities():
    """Import leads from all cities"""
    print("=" * 80)
    print("🔥 FIRESTORE LEAD IMPORTER")
    print("=" * 80)
    print(f"📅 Importing leads from last {DAYS_TO_IMPORT} days only")
    print(f"🏙️  Cities to import: {len(CITIES)}")
    print("=" * 80)

    total_imported = 0

    for city in CITIES:
        csv_path = find_latest_csv(city)

        if csv_path:
            count = import_city_leads(city, csv_path)
            total_imported += count
        else:
            print(f"\n📍 {city.upper()}: No CSV file found")

    print("\n" + "=" * 80)
    print(f"✅ TOTAL IMPORTED: {total_imported} leads")
    print("=" * 80)

def clean_old_leads():
    """Remove leads older than 30 days from Firestore"""
    print("\n🧹 Cleaning leads older than 30 days...")

    cutoff_date = (datetime.now() - timedelta(days=DAYS_TO_IMPORT)).strftime('%Y-%m-%d')

    # Query for old unassigned leads
    old_leads = db.collection('leads').where('assigned_to', '==', None).where('issued_date', '<', cutoff_date).stream()

    deleted_count = 0
    batch = db.batch()
    batch_count = 0

    for doc in old_leads:
        batch.delete(doc.reference)
        batch_count += 1
        deleted_count += 1

        # Firestore batch limit is 500 operations
        if batch_count >= 500:
            batch.commit()
            batch = db.batch()
            batch_count = 0

    # Commit remaining
    if batch_count > 0:
        batch.commit()

    print(f"   🗑️  Deleted {deleted_count} old unassigned leads")

if __name__ == '__main__':
    import sys

    if len(sys.argv) > 1:
        if sys.argv[1] == '--clean':
            clean_old_leads()
        elif sys.argv[1] == '--city':
            if len(sys.argv) > 2:
                city = sys.argv[2].lower()
                csv_path = find_latest_csv(city)
                if csv_path:
                    import_city_leads(city, csv_path)
                else:
                    print(f"No CSV found for {city}")
            else:
                print("Usage: python import_leads_to_firestore.py --city <city_name>")
        else:
            print("Usage: python import_leads_to_firestore.py [--clean | --city <city_name>]")
    else:
        import_all_cities()
