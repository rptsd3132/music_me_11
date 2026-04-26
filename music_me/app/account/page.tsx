"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import Header from "@/components/Header";
import Box from "@/components/Box";
import AccountContent from "./components/AccountContent";

const Account = () => {
    const router = useRouter();
    const { subscription, isLoading } = useUser();

    useEffect(() => {
        // Auto-redirect to home once subscription is confirmed
        if (!isLoading && subscription) {
            const timer = setTimeout(() => {
                router.push("/");
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [subscription, isLoading, router]);

    return(
        <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
            <Header className="from-bg-neutral-900 h-20 mb-4">
                <div className="mb-2 flex flex-col gap-y-6">
                    <h1 className="text-white text-3xl font-semibold">Account Setting</h1>
                </div>
            </Header>
            
            {isLoading ? (
                <Box className="h-full items-center justify-center text-center">
                    <div className="text-white text-lg">Processing your subscription...</div>
                </Box>
            ) : (
                <AccountContent />
            )}
        </div>
    );
}

export default Account;
