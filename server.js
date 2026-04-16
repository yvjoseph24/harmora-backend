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
import express from "express";
import cors from "cors";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const app = express();

app.use(cors({ origin: "https://YOUR-VERCEL.vercel.app" }));
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// VERIFY SONG PRICE FROM DB (NO TRUST FRONTEND)
app.post("/pay", async (req,res)=>{

  const { songId } = req.body;

  const { data: song } = await supabase
    .from("songs")
    .select("*")
    .eq("id", songId)
    .single();

  if(!song) return res.status(404).json({error:"not found"});

  const session = await stripe.checkout.sessions.create({
    mode:"payment",
    payment_method_types:["card"],
    line_items:[{
      price_data:{
        currency:"usd",
        product_data:{ name:song.title },
        unit_amount:song.price * 100
      },
      quantity:1
    }],
    success_url:"https://YOUR-VERCEL.vercel.app",
    cancel_url:"https://YOUR-VERCEL.vercel.app"
  });

  res.json({ url:session.url });
});

app.listen(3000,()=>console.log("server running"));
