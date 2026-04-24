import Stripe from "stripe";

export const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY ?? '',
    {
        apiVersion: "2026-03-25.dahlia",
        appInfo: {
            name: 'music_me',
            version: '22.1.0',
        }
    }
);

