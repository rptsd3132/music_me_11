import {useEffect, useMemo, useState } from "react";
import {Song} from "@/types";
import { useSupabaseClient } from "@/providers/SupabaseProvider";
import toast from "react-hot-toast";



const useGetSongById = (id?: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const[song, setSong] = useState<Song| undefined>(undefined);
    const supabaseClient = useSupabaseClient();

    useEffect ( () =>{
        if(!id) {
            return;
        }

        setIsLoading(true);

        const fetchSong = async () => {
            const{ data, error} = await supabaseClient
            .from("Songs")
            .select("*")
            .eq("id", Number(id))
            .single();

            if(error) {
                setIsLoading(false);
                return toast.error(error.message);

            }

            const transformedSong = {
                ...data,
                id: String(data.id),
                song_path: data.songs_path
            };
            setSong(transformedSong as Song);
            setIsLoading(false);
        }

        fetchSong();  
}, [id, supabaseClient]);

return useMemo( () =>({
    isLoading,
    song

}), [isLoading, song]);



}

export default useGetSongById;