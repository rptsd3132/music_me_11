"use client";

import { Database } from "@/database.types";
import React, { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

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

    return <>{children}</>;
}

export default SupabaseProvider;
