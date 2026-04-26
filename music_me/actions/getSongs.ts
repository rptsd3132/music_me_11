import { Song } from "@/types";
import { Database } from "@/database.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";


const getSongs = async () : Promise<Song[]> => {
const cookieStore = await cookies();

const supabase = createServerClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Components cannot always set cookies.
        }
      },
    },
  }
);

// Ensure we have a valid session before querying
const { data: { session }, error: sessionError } = await supabase.auth.getSession();

if (sessionError) {
  console.error('[getSongs] Session error:', sessionError.message);
  return [];
}

if (!session?.user?.id) {
  console.warn('[getSongs] No authenticated user found');
  return [];
}

const {data, error} = await supabase
  .from("Songs")
  .select('*')
  .order('created_at', {ascending : false});

  if (error){
    console.error('[getSongs] RLS ERROR - Check Supabase RLS policies:', {
      message: error.message,
      code: error.code,
      details: error.details
    });
    // Return empty array instead of throwing to allow page to load
    return [];
  }

  if (!data || data.length === 0) {
    console.warn('[getSongs] No songs found in database');
    return [];
  }
  
console.log('[getSongs] ✓ Successfully fetched', data.length, 'songs');
return (data as any)  || [];

}

export default getSongs;



