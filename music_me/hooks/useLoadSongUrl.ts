import { Song } from "@/types"
import { useSupabaseClient } from "@/providers/SupabaseProvider";
import { useState, useEffect } from "react";



const useLoadSongUrl = (song:Song) => {

    const supabaseClient = useSupabaseClient();
    const [songUrl, setSongUrl] = useState<string>('');

    useEffect(() => {
        if(!song) {
            setSongUrl('');
            return;
        }

        const loadUrl = async () => {
            try {
                const {data: songData} = supabaseClient
                .storage
                .from('Songs')
                .getPublicUrl(song.song_path);

                if(songData?.publicUrl) {
                    setSongUrl(songData.publicUrl);
                } else {
                    setSongUrl('');
                }
            } catch (error) {
                console.error('Error loading song URL:', error);
                setSongUrl('');
            }
        };

        loadUrl();
    }, [song?.id, supabaseClient]);

    return songUrl;
}

    export default useLoadSongUrl;
