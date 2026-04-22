"use client";

import { useUser } from "@/hooks/useUser";
import { Song } from "@/types";
import { useRouter } from "next/dist/client/components/navigation";
import MediaItem from "@/components/MediaItem";
import { useEffect } from "react";
import LikeButton from "@/components/LikeButton";

interface LikedContentProps {
    songs : Song[]
}

const LikedContent: React.FC<LikedContentProps> = ({
    songs
}) => {

        const router = useRouter();
        const {isLoading, user} = useUser();

        useEffect(()=>{
            if(!isLoading && !user){
                router.replace('/');
                
            }
        }, [isLoading, user, router]);

        if (songs.length === 0){
            return(
                <div className="
                flex
                flex-col
                gap-y-2
                w-full
                px-6
                text-neutral-400
                ">No liked songs found.</div>
            )
        }
        


    return(

        <div className="w-full">
            {songs.map((song) => (
                <div
                 key={song.id} className="flex items-center gap-x-4 w-full p-2 hover:bg-neutral-800 rounded-lg">
                    <div className="flex-1">    
                    <MediaItem 
                        data={song} 
                        onClick={() => {}}
                     />
                </div>
                <LikeButton songId={song.id} />
               </div> 
            ))}
        </div>
    );
}

export default LikedContent;
