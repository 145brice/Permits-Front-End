#!/usr/bin/env python3
"""
Extract leads data from populate-admin-data.html and upload to Firebase
"""

import re
import json
import firebase_admin
from firebase_admin import credentials, firestore

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        firebase_admin.get_app()
    except ValueError:
        cred = credentials.Certificate('serviceAccountKey.json')
        firebase_admin.initialize_app(cred)
    return firestore.client()

def extract_leads_data(html_file_path):
    """Extract leadsData array from HTML file"""
    with open(html_file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Find the leadsData array
    start_pattern = r'const leadsData = \[([\s\S]*?)\];'
    match = re.search(start_pattern, content)

    if not match:
        raise ValueError("Could not find leadsData array in HTML file")

    array_content = match.group(1)

    # Extract individual objects
    leads = []
    object_pattern = r'\{([^}]+)\}'

    for obj_match in re.finditer(object_pattern, array_content):
        obj_str = obj_match.group(1)

        # Skip comments
        if '//' in obj_str or '/*' in obj_str:
            continue

        # Parse the object
        obj_dict = {}
        pairs = re.findall(r"(\w+):\s*'([^']*)'", obj_str)

        for key, value in pairs:
            obj_dict[key] = value

        if obj_dict:  # Only add non-empty objects
            leads.append(obj_dict)

    return leads

def upload_leads_to_firebase(db, leads):
    """Upload leads to Firebase"""
    batch = db.batch()
    count = 0

    # Clear existing data first
    print("Clearing existing admin_leads collection...")
    leads_ref = db.collection('admin_leads')
    docs = leads_ref.stream()
    for doc in docs:
        batch.delete(doc.reference)
        count += 1
        if count >= 500:  # Firestore batch limit
            batch.commit()
            batch = db.batch()
            count = 0

    if count > 0:
        batch.commit()

    print("Uploading new leads data...")
    batch = db.batch()
    count = 0

    for lead in leads:
        doc_ref = db.collection('admin_leads').document()
        batch.set(doc_ref, lead)
        count += 1

        if count >= 500:  # Firestore batch limit
            batch.commit()
            batch = db.batch()
            count = 0

    if count > 0:
        batch.commit()

    return len(leads)

def update_city_stats(db):
    """Update city statistics in admin_cities collection"""
    leads_ref = db.collection('admin_leads')
    cities_ref = db.collection('admin_cities')

    # Get all cities and their lead counts
    cities_data = {}
    docs = leads_ref.stream()

    for doc in docs:
        data = doc.to_dict()
        city = data.get('city', '')
        if city:
            if city not in cities_data:
                cities_data[city] = 0
            cities_data[city] += 1

    # Update city stats
    batch = db.batch()
    count = 0

    for city, lead_count in cities_data.items():
        city_doc = cities_ref.document(city)
        batch.set(city_doc, {
            'name': city,
            'leads': lead_count,
            'files': 1  # Assuming 1 file per city for now
        })
        count += 1

        if count >= 500:
            batch.commit()
            batch = db.batch()
            count = 0

    if count > 0:
        batch.commit()

    print(f"Updated stats for {len(cities_data)} cities")
    return cities_data

def main():
    html_file = 'populate-admin-data.html'

    try:
        print("Initializing Firebase...")
        db = initialize_firebase()

        print("Extracting leads data from HTML file...")
        leads = extract_leads_data(html_file)
        print(f"Found {len(leads)} leads to upload")

        print("Uploading leads to Firebase...")
        uploaded_count = upload_leads_to_firebase(db, leads)
        print(f"Successfully uploaded {uploaded_count} leads")

        print("Updating city statistics...")
        city_stats = update_city_stats(db)

        print("\nUpload complete!")
        print("City breakdown:")
        for city, count in sorted(city_stats.items()):
            print(f"  {city}: {count} leads")

    except Exception as e:
        print(f"Error: {e}")
        return 1

    return 0

if __name__ == '__main__':
    exit(main())