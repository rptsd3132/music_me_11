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
            {!subscription && (
                <div className="flex flex-col gap-y-4">
                    <p > No active subscription found</p>
                    <Button onClick={subscribeModal.onOpen}
                    className="w-[(300px)]">Subscribe</Button>
                </div>
            ) }

            {subscription && (
                <div className="flex flex-col gap-y-4">
                    <p> You are currently on the<b> {subscription?.prices?.product?.name}</b> plan</p>
                    <Button 
                    disabled={loading  || isLoading}
                    onClick={redirectToCustomerPortal}
                    className="w-[(300px)]">Open customer portal</Button>
                </div>
            )}
        </div>
    );
}

export default AccountContent;