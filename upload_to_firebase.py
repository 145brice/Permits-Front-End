#!/usr/bin/env python3
"""
Firebase Data Uploader for Contractor Leads SaaS
Uploads scraped permit data from CSV files to Firebase Firestore
"""

import csv
import os
import sys
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Check if already initialized
        firebase_admin.get_app()
    except ValueError:
        # Initialize with service account key
        cred = credentials.Certificate('serviceAccountKey.json')
        firebase_admin.initialize_app(cred)

    return firestore.client()

def parse_csv_file(csv_path):
    """Parse a CSV file and return permit data"""
    permits = []
    try:
        with open(csv_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)

            for row in reader:
                # Clean and standardize the data
                permit = {
                    'date': row.get('date', row.get('Date', '')),
                    'city': row.get('city', row.get('City', '')),
                    'permit_type': row.get('permit_type', row.get('Permit Type', row.get('Type', ''))),
                    'permit_number': row.get('permit_number', row.get('Permit Number', row.get('Number', ''))),
                    'address': row.get('address', row.get('Address', '')),
                    'description': row.get('description', row.get('Description', ''))
                }

                # Skip empty rows
                if not any(permit.values()):
                    continue

                permits.append(permit)

    except Exception as e:
        print(f"Error reading {csv_path}: {e}")
        return []

    return permits

def upload_to_firebase(db, permits, city_name):
    """Upload permits to Firebase"""
    batch = db.batch()
    count = 0

    for permit in permits:
        # Create a document reference
        doc_ref = db.collection('admin_leads').document()

        # Add timestamp if not present
        if not permit.get('date'):
            permit['date'] = datetime.now().strftime('%Y-%m-%d')

        # Ensure city is set
        if not permit.get('city'):
            permit['city'] = city_name

        batch.set(doc_ref, permit)
        count += 1

        # Commit every 500 documents to avoid batch size limits
        if count % 500 == 0:
            batch.commit()
            batch = db.batch()
            print(f"Uploaded {count} permits for {city_name}...")

    # Commit remaining documents
    if count % 500 != 0:
        batch.commit()

    print(f"Completed uploading {count} permits for {city_name}")
    return count

def update_city_stats(db, city_name, total_leads):
    """Update city statistics in Firebase"""
    city_data = {
        'name': city_name,
        'leads': total_leads,
        'files': 1,  # You can modify this based on your needs
        'last_updated': datetime.now()
    }

    # Check if city already exists
    cities_ref = db.collection('admin_cities')
    query = cities_ref.where('name', '==', city_name).limit(1)
    docs = query.get()

    if docs:
        # Update existing
        doc_ref = docs[0].reference
        doc_ref.update(city_data)
    else:
        # Create new
        cities_ref.add(city_data)

    print(f"Updated stats for {city_name}: {total_leads} leads")

def main():
    if len(sys.argv) < 2:
        print("Usage: python upload_to_firebase.py <csv_file_path> [city_name]")
        print("Example: python upload_to_firebase.py /path/to/nashville.csv Nashville")
        sys.exit(1)

    csv_path = sys.argv[1]
    city_name = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(os.path.basename(csv_path))[0]

    if not os.path.exists(csv_path):
        print(f"Error: CSV file not found: {csv_path}")
        sys.exit(1)

    if not os.path.exists('serviceAccountKey.json'):
        print("Error: serviceAccountKey.json not found in current directory")
        sys.exit(1)

    print(f"Initializing Firebase...")
    db = initialize_firebase()

    print(f"Parsing CSV file: {csv_path}")
    permits = parse_csv_file(csv_path)

    if not permits:
        print("No permits found in CSV file")
        sys.exit(1)

    print(f"Found {len(permits)} permits. Uploading to Firebase...")

    # Clear existing data for this city (optional - comment out if you want to append)
    print(f"Clearing existing data for {city_name}...")
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
        print(f"Cleared {count} existing permits for {city_name}")

    # Upload new data
    total_uploaded = upload_to_firebase(db, permits, city_name)

    # Update city stats
    update_city_stats(db, city_name, total_uploaded)

    print(f"✅ Successfully uploaded {total_uploaded} permits for {city_name} to Firebase!")

if __name__ == "__main__":
    main()