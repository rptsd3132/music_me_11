import { createClient } from '@supabase/supabase-js';
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { stripe } from "@/libs/stripe"

import { getURL } from "@/libs/helpers"
import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin"

export async function POST(){
    try{
        const cookieStore = await cookies();
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );

        const { data: { user } } = await supabase.auth.getUser();

        if(!user) throw new Error('User not authenticated');

        const customer = await createOrRetrieveCustomer({
            uuid: user.id || '',
            email: user.email || ''
        });

        if(!customer) throw new Error('Unable to create or retrieve customer');

        const {url} = await stripe.billingPortal.sessions.create({
            customer,
            return_url: `${getURL()}/account`

        });

        return NextResponse.json({url});

    }
    catch(error: any){
        console.log(error);
        return new NextResponse( 'internal Error' , { status: 500 });
    }
}