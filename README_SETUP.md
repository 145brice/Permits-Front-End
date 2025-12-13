# Contractor Leads SaaS - Setup Guide

## 🚀 Lead Distribution System

This SaaS automatically distributes construction permit leads to subscribers using Firebase Cloud Functions and Stripe webhooks.

### Architecture Overview

1. **Scrapers** collect permit data from city APIs (Chicago, Philadelphia, etc.)
2. **Firestore** stores all leads with assignment tracking
3. **Stripe Webhooks** trigger lead assignment on subscription events
4. **Cloud Functions** assign 15 unique leads per customer per month
5. **Customer Dashboard** displays assigned leads on mobile-friendly interface

---

## 📋 Prerequisites

- Node.js 18+
- Python 3.8+
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project created
- Stripe account with products configured

---

## ⚙️ Setup Steps

### 1. Firebase Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Select:
# - Firestore
# - Functions
# - Hosting (optional)

# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 2. Configure Environment Variables

Download your Firebase service account key from Firebase Console:
- Go to Project Settings > Service Accounts
- Click "Generate New Private Key"
- Save as `serviceAccountKey.json` in project root

Set Firebase Functions config:

```bash
# Set Stripe secret key
firebase functions:config:set stripe.secret_key="sk_live_YOUR_STRIPE_SECRET_KEY"

# Set Stripe webhook secret
firebase functions:config:set stripe.webhook_secret="whsec_YOUR_WEBHOOK_SECRET"

# Deploy functions
cd functions
npm install
cd ..
firebase deploy --only functions
```

### 3. Configure Stripe Webhooks

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://us-central1-YOUR_PROJECT.cloudfunctions.net/stripeWebhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
5. Copy the webhook signing secret to Firebase config (step 2 above)

### 4. Add City Metadata to Stripe Products

For each Stripe product/price, add metadata:

```
city = philadelphia  (or chicago, houston, etc.)
```

This tells the system which city's leads to assign when a customer subscribes.

### 5. Import Leads to Firestore

Install Python Firebase Admin SDK:

```bash
pip3 install firebase-admin
```

Run the import script:

```bash
# Import all cities (last 30 days only)
python3 import_leads_to_firestore.py

# Import specific city
python3 import_leads_to_firestore.py --city philadelphia

# Clean old unassigned leads
python3 import_leads_to_firestore.py --clean
```

**Important:** The import script only imports leads from the last 30 days to respect Firestore limits.

### 6. Set Up Automated Scraping (Optional)

Create a cron job to scrape and import leads daily:

```bash
# Add to crontab (run daily at 3 AM)
0 3 * * * cd /path/to/contractor-leads-backend && python3 run_scrapers.py && cd ../contractor-leads-saas && python3 import_leads_to_firestore.py
```

---

## 🔐 Firestore Security Rules

The security rules are configured to:
- Users can only read their own data
- Users can only see leads assigned to them
- Only Cloud Functions can assign leads
- Only Cloud Functions can create subscriptions

---

## 📱 Customer Dashboard

The dashboard at `/dashboard/dashboard.html` provides:
- Mobile-first responsive design
- Tap-friendly interface for viewing leads on phone
- Real-time lead updates
- Sortable tables
- Per-city breakdown
- Account management

### Features:
- **Auto-refresh**: Leads update automatically when assigned
- **Mobile optimized**: Touch-friendly card layout on phones
- **Secure**: Firebase Authentication required
- **Fast**: Direct Firestore queries, no backend needed

---

## 🔄 Lead Assignment Flow

1. **Customer subscribes** via Stripe checkout
2. **Stripe webhook** fires `checkout.session.completed` event
3. **Cloud Function** receives webhook:
   - Creates user document
   - Creates subscription document
   - Queries for 15 unassigned leads in customer's city
   - Marks leads as assigned to customer
   - Creates assignment record
4. **Customer views dashboard** and sees their 15 new leads
5. **Monthly renewal**: Repeat steps 3-4 for fresh leads

### No Duplicates Guarantee

The system uses Firestore transactions to ensure:
- No two customers get the same lead
- Race conditions are prevented
- Exactly 15 leads per subscription (or max available)

---

## 📊 Data Structure

### Collections

**users**
```javascript
{
  email: "customer@example.com",
  stripe_customer_id: "cus_xxx",
  created_at: timestamp,
  updated_at: timestamp
}
```

**subscriptions**
```javascript
{
  user_id: "firebase_uid",
  email: "customer@example.com",
  city: "philadelphia",
  stripe_subscription_id: "sub_xxx",
  stripe_customer_id: "cus_xxx",
  status: "active",
  created_at: timestamp
}
```

**leads**
```javascript
{
  permit_number: "PHI-2025-12345",
  address: "123 Main St, Philadelphia, PA",
  type: "NEW CONSTRUCTION",
  value: "$250,000.00",
  issued_date: "2025-12-10",
  status: "Issued",
  city: "philadelphia",
  assigned_to: "firebase_uid" | null,
  assigned_date: timestamp | null,
  subscription_id: "sub_xxx" | null,
  imported_at: timestamp,
  source: "csv_scraper"
}
```

**lead_assignments**
```javascript
{
  user_id: "firebase_uid",
  city: "philadelphia",
  subscription_id: "sub_xxx",
  lead_count: 15,
  lead_ids: ["doc_id_1", "doc_id_2", ...],
  assigned_date: timestamp,
  delivered: false
}
```

---

## 🧪 Testing

### Test Stripe Webhook Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local function
stripe listen --forward-to localhost:5001/YOUR_PROJECT/us-central1/stripeWebhook

# Trigger test event
stripe trigger checkout.session.completed
```

### Test Lead Assignment

```bash
# Use Firebase Functions emulator
firebase emulators:start --only functions,firestore

# Call manualAssignLeads function
# (Requires authenticated user)
```

---

## 📈 Monitoring

View logs in Firebase Console:
- Functions > Logs
- Look for webhook events, assignment success/failures

Track metrics:
- Number of active subscriptions
- Leads assigned per city
- Assignment failures (when city runs out of leads)

---

## 🛠️ Maintenance

### Daily Tasks
- Run scrapers to collect new leads
- Import new leads to Firestore
- Clean old unassigned leads (30+ days)

### Weekly Tasks
- Monitor Firestore usage
- Check for cities running low on leads
- Review subscription churn

### Monthly Tasks
- Audit lead assignments
- Verify no duplicate assignments
- Check webhook delivery success rate

---

## 🚨 Troubleshooting

**Leads not being assigned:**
- Check Cloud Function logs
- Verify Stripe webhook is configured correctly
- Ensure city metadata is set on Stripe product
- Confirm leads exist in Firestore for that city

**Customer can't see leads:**
- Check Firestore security rules
- Verify user is authenticated
- Confirm leads have `assigned_to` field matching user ID

**Import failing:**
- Ensure `serviceAccountKey.json` exists
- Check CSV file paths are correct
- Verify Firebase Admin SDK is installed

---

## 📞 Support

For issues with the lead distribution system, check:
1. Firebase Console > Functions > Logs
2. Stripe Dashboard > Webhooks > Event delivery
3. Firestore Console > Leads collection

---

## 🔒 Security Notes

- Never commit `serviceAccountKey.json` to Git (in .gitignore)
- Keep Stripe secret keys in environment variables only
- Use Firestore security rules to prevent unauthorized access
- Rotate API keys periodically
- Monitor for unusual activity in Firebase Console
