"use client";

import { Song } from "@/types";
import MediaItem from "@/components/MediaItem";
import LikeButton from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward,  } from "react-icons/ai";
import useOnPlay from "@/hooks/useOnPlay";
import { HiSpeakerWave, HiSpeakerXMark , } from "react-icons/hi2";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import useSound from "use-sound";


interface PlayerContentProps {
    song: Song;
    songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
     song,
    songUrl
 }) => {
    const Player = usePlayer();
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;
    
    const onPlay = useOnPlay([song]);

    const onPlayNext = () => {
        if(Player.ids.length === 0){
            return;
        }

        const currentIndex = Player.ids.findIndex((id) => id === Player.activeId);
        const nextSong = Player.ids[currentIndex + 1];

        if(!nextSong){
            return Player.setId(Player.ids[0]);
        }    
        Player.setId(nextSong);
    }

      const onPlayPrevious = () => {
        if(Player.ids.length === 0){
            return;
        }

        const currentIndex = Player.ids.findIndex((id) => id === Player.activeId);
        const previousSong = Player.ids[currentIndex - 1];

        if(!previousSong){
            return Player.setId(Player.ids[Player.ids.length - 1]);
        }    
        Player.setId(previousSong);
    }

    const [paly, { pause, sound }] = useSound(
        songUrl,
        {
            volume: volume,
            onplay: () => setIsPlaying(true),
            onend: () => {
                setIsPlaying(false);
                onPlayNext();
            } ,
            onpause: () => setIsPlaying(false),
            format: ["mp3"]
        }
    );

    useEffect(() => {
        sound?.play();

        return () => {
            sound?.unload();
        }
    },[sound]);

    const handlePlay = () => {
        if(!isPlaying){
            paly();

        }else{
            pause();
        }
    }

    const toggleMute = () => {
        if(volume === 0){
            setVolume(1);
        }else{
            setVolume(0);
        }
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 h-full">
            <div className="
            flex
            w-full
            justify-start
            ">
                <div className="flex items-center gap-4">
                    <MediaItem data={song} onClick={onPlay} />
                    <LikeButton songId={song.id} />
                </div>
            </div>
            <div className="
            flex
            md:hidden
            col-auto
            w-full
            justify-end
            items-center">
                <div onClick={handlePlay}
                 className="
                 h-10
                w-10
                flex
                items-center
                justify-center
                rounded-full
                bg-white
                p-1
                cursor-pointer
                 ">
                    <Icon size={30} className="text-black"/>
                 </div>
            </div>
            <div className="
            hidden
            h-full
            md:flex
            justify-center
            items-center
            w-full
            max-w-180.5
            gap-x-6">
                <AiFillStepBackward
                onClick={onPlayPrevious}
                size={30}
                className="
                text-white-400
                cursor-pointer
                hover:text-white
                transition"
                />
                <div
                onClick={handlePlay}
                className="
                h-10
                w-10
                flex
                items-center
                justify-center
                rounded-full
                bg-white
                p-1
                cursor-pointer
                "
                >
                    <Icon size={30} className="text-black"/>

                </div>
                <AiFillStepForward
                onClick={onPlayNext}
                size={30}
                className="
                text-white-400
                cursor-pointer
                hover:text-white
                transition"
                />

            </div>
            <div className="hidden md:flex w-full justify-end pr-2">
                <div className="flex items-center gap-2 w-30">
                    <VolumeIcon onClick={toggleMute}
                    className="cursor-pointer"
                    size = {34} />
                    <Slider
                    value={volume}
                    />
                </div>
            </div>
        </div>
    )
       
    
}

export default PlayerContent;