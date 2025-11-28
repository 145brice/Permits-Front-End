import os
import stripe
from flask import Flask, request, send_from_directory, jsonify, render_template_string, make_response, redirect
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
import firebase_admin
from firebase_admin import credentials, firestore
import warnings

# Suppress warnings
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=DeprecationWarning)

# === SETUP ===
app = Flask(__name__, static_folder='../')  # Frontend files are in root

# Environment variables - set these in .env or terminal
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', 'sk_test_...')
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET', 'whsec_...')
RESEND_API_KEY = os.getenv('RESEND_API_KEY', 're_...')
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY', 'SG....')
OWNER_EMAIL = os.getenv('OWNER_EMAIL', '145brice@gmail.com')
FROM_EMAIL = os.getenv('FROM_EMAIL', 'leads@yourdomain.com')
ADMIN_SECRET = os.getenv('ADMIN_SECRET', 'admin123')

# Stripe setup
stripe.api_key = STRIPE_SECRET_KEY
resend.api_key = RESEND_API_KEY

# Firebase setup
cred = credentials.Certificate(os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json'))
firebase_admin.initialize_app(cred)
db = firestore.client()

# Cities list - add new ones here
CITIES = ['nashville', 'chattanooga', 'austin', 'sanantonio', 'houston', 'charlotte', 'phoenix']  # expand forever

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
        
        # Save to Firestore
        doc_ref = db.collection('subscribers').document()
        doc_ref.set({
            'city': city,
            'email': email,
            'timestamp': datetime.datetime.now()
        })
        
        print(f"New subscriber: {email} for {city}")
        
        # Trigger scrape if city supported
        if city in CITIES:
            run_scraper(city)
        
    return '', 200

# === MANUAL SCRAPE ENDPOINT ===
@app.route('/manual_scrape', methods=['GET'])
def manual_scrape_endpoint():
    secret = request.args.get('secret')
    if secret != ADMIN_SECRET:
        return jsonify({"error": "Unauthorized"}), 403
    manual_scrape()
    return jsonify({"status": "Manual scrape completed"})

# === 2. CITY SCRAPER MANAGER ===
def run_scraper(city):
    scraper_path = f'scrapers/{city}.py'
    if os.path.exists(scraper_path):
        try:
            subprocess.run(['python3', scraper_path, city], check=True)
        except subprocess.CalledProcessError as e:
            # Email alert on failure
            message = Mail(
                from_email=FROM_EMAIL,
                to_emails=[OWNER_EMAIL],
                subject=f'ALERT: {city} scrape FAILED at {time.ctime()}',
                plain_text_content=f'Site returned error. Fix ASAP. Error: {e}'
            )
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            sg.send(message)
    else:
        print(f'No scraper for {city}')

def manual_scrape():
    """Run all scrapers once manually"""
    for city in CITIES:
        run_scraper(city)
    print("Manual scrape completed. Check leads/ folder for today's data.")

# === 3. DAILY EMAIL & STORAGE ===
@app.route('/daily')
def send_daily():
    for city in CITIES:
        # Find yesterday's CSV
        yesterday = (datetime.date.today() - datetime.timedelta(days=1)).isoformat()
        csv_path = f'leads/{city}/{yesterday}_{city}.csv'
        if os.path.exists(csv_path):
            # Get subscribers from Firestore
            subscribers_ref = db.collection('subscribers').where('city', '==', city)
            docs = subscribers_ref.stream()
            
            # Read CSV
            df = pd.read_csv(csv_path)
            leads_data = df.to_dict('records')
            
            for doc in docs:
                subscriber = doc.to_dict()
                email = subscriber['email']
                
                # Store leads for this subscriber
                leads_ref = db.collection('user_leads').document(email).collection('leads')
                for lead in leads_data:
                    lead_doc = {
                        'city': city,
                        'date': yesterday,
                        'permit_number': lead.get('permit_number', ''),
                        'address': lead.get('address', ''),
                        'type': lead.get('type', ''),
                        'value': lead.get('value', ''),
                        'created_at': datetime.datetime.now()
                    }
                    # Use permit number + city + date as unique ID
                    doc_id = f"{lead.get('permit_number', 'unknown')}_{city}_{yesterday}".replace('/', '_')
                    leads_ref.document(doc_id).set(lead_doc)
                
                # Send email
                html_table = df.to_html(index=False)
                message = Mail(
                    from_email=FROM_EMAIL,
                    to_emails=[email],
                    subject=f'{city.capitalize()} Permits - {datetime.date.today()}',
                    html_content=f'<h2>Yesterday\'s leads for {city}:</h2>{html_table}'
                )
                sg = SendGridAPIClient(SENDGRID_API_KEY)
                sg.send(message)
    
    return 'Sent and stored', 200

# === 4. AUTHENTICATION ===
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        if email:
            # Check if email exists in subscribers
            subscribers_ref = db.collection('subscribers').where('email', '==', email)
            docs = subscribers_ref.stream()
            if len(list(docs)) > 0:
                # Create session (simple cookie-based)
                response = make_response(redirect('/dashboard'))
                response.set_cookie('user_email', email, max_age=30*24*3600)  # 30 days
                return response
            else:
                return render_template_string(LOGIN_TEMPLATE, error="Email not found in subscribers")
        return render_template_string(LOGIN_TEMPLATE, error="Please enter an email")
    
    return render_template_string(LOGIN_TEMPLATE)

@app.route('/logout')
def logout():
    response = make_response(redirect('/'))
    response.delete_cookie('user_email')
    return response

# === 5. DASHBOARD ===
@app.route('/dashboard')
def dashboard():
    email = request.cookies.get('user_email')
    if not email:
        return redirect('/login')
    
    # Get user's cities
    subscribers_ref = db.collection('subscribers').where('email', '==', email)
    docs = subscribers_ref.stream()
    user_cities = [doc.to_dict()['city'] for doc in docs]
    
    # Get leads grouped by date and city
    leads_ref = db.collection('user_leads').document(email).collection('leads')
    leads_docs = leads_ref.order_by('date', direction=firestore.Query.DESCENDING).stream()
    
    leads_by_date = {}
    for doc in leads_docs:
        lead = doc.to_dict()
        date = lead['date']
        city = lead['city']
        if date not in leads_by_date:
            leads_by_date[date] = {}
        if city not in leads_by_date[date]:
            leads_by_date[date][city] = []
        leads_by_date[date][city].append(lead)
    
    return render_template_string(DASHBOARD_TEMPLATE, 
                                email=email, 
                                user_cities=user_cities, 
                                leads_by_date=leads_by_date)

# === 6. FRONTEND SERVE ===
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
            # Sleep random seconds between 0 and 1800 (30 minutes) for no pattern
            target_sec = random.randint(0, 1800)
            time.sleep(target_sec)
            
            for city in CITIES:
                run_scraper(city)
            
            # Sleep until next day 5 AM
            time.sleep(24 * 3600 - (time.time() % (24 * 3600)) + 5 * 3600)
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

# === HTML TEMPLATES ===
LOGIN_TEMPLATE = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Contractor Leads</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        h1 { color: #1e293b; margin-bottom: 10px; }
        p { color: #64748b; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; text-align: left; }
        label { display: block; margin-bottom: 5px; color: #374151; font-weight: 500; }
        input { 
            width: 100%; 
            padding: 12px; 
            border: 2px solid #e2e8f0; 
            border-radius: 8px; 
            font-size: 16px;
        }
        input:focus { outline: none; border-color: #667eea; }
        .btn { 
            background: #667eea; 
            color: white; 
            padding: 12px 30px; 
            border: none; 
            border-radius: 8px; 
            font-size: 16px; 
            font-weight: 600; 
            cursor: pointer; 
            width: 100%;
            margin-top: 10px;
        }
        .btn:hover { background: #5a67d8; }
        .error { color: #e53e3e; margin-bottom: 15px; font-size: 14px; }
        .back-link { display: block; margin-top: 20px; color: #667eea; text-decoration: none; }
        .back-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 Login to Your Dashboard</h1>
        <p>Access all your historical leads</p>
        
        {% if error %}
        <div class="error">{{ error }}</div>
        {% endif %}
        
        <form method="POST">
            <div class="form-group">
                <label for="email">Subscriber Email</label>
                <input type="email" id="email" name="email" required placeholder="your@email.com">
            </div>
            <button type="submit" class="btn">Login</button>
        </form>
        
        <a href="/" class="back-link">← Back to Home</a>
    </div>
</body>
</html>
'''

DASHBOARD_TEMPLATE = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Contractor Leads</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            background: #f8fafc;
            color: #1e293b;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h1 { margin: 0; }
        .logout-btn {
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 14px;
        }
        .logout-btn:hover { background: rgba(255,255,255,0.3); }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-number { font-size: 32px; font-weight: 800; color: #667eea; }
        .stat-label { color: #64748b; margin-top: 5px; }
        
        .date-section {
            background: white;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .date-header {
            background: #f1f5f9;
            padding: 15px 20px;
            border-bottom: 1px solid #e2e8f0;
            font-weight: 600;
            color: #374151;
        }
        
        .city-section {
            margin-bottom: 20px;
            border-left: 4px solid #667eea;
            background: #f8fafc;
        }
        .city-header {
            padding: 10px 15px;
            font-weight: 600;
            color: #667eea;
            background: #e0e7ff;
        }
        
        .leads-table {
            width: 100%;
            border-collapse: collapse;
        }
        .leads-table th {
            background: #f8fafc;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e2e8f0;
        }
        .leads-table td {
            padding: 12px;
            border-bottom: 1px solid #f1f5f9;
        }
        .leads-table tr:hover { background: #f8fafc; }
        
        .permit-number { font-weight: 600; color: #667eea; }
        .address { color: #374151; }
        .permit-type { 
            background: #dbeafe; 
            color: #1e40af; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 12px; 
            font-weight: 600; 
        }
        .value { font-weight: 700; color: #059669; }
        
        .no-leads {
            text-align: center;
            padding: 40px;
            color: #64748b;
        }
        
        @media (max-width: 768px) {
            .header { flex-direction: column; gap: 10px; text-align: center; }
            .stats { grid-template-columns: 1fr; }
            .leads-table { font-size: 14px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Your Contractor Leads Dashboard</h1>
        <a href="/logout" class="logout-btn">Logout</a>
    </div>
    
    <div class="container">
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">{{ user_cities|length }}</div>
                <div class="stat-label">Cities Subscribed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{{ leads_by_date|length }}</div>
                <div class="stat-label">Days of Leads</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">
                    {% set total_leads = 0 %}
                    {% for date, cities in leads_by_date.items() %}
                        {% for city, leads in cities.items() %}
                            {% set total_leads = total_leads + leads|length %}
                        {% endfor %}
                    {% endfor %}
                    {{ total_leads }}
                </div>
                <div class="stat-label">Total Leads</div>
            </div>
        </div>
        
        {% if leads_by_date %}
            {% for date, cities in leads_by_date.items() %}
            <div class="date-section">
                <div class="date-header">📅 {{ date }}</div>
                
                {% for city, leads in cities.items() %}
                <div class="city-section">
                    <div class="city-header">{{ city.title() }} ({{ leads|length }} leads)</div>
                    
                    <table class="leads-table">
                        <thead>
                            <tr>
                                <th>Permit #</th>
                                <th>Address</th>
                                <th>Type</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {% for lead in leads %}
                            <tr>
                                <td><span class="permit-number">{{ lead.permit_number }}</span></td>
                                <td><span class="address">{{ lead.address }}</span></td>
                                <td><span class="permit-type">{{ lead.type }}</span></td>
                                <td><span class="value">{{ lead.value }}</span></td>
                            </tr>
                            {% endfor %}
                        </tbody>
                    </table>
                </div>
                {% endfor %}
            </div>
            {% endfor %}
        {% else %}
            <div class="no-leads">
                <h3>No leads yet</h3>
                <p>Your first daily leads will appear here tomorrow morning at 8 AM.</p>
            </div>
        {% endif %}
    </div>
</body>
</html>
'''