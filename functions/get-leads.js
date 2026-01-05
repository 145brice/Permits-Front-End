const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const testEmail = 'your-email@example.com'; // Replace with your email

  try {
    // Find customer by email
    const customers = await stripe.customers.list({ email: testEmail });
    if (customers.data.length === 0) {
      return { statusCode: 403, body: 'No customer found' };
    }

    const customer = customers.data[0];

    // Check subscriptions
    const subscriptions = await stripe.subscriptions.list({ customer: customer.id });
    const activeSub = subscriptions.data.find(sub => sub.status === 'active');

    if (!activeSub) {
      return { statusCode: 403, body: 'No active subscription' };
    }

    // Return CSV
    const csv = `name,address,city\nJohn Doe,123 Main St,Austin\nJane Smith,456 Oak Ave,Chicago\n`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="leads.csv"'
      },
      body: csv
    };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};