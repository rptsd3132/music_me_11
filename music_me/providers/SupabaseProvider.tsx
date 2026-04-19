"use client";

import { Database } from "@/database.types";
import React, { createContext, useContext, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

interface SupabaseContextType {
    supabase: SupabaseClient<Database> | null;
}

const SupabaseContext = createContext<SupabaseContextType>({ supabase: null });

export const useSupabaseClient = () => {
    const { supabase } = useContext(SupabaseContext);
    if (!supabase) {
        throw new Error("useSupabaseClient must be used within SupabaseProvider");
    }
    return supabase;
};

interface SupabaseProviderProps {
    children : React.ReactNode;
}

const SupabaseProvider : React.FC<SupabaseProviderProps>= ({
    children
}) => {
    const [supabaseClient] = useState(() =>
        createBrowserClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    );

    return (
        <SupabaseContext.Provider value={{ supabase: supabaseClient }}>
            {children}
        </SupabaseContext.Provider>
    );
}

export default SupabaseProvider;
