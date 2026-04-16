app.post("/create-checkout-session", async (req, res) => {
  try {
    const { product } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        },
      ],

      // 💸 THIS IS YOUR CUT SYSTEM
      payment_intent_data: {
        application_fee_amount: Math.floor(product.price * 100 * 0.20), // 20% Harmora cut
      },

      // ⚠️ for now (no connected accounts yet)
      // later we add:
      // transfer_data: { destination: "ARTIST_STRIPE_ACCOUNT_ID" }

      success_url: `${process.env.FRONTEND_URL}`,
      cancel_url: `${process.env.FRONTEND_URL}`,
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  }
});
