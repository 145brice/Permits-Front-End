# 🚀 Quick Start - Deploy in 5 Minutes

## Option 1: Automated Setup Script (Recommended)

Run this one command in your terminal:

```bash
cd /Users/briceleasure/Desktop/contractor-leads-saas
./setup.sh
```

The script will:
1. ✅ Install Firebase CLI
2. ✅ Login to Firebase
3. ✅ Configure Stripe secret key
4. ✅ Deploy Firestore rules & indexes
5. ✅ Deploy Cloud Functions
6. ✅ Give you next steps

---

## Option 2: Manual Step-by-Step

### 1. Login to Firebase

```bash
npx firebase-tools login
```

### 2. Set Stripe Secret Key

```bash
# Get from: https://dashboard.stripe.com/apikeys
npx firebase-tools functions:config:set stripe.secret_key="sk_live_YOUR_KEY"
```

### 3. Deploy Everything

```bash
npx firebase-tools deploy
```

### 4. Configure Stripe Webhook

After deploy, your webhook URL will be:
```
https://us-central1-permits-19158.cloudfunctions.net/stripeWebhook
```

Go to https://dashboard.stripe.com/webhooks:
1. Click "Add endpoint"
2. Paste the URL above
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
4. Copy the signing secret (starts with `whsec_`)

### 5. Set Webhook Secret

```bash
npx firebase-tools functions:config:set stripe.webhook_secret="whsec_YOUR_SECRET"
npx firebase-tools deploy --only functions
```

### 6. Add City Metadata to Stripe Products

For EACH product in Stripe:
- Edit the price
- Add metadata: `city` = `philadelphia` (lowercase)
- Repeat for all cities: `chicago`, `houston`, `phoenix`, `san_antonio`, etc.

### 7. Import Leads

Download service account key:
1. Firebase Console → Project Settings → Service Accounts
2. "Generate new private key"
3. Save as `serviceAccountKey.json`

Then import:
```bash
pip3 install firebase-admin
python3 import_leads_to_firestore.py
```

---

## ✅ Verify It's Working

### Test 1: Check Cloud Functions
```bash
npx firebase-tools functions:log
```

### Test 2: Make a Test Purchase
1. Go to your Stripe checkout page
2. Use test card: 4242 4242 4242 4242
3. Check Firestore Console → `subscriptions` collection
4. Check Firestore Console → `leads` collection
5. Should see 15 leads assigned to customer

### Test 3: Customer Dashboard
1. Sign up: https://your-domain.com/dashboard/signup.html
2. Login: https://your-domain.com/dashboard/login.html
3. View dashboard: https://your-domain.com/dashboard/dashboard.html
4. Should see assigned leads!

---

## 🐛 Troubleshooting

**"Permission denied" installing Firebase CLI:**
```bash
sudo npm install -g firebase-tools
```

**"Not authenticated":**
```bash
npx firebase-tools login
```

**Webhook not working:**
- Check function logs: `npx firebase-tools functions:log`
- Verify webhook URL in Stripe matches deployed URL
- Check webhook secret is set: `npx firebase-tools functions:config:get`

**No leads showing:**
- Verify leads are imported: Check Firestore Console
- Verify subscription has city metadata
- Check function logs for assignment errors

---

## 📞 Need Help?

Check these:
1. **Firebase Console**: https://console.firebase.google.com/project/permits-19158
2. **Stripe Dashboard**: https://dashboard.stripe.com/webhooks
3. **Function Logs**: `npx firebase-tools functions:log`
4. **Firestore Data**: Firebase Console → Firestore Database

---

## 🎉 You're Done!

Once deployed:
- Customers subscribe → 15 leads assigned automatically
- Monthly renewal → 15 new leads assigned
- No duplicates ever (Firestore transactions handle this)
- Mobile-friendly dashboard for viewing leads
