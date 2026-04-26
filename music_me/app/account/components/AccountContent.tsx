"use client";

import Button from "@/components/Button";
import useSubscribeModal from "@/hooks/useSubscribeModel";
import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helpers";
import { useRouter } from "next/dist/client/components/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast/headless";

const AccountContent = () => {
    const router = useRouter();
    const subscribeModal = useSubscribeModal();
    const {isLoading, subscription, user} = useUser();
    const [loading, setIsLoading] = useState(false);

    useEffect(() => {
        if(!isLoading && !user){
            router.replace("/");
        }
    },[isLoading, user, router]);

    const redirectToCustomerPortal = async () => {
         setIsLoading(true);

         try {
            const {url, error} = await postData({
                url : '/api/create-portal-link'

            });

            window.location.assign(url);

        } catch(error){
            toast.error((error as Error).message);
        }
        
        setIsLoading(false);
     }
     
    return(
        <div className="mb-7 px-60">
            {isLoading && (
                <div className="flex flex-col gap-y-4">
                    <p className="text-white font-semibold">Processing your subscription...</p>
                    <p className="text-gray-400 text-sm">Loading your subscription status. You'll be redirected shortly.</p>
                </div>
            )}

            {!isLoading && !subscription && (
                <div className="flex flex-col gap-y-4">
                    <p className="text-white font-semibold">No active subscription found</p>
                    <p className="text-gray-400 text-sm">Subscribe to unlock all premium features</p>
                    <Button onClick={subscribeModal.onOpen}
                    className="w-[(300px)]">Go Premium</Button>
                </div>
            )}

            {!isLoading && subscription && (
                <div className="flex flex-col gap-y-4">
                    <p className="text-white font-semibold">✓ Premium Account Active</p>
                    <p className="text-white">Plan: <b>{subscription?.prices?.product?.name}</b></p>
                    <p className="text-green-400 text-sm">You can now play any song and add to your library</p>
                    <Button 
                    disabled={loading}
                    onClick={redirectToCustomerPortal}
                    className="w-[(300px)]">Manage Subscription</Button>
                </div>
            )}
        </div>
    );
}

export default AccountContent;