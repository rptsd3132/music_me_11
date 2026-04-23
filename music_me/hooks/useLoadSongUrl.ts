import { Song } from "@/types"
import { useSupabaseClient } from "@/providers/SupabaseProvider";
import { useState, useEffect } from "react";



const useLoadSongUrl = (song:Song | undefined) => {

    const supabaseClient = useSupabaseClient();
    const [songUrl, setSongUrl] = useState<string>('');

    useEffect(() => {
        if(!song || !song.song_path) {
            console.log('useLoadSongUrl: No song or song_path:', {
                hasSong: !!song,
                songPath: song?.song_path
            });
            setSongUrl('');
            return;
        }

        console.log('useLoadSongUrl: Loading URL for:', {
            songId: song.id,
            songPath: song.song_path
        });

        const loadUrl = () => {
            try {
                const {data: songData} = supabaseClient
                .storage
                .from('songs')
                .getPublicUrl(song.song_path);

                console.log('useLoadSongUrl: Got data:', {
                    hasData: !!songData,
                    publicUrl: songData?.publicUrl,
                    publicUrlLength: songData?.publicUrl?.length
                });

                if(songData?.publicUrl) {
                    console.log('useLoadSongUrl: Setting URL');
                    setSongUrl(songData.publicUrl);
                } else {
                    console.error('useLoadSongUrl: No public URL returned', songData);
                    setSongUrl('');
                }
            } catch (error) {
                console.error('useLoadSongUrl: Error loading song URL:', error);
                setSongUrl('');
            }
        };

        loadUrl();
    }, [song?.id, song?.song_path, supabaseClient]);

    return songUrl;
}

export default useLoadSongUrl;
