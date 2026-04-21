
"use client";

import Image from "next/image";
import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";

interface MediaItemProps {
    data : Song;
    onClick : (id : string) => void;
}

const MediaItem : React.FC<MediaItemProps> = ({
    
    data, 
    onClick 

}) =>{

    const imageUrl = useLoadImage(data);
    const handaleClick = () =>{
        if(onClick){
            return onClick(data.id);

        }

        // Todo Defalut turn on play
    }

    return(
        <div
        onClick ={handaleClick}
        className="
        flex
        items-center
        gap-x-3
        cursor-pointer
        hover:bg-neutral-800/50
        w-full
        p-2
        rounded-md
        ">

            <div
            
            className="relative
            rounded-md
            min-h-12
            min-w-12
            overflow-hidden"
            >
                <Image
                fill
                src={imageUrl || "/images/liked.png"}
                alt="Media Item"
                className="object-cover"
                
                />


            </div>

            <div
            
            className="flex
            flex-col
            gap-y-1
            overflow-hidden
            ">
                <p className="text-white truncate">{data.title}</p>
                <p className="text-neutral-400 text-sm truncate">
                {data.author}
                </p>
            </div>
           
        </div>
    );
}

export default MediaItem;