"use client";

import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { useSupabaseClient } from "@/providers/SupabaseProvider";
import { useContext, useEffect } from "react";
import { UserContext } from "@/hooks/useUser";

import {Auth} from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import useAuthModal from "@/hooks/useAuthModal";

const AuthModal = () =>{
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const userContext = useContext(UserContext);
    const{onClose,isOpen} = useAuthModal();

    useEffect(()=>{
        if(userContext?.user){
            router.refresh();
            onClose();

        }
    },[userContext?.user,router,onClose]);


    const onChange = (open : boolean) => {
    if(!open){
        onClose();
    }}
    return(

        <Modal
        title="Welcome Back"
        description="Login to your account"
        isOpen={isOpen}
        onChange={onChange}
        >
            Auth modal children
            <Auth
            theme="dark"
            providers={["github"]}
            magicLink
            supabaseClient={supabaseClient}
            appearance={{
                theme: ThemeSupa,
                variables:{
                    default:{
                        colors:{
                            brand:"#404040",
                            brandAccent:"#22c55e"
                        }
                    }
                }
            }}

            
            />
        </Modal>

    );
}

export default AuthModal;