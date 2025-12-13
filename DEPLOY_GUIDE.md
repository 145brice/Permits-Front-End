# Quick Deploy Guide

## 🚀 Deploy the Lead Distribution System

### Step 1: Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Set Stripe Configuration

You need to configure your Stripe keys for the Cloud Functions:

```bash
# Set your Stripe SECRET key (from Stripe Dashboard)
firebase functions:config:set stripe.secret_key="sk_live_YOUR_STRIPE_SECRET_KEY_HERE"

# Set your Stripe WEBHOOK secret (you'll get this after creating the webhook endpoint)
firebase functions:config:set stripe.webhook_secret="whsec_YOUR_WEBHOOK_SECRET_HERE"
```

**Where to find these:**
- **Stripe Secret Key**: Stripe Dashboard → Developers → API Keys → Secret key
- **Webhook Secret**: Create webhook endpoint first (Step 4), then you'll get this

### Step 3: Deploy Firestore Rules & Functions

```bash
# Deploy everything
firebase deploy
```

This will deploy:
- Firestore security rules
- Firestore indexes
- Cloud Functions (including the Stripe webhook handler)

### Step 4: Configure Stripe Webhook

After deploying, you'll get a webhook URL like:
```
https://us-central1-permits-19158.cloudfunctions.net/stripeWebhook
```

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Paste your webhook URL
4. Select these events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
5. Click "Add endpoint"
6. **Copy the webhook signing secret** (starts with `whsec_`)
7. Set it in Firebase:
   ```bash
   firebase functions:config:set stripe.webhook_secret="whsec_YOUR_SECRET_HERE"
   firebase deploy --only functions
   ```

### Step 5: Add City Metadata to Stripe Products

For EACH of your Stripe products (Philadelphia, Chicago, etc.):

1. Go to Stripe Dashboard → Products
2. Click on a product (e.g., "Philadelphia Leads")
3. Click the price → "Edit price"
4. Scroll to "Metadata" section
5. Add metadata:
   - **Key**: `city`
   - **Value**: `philadelphia` (lowercase, no spaces)
6. Save
7. Repeat for ALL cities

**Example metadata values:**
- Philadelphia → `city: philadelphia`
- Chicago → `city: chicago`
- Houston → `city: houston`
- Phoenix → `city: phoenix`
- San Antonio → `city: san_antonio`

### Step 6: Import Leads to Firestore

First, get your Firebase Admin credentials:

1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the file as `serviceAccountKey.json` in your project root

Then run the import:

```bash
# Install Python Firebase Admin SDK
pip3 install firebase-admin

# Import all cities (last 30 days only)
python3 import_leads_to_firestore.py
```

### Step 7: Test the System

1. **Test webhook delivery:**
   - Go to Stripe Dashboard → Webhooks
   - Click on your webhook endpoint
   - Send a test event: `checkout.session.completed`
   - Check Cloud Function logs: `firebase functions:log`

2. **Test lead assignment:**
   - Make a test purchase using Stripe test mode
   - Check Firestore Console → `subscriptions` collection
   - Check Firestore Console → `leads` collection (should see `assigned_to` field populated)

3. **Test customer dashboard:**
   - Sign up with test account at `/dashboard/signup.html`
   - Make test purchase
   - Log in at `/dashboard/login.html`
   - Check dashboard at `/dashboard/dashboard.html`
   - Should see 15 assigned leads

## 🔧 Useful Commands

```bash
# View Cloud Function logs
firebase functions:log

# Deploy only functions
firebase deploy --only functions

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# View current config
firebase functions:config:get

# Test functions locally
firebase emulators:start --only functions,firestore
```

## 🐛 Troubleshooting

**Leads not being assigned:**
```bash
# Check function logs
firebase functions:log

# Look for errors in the stripeWebhook function
```

**Webhook not receiving events:**
- Verify webhook URL in Stripe Dashboard matches deployed function URL
- Check that webhook secret is set correctly: `firebase functions:config:get`
- Ensure events are selected: `checkout.session.completed`, etc.

**Customer can't see leads:**
- Verify user is logged in (Firebase Auth)
- Check Firestore rules are deployed: `firebase deploy --only firestore:rules`
- Check that leads have `assigned_to` field matching user UID

## 📊 Monitor System

- **Firestore Usage**: Firebase Console → Firestore → Usage
- **Function Executions**: Firebase Console → Functions → Dashboard
- **Webhook Events**: Stripe Dashboard → Webhooks → Events log
- **Subscriptions**: Firestore Console → `subscriptions` collection
- **Lead Assignments**: Firestore Console → `lead_assignments` collection

## 🔒 Security Checklist

- ✅ `serviceAccountKey.json` is in `.gitignore`
- ✅ Stripe secret keys are in Firebase Functions config (not in code)
- ✅ Firestore security rules are deployed
- ✅ Webhook secret is configured
- ✅ Firebase Auth is enabled for dashboard access

## 🎉 You're Live!

Once deployed:
1. Customers subscribe via Stripe checkout
2. Webhook fires and assigns 15 leads automatically
3. Customer logs into dashboard and sees their leads
4. Monthly renewals = new leads assigned automatically
5. No duplicates, ever! (thanks to Firestore transactions)
