#!/bin/bash

echo "🔥 Firebase Lead Distribution System - Setup Script"
echo "===================================================="
echo ""

# Check if Firebase CLI is available
if ! command -v firebase &> /dev/null; then
    echo "📦 Installing Firebase CLI..."
    sudo npm install -g firebase-tools
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Firebase CLI"
        echo "Try running: sudo npm install -g firebase-tools"
        exit 1
    fi
fi

# Login to Firebase
echo ""
echo "🔐 Step 1: Login to Firebase"
echo "----------------------------"
firebase login

if [ $? -ne 0 ]; then
    echo "❌ Firebase login failed"
    exit 1
fi

# Set Stripe configuration
echo ""
echo "💳 Step 2: Configure Stripe Keys"
echo "--------------------------------"
echo ""
echo "Please enter your Stripe SECRET key (sk_live_... or sk_test_...):"
read -r STRIPE_SECRET_KEY

if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "⚠️  Skipping Stripe secret key setup"
else
    firebase functions:config:set stripe.secret_key="$STRIPE_SECRET_KEY"
fi

echo ""
echo "⚠️  Note: You'll need to add the webhook secret after deployment"
echo "   We'll deploy first to get the webhook URL"
echo ""

# Deploy Firestore rules and indexes
echo ""
echo "🚀 Step 3: Deploy Firestore Rules & Indexes"
echo "-------------------------------------------"
firebase deploy --only firestore:rules,firestore:indexes

if [ $? -ne 0 ]; then
    echo "❌ Firestore deployment failed"
    exit 1
fi

# Deploy Cloud Functions
echo ""
echo "🚀 Step 4: Deploy Cloud Functions"
echo "---------------------------------"
firebase deploy --only functions

if [ $? -ne 0 ]; then
    echo "❌ Functions deployment failed"
    exit 1
fi

# Get the webhook URL
echo ""
echo "✅ Deployment Complete!"
echo "======================"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Your Stripe webhook URL is:"
echo "   https://us-central1-permits-19158.cloudfunctions.net/stripeWebhook"
echo ""
echo "2. Set up Stripe webhook:"
echo "   - Go to: https://dashboard.stripe.com/webhooks"
echo "   - Click 'Add endpoint'"
echo "   - Paste the URL above"
echo "   - Select events: checkout.session.completed, customer.subscription.created, customer.subscription.updated"
echo "   - Copy the webhook signing secret (whsec_...)"
echo ""
echo "3. Set the webhook secret:"
echo "   firebase functions:config:set stripe.webhook_secret=\"whsec_YOUR_SECRET\""
echo "   firebase deploy --only functions"
echo ""
echo "4. Add metadata to Stripe products:"
echo "   For each product, add metadata: city = philadelphia (or chicago, houston, etc.)"
echo ""
echo "5. Import leads to Firestore:"
echo "   - Download serviceAccountKey.json from Firebase Console"
echo "   - Run: python3 import_leads_to_firestore.py"
echo ""
echo "🎉 Your lead distribution system is ready!"
