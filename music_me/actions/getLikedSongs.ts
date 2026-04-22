import { Song } from "@/types";
import { Database } from "@/database.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";


const getLikedSongs = async () : Promise<Song[]> => {
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

const {
  data: {session

  }
} = await supabase.auth.getSession();

if (!session?.user?.id) {
  return [];
}

const {data, error} = await supabase
  .from("liked_songs")
  .select('*, Songs(*)')
  .eq('user_id', session.user.id)
  .order('created_at', {ascending : false});

  if (error){
    console.log(error);
    return[];
  }
    if (!data){
      return[];
    }

return data.map((item)=>({
  ...item.Songs,
  song_path: item.Songs.songs_path,
  id: item.Songs.id.toString()
})).filter((song) => song.user_id && song.author && song.title && song.song_path && song.image_path) as Song[]

};

export default getLikedSongs;



