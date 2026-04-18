"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Subscription, UserDetails } from "@/types";
import type { User } from "@supabase/supabase-js";
import { Database } from "@/database.types";

type UserContextType = {
    accessToken: string| null;
    user : User | null;
    userDetails: UserDetails | null;
    isLoading: boolean;
    subscription : Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

export interface Props {
    [propsName: string] : any;
};

export const MyUserContextProvider = (props: Props) => {
    const [supabase] = useState(() =>
        createBrowserClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    );

    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setIsLoadingUser(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setIsLoadingUser(false);
        });

        return () => subscription?.unsubscribe();
    }, [supabase]);

    const user = session?.user ?? null;
    const accessToken = session?.access_token ?? null;
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

const getUserDetails = () => supabase.from("users").select("*").single();
const getSubscription = () => 
    supabase
            .from("subscriptions")
            .select(`*, prices(*, products(*))`)
            .in(`status`,[`trialing`, `active`])
            .single();

      useEffect(()=>{
        if (user && !isLoadingData && !userDetails && !subscription){
            setIsLoadingData(true);

            Promise.allSettled(

                [getUserDetails(),getSubscription()]
            ).then(
                (result)=>{
                    const userDetailsPromise = result[0];
                    const subscriptionPromise = result[1];

                    if (userDetailsPromise.status === "fulfilled"){

                        setUserDetails(userDetailsPromise.value.data as UserDetails);
                    }


                    if (subscriptionPromise.status === "fulfilled"){

                        setSubscription(subscriptionPromise.value.data as Subscription);
                    }

                    setIsLoadingData(false);
                }
            );
        }
        else if (!user && !isLoadingUser && !isLoadingData){
            setUserDetails(null);
            setSubscription(null);
        }


      },[user, isLoadingUser]); 
            
const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription
};

return <UserContext.Provider value={value} {...props}/>

};

export const useUser = ()=>{
    const context = useContext(UserContext);
    if (context === undefined){
        throw new Error('useUser must be used within a MyUserContextProvider');
    }

    return context;
}