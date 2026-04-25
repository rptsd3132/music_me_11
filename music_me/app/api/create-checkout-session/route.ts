import { createServerClient } from "@supabase/ssr"
import { NextResponse, NextRequest } from "next/server"


import { stripe } from "@/libs/stripe"

import { getURL } from "@/libs/helpers"
import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin"

export async function POST(
    request : NextRequest
){
    const {price, quantity = 1, metadata = {}} = await request.json();
    try{
        console.log('Creating checkout session for price:', price);
        
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll() {},
                },
            }
        );

            const { data: { user } } = await supabase.auth.getUser();
            console.log('Supabase user:', user?.id);

            if (!user?.id) {
                return NextResponse.json(
                    { error: 'User not authenticated' },
                    { status: 401 }
                );
            }

            const customer = await createOrRetrieveCustomer({
                uuid: user.id,
                email: user.email || ''
            });
            console.log('Stripe customer:', customer);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            customer,
            line_items: [
                {
                    price : price.id,
                    quantity
                }
            ],

            mode: 'subscription',
            allow_promotion_codes: true,
            subscription_data: {
                trial_period_days: 7,
                metadata
            },

            success_url: `${getURL()}/account`,
            cancel_url: `${getURL()}`
         });

        console.log('Checkout session created:', session.id, 'URL:', session.url);
        return NextResponse.json({ url: session.url });
    }catch(error: any){
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
