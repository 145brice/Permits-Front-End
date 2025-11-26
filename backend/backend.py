import os
import stripe
from flask import Flask, request, send_from_directory, jsonify
import subprocess
import json
import datetime
import pandas as pd
import time
import random
import csv
from io import StringIO
import resend
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

# === SETUP ===
app = Flask(__name__, static_folder='../frontend')  # Adjust path to frontend

# Environment variables - set these in .env or terminal
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', 'sk_test_...')
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET', 'whsec_...')
RESEND_API_KEY = os.getenv('RESEND_API_KEY', 're_...')
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY', 'SG....')
OWNER_EMAIL = os.getenv('OWNER_EMAIL', 'your@email.com')
FROM_EMAIL = os.getenv('FROM_EMAIL', 'leads@yourdomain.com')
ADMIN_SECRET = os.getenv('ADMIN_SECRET', 'admin123')

# Stripe setup
stripe.api_key = STRIPE_SECRET_KEY
resend.api_key = RESEND_API_KEY

# Cities list - add new ones here
CITIES = ['nashville', 'chattanooga', 'austin', 'sanantonio']  # expand forever

# Create folders
os.makedirs('cities', exist_ok=True)
os.makedirs('leads', exist_ok=True)
os.makedirs('subs', exist_ok=True)

# === 1. STRIPE WEBHOOK ===
@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')
    event = None
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return 'Invalid payload', 400
    except stripe.error.SignatureVerificationError:
        return 'Invalid signature', 400

    if event['type'] == 'checkout.session.completed':
        data = event['data']['object']
        email = data['customer_details']['email']
        city = data['metadata']['city'].lower()
        
        # Save to local CSV
        subs_file = f'subs/{city}.csv'
        with open(subs_file, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([city, email, datetime.datetime.now().isoformat()])
        
        print(f"New subscriber: {email} for {city}")
        
        # Trigger scrape if city supported
        if city in CITIES:
            run_scraper(city)
        
    return '', 200

# === 2. CITY SCRAPER MANAGER ===
def run_scraper(city):
    scraper_path = f'scrapers/{city}.py'
    if os.path.exists(scraper_path):
        try:
            subprocess.run(['python', scraper_path, city], check=True)
        except subprocess.CalledProcessError as e:
            # Email alert on failure
            resend.Emails.send(
                from_='alert@yourdomain.com',
                to=OWNER_EMAIL,
                subject=f'ALERT: {city} scrape FAILED at {time.ctime()}',
                text=f'Site returned error. Fix ASAP. Error: {e}'
            )
    else:
        print(f'No scraper for {city}')

# === 3. DAILY EMAIL ===
@app.route('/daily')
def send_daily():
    for city in CITIES:
        # Find yesterday's CSV
        yesterday = (datetime.date.today() - datetime.timedelta(days=1)).isoformat()
        csv_path = f'leads/{city}/{yesterday}.csv'
        if os.path.exists(csv_path):
            # Get subscribers
            subs_file = f'subs/{city}.csv'
            emails = []
            if os.path.exists(subs_file):
                with open(subs_file, 'r') as f:
                    reader = csv.reader(f)
                    for row in reader:
                        if len(row) >= 2:
                            emails.append(row[1])
            
            if emails:
                # Read CSV
                df = pd.read_csv(csv_path)
                html_table = df.to_html(index=False)
                
                # Send email
                message = Mail(
                    from_email=FROM_EMAIL,
                    to_emails=emails,
                    subject=f'{city.capitalize()} Permits - {datetime.date.today()}',
                    html_content=f'<h2>Yesterday\'s leads for {city}:</h2>{html_table}'
                )
                sg = SendGridAPIClient(SENDGRID_API_KEY)
                sg.send(message)
    
    return 'Sent', 200

# === 4. FRONTEND SERVE ===
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# === 5. RANDOM MORNING SCRAPER DAEMON ===
def random_morning_scrape():
    while True:
        now = time.localtime()
        if 5 <= now.tm_hour < 6:
            sleep_minutes = random.randint(0, 30)
            target_sec = (sleep_minutes * 60) + random.randint(0, 30)
            time.sleep(target_sec)
            
            for city in CITIES:
                run_scraper(city)
            
            # Sleep until next day
            time.sleep(24 * 3600 - (time.time() % (24 * 3600)) + 5 * 3600)  # Next 5 AM
        else:
            time.sleep(60)  # Check every minute

# === RUN ===
if __name__ == '__main__':
    # Start scraper daemon in background thread
    import threading
    scraper_thread = threading.Thread(target=random_morning_scrape, daemon=True)
    scraper_thread.start()
    
    # Run as background process if not debug
    if 'DEBUG' in os.environ:
        app.run(port=8080, debug=True)
    else:
        pid = os.fork()
        if pid > 0:
            print(f'Server running (PID {pid}) – close with: kill {pid}')
            with open('.server.pid', 'w') as f:
                f.write(str(pid))
            exit()
        app.run(port=8080, threaded=True)