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
import { useEffect, useState, useRef } from "react";
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
    const playRef = useRef<() => void>(() => {});
    const pauseRef = useRef<() => void>(() => {});

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

    const [play, { pause, sound }] = useSound(
        songUrl,
        {
            volume: volume,
            onplay: () => {
                console.log('Sound onplay triggered');
                setIsPlaying(true);
            },
            onend: () => {
                console.log('Sound onend triggered');
                setIsPlaying(false);
                onPlayNext();
            } ,
            onpause: () => {
                console.log('Sound onpause triggered');
                setIsPlaying(false);
            },
            format: ["mp3"],
            html5: true
        }
    );

    // Store references to play and pause
    useEffect(() => {
        console.log('Updating play/pause refs - sound exists:', !!sound);
        playRef.current = play;
        pauseRef.current = pause;
    }, [play, pause]);

    // Handle song playback
    useEffect(() => {
        console.log('Playback effect:', {
            soundReady: !!sound,
            songUrl: songUrl,
            songUrlType: typeof songUrl,
            songUrlLength: songUrl?.length,
            activeId: Player.activeId,
            songId: song.id,
            songPath: song.song_path,
            isCurrentSong: Player.activeId === song.id
        });

        if(!sound) {
            console.log('Sound not ready yet');
            return;
        }

        const isCurrentSong = Player.activeId === song.id;
        
        if (isCurrentSong && songUrl) {
            console.log('Calling play function for:', song.id);
            try {
                playRef.current();
                console.log('Play called successfully');
            } catch (e) {
                console.error('Error calling play:', e);
            }
        } else {
            console.log('Pausing or not current song');
            try {
                pauseRef.current();
            } catch (e) {
                console.error('Error calling pause:', e);
            }
        }
    }, [Player.activeId, song.id, sound, songUrl]);

    useEffect(() => {
        return () => {
            sound?.unload();
        }
    }, [sound]);

    useEffect(() => {
        if(sound) {
            sound.volume(volume);
        }
    }, [volume, sound]);

    const handlePlay = () => {
        console.log('handlePlay called - isPlaying:', isPlaying, 'playRef:', !!playRef.current);
        if(!isPlaying){
            console.log('Attempting to play');
            try {
                playRef.current();
            } catch (e) {
                console.error('Error in handlePlay:', e);
            }
        }else{
            console.log('Attempting to pause');
            try {
                pauseRef.current();
            } catch (e) {
                console.error('Error in handlePause:', e);
            }
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
                    onChange={(value) => setVolume(value)}
                    />
                </div>
            </div>
        </div>
    )
       
    
}

export default PlayerContent;