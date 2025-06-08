const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_VOTRE_CLE_SECRETE_STRIPE');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { cart } = req.body;

  const line_items = cart.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: { name: item.nom },
      unit_amount: item.prix * 100, // prix en centimes
    },
    quantity: 1
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: 'https://votre-site.com/success',
    cancel_url: 'https://votre-site.com/cancel'
  });

  res.json({ id: session.id });
});

app.listen(4242, () => console.log('Serveur Stripe en ligne sur http://localhost:4242'));