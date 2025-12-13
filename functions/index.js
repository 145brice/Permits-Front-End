const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret_key);

admin.initializeApp();
const db = admin.firestore();

/**
 * Stripe Webhook Handler
 * Listens for checkout.session.completed and customer.subscription.created events
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = functions.config().stripe.webhook_secret;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle successful checkout
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await handleCheckoutComplete(session);
    }

    // Handle new subscription
    if (event.type === 'customer.subscription.created') {
      const subscription = event.data.object;
      await handleSubscriptionCreated(subscription);
    }

    // Handle subscription updated (renewal)
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      if (subscription.status === 'active') {
        await handleSubscriptionRenewal(subscription);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Webhook processing failed');
  }
});

/**
 * Handle completed checkout session
 */
async function handleCheckoutComplete(session) {
  console.log('Processing checkout completion:', session.id);

  const customerId = session.customer;
  const customerEmail = session.customer_details?.email;
  const subscriptionId = session.subscription;

  // Get city from metadata (must be set in Stripe product metadata)
  const city = session.metadata?.city;

  if (!city) {
    console.error('No city found in checkout session metadata');
    return;
  }

  // Create or update user document
  const userRef = db.collection('users').doc(customerId);
  await userRef.set({
    email: customerEmail,
    stripe_customer_id: customerId,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_at: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  // Create subscription document
  await db.collection('subscriptions').doc(subscriptionId).set({
    user_id: customerId,
    email: customerEmail,
    city: city,
    stripe_subscription_id: subscriptionId,
    stripe_customer_id: customerId,
    status: 'active',
    created_at: admin.firestore.FieldValue.serverTimestamp()
  });

  // Assign initial 15 leads
  await assignLeadsToCustomer(customerId, city, subscriptionId);

  console.log(`Successfully processed checkout for ${customerEmail} - ${city}`);
}

/**
 * Handle subscription created
 */
async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id);
  // Logic already handled in checkout.session.completed
  // This is a backup handler
}

/**
 * Handle subscription renewal (monthly)
 */
async function handleSubscriptionRenewal(subscription) {
  console.log('Subscription renewed:', subscription.id);

  const subDoc = await db.collection('subscriptions').doc(subscription.id).get();
  if (!subDoc.exists) {
    console.error('Subscription not found in database:', subscription.id);
    return;
  }

  const subData = subDoc.data();
  await assignLeadsToCustomer(subData.user_id, subData.city, subscription.id);

  console.log(`Assigned new leads for renewal: ${subData.email} - ${subData.city}`);
}

/**
 * Core function: Assign 15 unique leads to a customer
 * Uses Firestore transaction to prevent race conditions
 */
async function assignLeadsToCustomer(userId, city, subscriptionId) {
  console.log(`Assigning leads for user ${userId}, city ${city}`);

  const leadsToAssign = 15;

  return db.runTransaction(async (transaction) => {
    // Query for unassigned leads in this city
    const leadsQuery = db.collection('leads')
      .where('city', '==', city.toLowerCase())
      .where('assigned_to', '==', null)
      .orderBy('issued_date', 'desc')
      .limit(leadsToAssign);

    const snapshot = await transaction.get(leadsQuery);

    if (snapshot.empty) {
      throw new Error(`No unassigned leads available for ${city}`);
    }

    if (snapshot.size < leadsToAssign) {
      console.warn(`Only ${snapshot.size} leads available for ${city}, requested ${leadsToAssign}`);
    }

    const assignedLeads = [];
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    // Mark each lead as assigned
    snapshot.forEach((doc) => {
      transaction.update(doc.ref, {
        assigned_to: userId,
        assigned_date: timestamp,
        subscription_id: subscriptionId,
        status: 'assigned'
      });

      assignedLeads.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Create assignment record
    const assignmentRef = db.collection('lead_assignments').doc();
    transaction.set(assignmentRef, {
      user_id: userId,
      city: city,
      subscription_id: subscriptionId,
      lead_count: assignedLeads.length,
      lead_ids: assignedLeads.map(l => l.id),
      assigned_date: timestamp,
      delivered: false
    });

    console.log(`Successfully assigned ${assignedLeads.length} leads to ${userId}`);

    // TODO: Trigger email notification with leads
    return assignedLeads;
  });
}

/**
 * Manual lead assignment function (for testing or admin use)
 */
exports.manualAssignLeads = functions.https.onCall(async (data, context) => {
  // Require authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { userId, city } = data;

  if (!userId || !city) {
    throw new functions.https.HttpsError('invalid-argument', 'userId and city required');
  }

  try {
    const leads = await assignLeadsToCustomer(userId, city, 'manual');
    return { success: true, leadCount: leads.length };
  } catch (error) {
    console.error('Manual assignment error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Get customer's assigned leads
 */
exports.getMyLeads = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const userId = context.auth.uid;

  try {
    const leadsSnapshot = await db.collection('leads')
      .where('assigned_to', '==', userId)
      .orderBy('assigned_date', 'desc')
      .get();

    const leads = [];
    leadsSnapshot.forEach(doc => {
      leads.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, leads };
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
