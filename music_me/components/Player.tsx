"use client";

import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";
import { useEffect } from "react";


const Player =()=>{
    const player = usePlayer();
    const {song} = useGetSongById (player.activeId);

    const songUrl = useLoadSongUrl(song!);

    useEffect(() => {
        console.log('Player component loaded:', {
            activeId: player.activeId,
            songLoaded: !!song,
            songId: song?.id,
            songPath: song?.song_path,
            songUrlLoaded: !!songUrl,
            songUrl: songUrl,
            songUrlLength: songUrl?.length
        });
    }, [player.activeId, song, songUrl]);

    if(!song || !songUrl || !player.activeId){
        return (
            <div className="
            fixed
            bottom-0
            bg-black
            w-full
            py-2
            h-20
            px-4
            flex
            items-center
            justify-center
            text-gray-500
            border-t
            border-gray-800">
                <p>Select a song to play</p>
            </div>
        );
    }

    return (
        <div className="
        fixed
        bottom-0
        bg-black
        w-full
        py-2
        h-20
        px-4">

        <PlayerContent
        key={songUrl}
        song={song}
        songUrl={songUrl}
        
        />
        </div>
    )
}

export default Player;