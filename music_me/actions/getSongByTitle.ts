import { Song } from "@/types";
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers";
import getSongs from "@/actions/getSongs";


const getSongsByTitle = async (title: string) : Promise<Song[]> => {
const  supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        cookies: {
            async getAll() {
                return (await cookies()).getAll();
            },
            async setAll(cookiesToSet) {
                const cookieStore = await cookies();
                cookiesToSet.forEach(({ name, value, options }) =>
                    cookieStore.set(name, value, options)
                );
            },
        },
    }
);

if (!title){
    const allSongs = await getSongs();
    return allSongs;

}

const {
   data: sessionData,
    error: sessionError
} = await supabase.auth.getSession();

const {data,error} = await supabase
.from("Songs")
.select('*')
.ilike('title', `%${title}%`)
.order('created_at', {ascending : false});

if(error){
  console.log(error.message);
  return[];
}

return (data as any) || [];

};

export default getSongsByTitle;



