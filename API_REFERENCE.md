# API Reference

## Base URL
```
Production: https://your-app.railway.app
Local: http://localhost:5000
```

## Endpoints

### 1. Health Check
Check if the server is running.

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T14:30:00.000Z"
}
```

---

### 2. Create Checkout Session
Create a Stripe checkout session for a city subscription.

```http
POST /create-checkout-session
Content-Type: application/json
```

**Request Body:**
```json
{
  "city": "nashville",
  "price_id": "price_1234567890"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Called by:** Frontend when user clicks a city button

---

### 3. Stripe Webhook
Handles Stripe events (checkout completed, payment failed, subscription cancelled).

```http
POST /webhook
Stripe-Signature: t=1234567890,v1=...
```

**Events Handled:**
- `checkout.session.completed` - New subscriber (sets active: true)
- `invoice.payment_failed` - Failed payment (sets active: false)
- `customer.subscription.deleted` - Cancellation (sets active: false)

**Response:**
```json
{
  "status": "success"
}
```

**Called by:** Stripe automatically

---

### 4. Manual Send (Testing Only)
Manually trigger the daily lead distribution (for testing).

```http
POST /manual-send
Authorization: Bearer your-admin-secret
```

**Response:**
```json
{
  "status": "sent"
}
```

**Example:**
```bash
curl -X POST https://your-app.railway.app/manual-send \
  -H "Authorization: Bearer test123"
```

**⚠️ Remove this endpoint in production or secure it properly**

---

## Automated Tasks

### Daily Lead Distribution
**Trigger:** Automatic cron job at 8:00 AM Central Time  
**Frequency:** Once daily  
**Process:**
1. Query Firestore for all subscribers where `active: true`
2. Group subscribers by city
3. Generate mock leads for each city (replace with real data)
4. Email each subscriber their city's leads
5. Email owner a master CSV with all active subscribers

**No API endpoint needed - runs automatically via APScheduler**

---

## Database Schema (Firestore)

### Collection: `subscribers`

**Document ID:** Stripe customer ID  
**Fields:**

```javascript
{
  email: string,              // Customer email
  city: string,               // "Nashville" | "Chattanooga" | "Austin" | "San Antonio"
  stripe_customer_id: string, // Stripe customer ID (same as doc ID)
  subscription_id: string,    // Stripe subscription ID
  active: boolean,            // true if paying, false if cancelled/failed
  created_at: timestamp,      // When they subscribed
  payment_failed_at: timestamp (optional),  // When payment failed
  cancelled_at: timestamp (optional)        // When they cancelled
}
```

**Example Document:**
```javascript
{
  email: "john@example.com",
  city: "Nashville",
  stripe_customer_id: "cus_1234567890",
  subscription_id: "sub_1234567890",
  active: true,
  created_at: Timestamp(2024, 1, 15, 10, 30, 0)
}
```

---

## Email Templates

### Subscriber Daily Email
**Subject:** `Your Daily {city} Contractor Leads - MM/DD/YYYY`  
**Content:** HTML table with leads  
**Frequency:** Daily at 8 AM Central

### Owner Daily Report
**Subject:** `Daily Subscriber Report - MM/DD/YYYY`  
**Content:** Summary + CSV attachment  
**Frequency:** Daily at 8 AM Central  
**Attachment:** `subscribers_YYYYMMDD.csv`

---

## Error Handling

All endpoints return standard HTTP status codes:

- `200` - Success
- `400` - Bad request (invalid payload)
- `401` - Unauthorized (invalid auth header)
- `500` - Server error

**Error Response Format:**
```json
{
  "error": "Error description"
}
```

---

## Testing Checklist

### Test Checkout Flow
1. Visit frontend
2. Click city button
3. Complete checkout with test card: `4242 4242 4242 4242`
4. Verify redirect to success page
5. Check Firestore for new subscriber
6. Check Stripe dashboard for webhook event

### Test Webhook
1. Complete a test checkout
2. Check Railway logs for webhook receipt
3. Verify data in Firestore
4. Cancel subscription in Stripe
5. Verify `active` set to false in Firestore

### Test Email Delivery
1. Call `/manual-send` endpoint
2. Check subscriber email inbox
3. Check owner email inbox
4. Verify CSV attachment received

### Test Failed Payment
1. In Stripe, manually fail an invoice
2. Check webhook fires
3. Verify `active: false` in Firestore
4. Verify subscriber stops getting emails

---

## Security Notes

- Stripe webhook signature verification is REQUIRED
- Never expose Stripe secret key in frontend
- Use environment variables for all secrets
- HTTPS only in production (Stripe webhooks require it)
- Manual send endpoint should be removed or properly secured in production

---

## Monitoring

### What to Monitor
- Railway logs for errors at 8 AM daily
- Stripe webhook events for failed deliveries
- SendGrid activity for bounced emails
- Firestore query costs (should be minimal)

### Key Metrics
- Active subscribers count
- Failed payment rate
- Email delivery rate
- Webhook success rate

---

## Troubleshooting

**Webhooks not working:**
- Check Railway logs for errors
- Verify webhook secret matches Stripe
- Ensure Railway URL is accessible
- Check Stripe webhook delivery attempts

**Emails not sending:**
- Verify SendGrid API key
- Check sender email is verified
- Review SendGrid activity feed
- Check subscriber email is valid

**Cron not running:**
- Railway automatically runs APScheduler
- Check Railway logs at 8:00 AM Central
- Verify timezone is set correctly
- Test with manual send endpoint

**Database errors:**
- Verify Firebase credentials
- Check Firestore is enabled
- Ensure network access to Firebase
- Review Firebase usage quotas
