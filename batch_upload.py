#!/usr/bin/env python3
"""
Batch Firebase Data Uploader for Contractor Leads SaaS
Uploads multiple CSV files to Firebase Firestore
"""

import os
import sys
import glob
from upload_to_firebase import initialize_firebase, parse_csv_file, upload_to_firebase, update_city_stats

def get_city_name_from_filename(filename):
    """Extract city name from filename"""
    base = os.path.basename(filename).lower()

    # Remove date patterns and extensions
    base = base.replace('.csv', '').replace('_', ' ')

    # Remove date patterns like YYYYMMDD, YYYY-MM-DD, etc.
    import re
    base = re.sub(r'\d{4}[-_]?\d{2}[-_]?\d{2}', '', base)
    base = re.sub(r'\d{8}', '', base)

    # Clean up extra spaces and underscores
    base = ' '.join(base.split())

    # Capitalize words
    return base.title()

def batch_upload(csv_directory):
    """Upload all CSV files from a directory (including subdirectories)"""
    if not os.path.exists(csv_directory):
        print(f"Error: Directory not found: {csv_directory}")
        return

    # Find all CSV files recursively
    csv_files = []
    for root, dirs, files in os.walk(csv_directory):
        for file in files:
            if file.endswith('.csv'):
                csv_files.append(os.path.join(root, file))

    if not csv_files:
        print(f"No CSV files found in {csv_directory}")
        return

    print(f"Found {len(csv_files)} CSV files:")
    for csv_file in csv_files[:10]:  # Show first 10
        print(f"  - {os.path.basename(csv_file)}")
    if len(csv_files) > 10:
        print(f"  ... and {len(csv_files) - 10} more")

    # Initialize Firebase
    print("\nInitializing Firebase...")
    db = initialize_firebase()

    # Initialize Firebase
    print("\nInitializing Firebase...")
    db = initialize_firebase()

    total_permits = 0

    for csv_file in csv_files:
        filename = os.path.basename(csv_file)
        city_name = get_city_name_from_filename(filename)

        print(f"\n📁 Processing {filename} -> City: {city_name}")

        # Parse CSV
        permits = parse_csv_file(csv_file)
        if not permits:
            print(f"  ⚠️  No permits found in {filename}")
            continue

        print(f"  📊 Found {len(permits)} permits")

        # Clear existing data for this city
        print(f"  🧹 Clearing existing data for {city_name}...")
        existing_docs = db.collection('admin_leads').where('city', '==', city_name).get()
        batch = db.batch()
        count = 0
        for doc in existing_docs:
            batch.delete(doc.reference)
            count += 1
            if count % 500 == 0:
                batch.commit()
                batch = db.batch()
        if count > 0:
            batch.commit()
            print(f"  🗑️  Cleared {count} existing permits")

        # Upload new data
        uploaded = upload_to_firebase(db, permits, city_name)

        # Update city stats
        update_city_stats(db, city_name, uploaded)

        total_permits += uploaded
        print(f"  ✅ Uploaded {uploaded} permits for {city_name}")

    print(f"\n🎉 Batch upload complete! Total permits uploaded: {total_permits}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python batch_upload.py <csv_directory>")
        print("Example: python batch_upload.py /Users/briceleasure/Desktop/permits-live/data/")
        sys.exit(1)

    csv_directory = sys.argv[1]

    if not os.path.exists('serviceAccountKey.json'):
        print("❌ Error: serviceAccountKey.json not found in current directory")
        print("   Please download your Firebase service account key and place it here.")
        sys.exit(1)

    batch_upload(csv_directory)

if __name__ == "__main__":
    main()