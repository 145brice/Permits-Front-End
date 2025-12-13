#!/bin/bash
set -e

echo "🔥 Firebase Lead Distribution System - One-Click Deploy"
echo "========================================================"
echo ""

# Check if already logged in
if ! npx firebase-tools projects:list &>/dev/null; then
    echo "🔐 Opening Firebase login..."
    npx firebase-tools login
    echo ""
fi

# Check current project
echo "📋 Using Firebase project: permits-19158"
echo ""

# Prompt for Stripe keys if not set
echo "💳 Stripe Configuration"
echo "----------------------"
echo ""

CURRENT_CONFIG=$(npx firebase-tools functions:config:get 2>/dev/null || echo "{}")

if ! echo "$CURRENT_CONFIG" | grep -q "stripe"; then
    echo "Enter your Stripe SECRET key (sk_live_... or sk_test_...):"
    echo "(Get from: https://dashboard.stripe.com/apikeys)"
    read -r STRIPE_SECRET_KEY

    if [ ! -z "$STRIPE_SECRET_KEY" ]; then
        npx firebase-tools functions:config:set stripe.secret_key="$STRIPE_SECRET_KEY"
    fi
else
    echo "✓ Stripe secret key already configured"
fi
echo ""

# Deploy Firestore rules and indexes
echo "🚀 Deploying Firestore rules and indexes..."
npx firebase-tools deploy --only firestore:rules,firestore:indexes --project permits-19158

echo ""
echo "🚀 Deploying Cloud Functions..."
npx firebase-tools deploy --only functions --project permits-19158

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "======================"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. Configure Stripe Webhook:"
echo "   URL: https://us-central1-permits-19158.cloudfunctions.net/stripeWebhook"
echo ""
echo "   Go to: https://dashboard.stripe.com/webhooks"
echo "   - Click 'Add endpoint'"
echo "   - Paste URL above"
echo "   - Select events: checkout.session.completed, customer.subscription.created, customer.subscription.updated"
echo "   - Copy the webhook signing secret (whsec_...)"
echo ""
echo "2. Set webhook secret:"
echo "   npx firebase-tools functions:config:set stripe.webhook_secret=\"whsec_YOUR_SECRET\""
echo "   npx firebase-tools deploy --only functions --project permits-19158"
echo ""
echo "3. Add metadata to Stripe products:"
echo "   For each product → Edit price → Metadata → Add:"
echo "   Key: city"
echo "   Value: philadelphia (or chicago, houston, phoenix, etc.)"
echo ""
echo "4. Import leads:"
echo "   python3 import_leads_to_firestore.py"
echo ""
echo "🎉 Your system is live!"
