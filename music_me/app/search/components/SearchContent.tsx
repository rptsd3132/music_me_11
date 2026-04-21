"use client";

import MediaItem from "@/components/MediaItem";
import { Song } from "@/types";

interface SearchContentProps {
    Songs: Song[]
}

const SearchContent: React.FC<SearchContentProps>  = ( {
    Songs
}) =>{

    if (Songs.length === 0 ){
        return (

            <div 
            className="
            flex
            flex-col
            gap-y-2
            px-6
            text-neutral-400"
            >
                NO songs found.
            </div>
        )
    }
    return (
        <div className="flex flex-col gap-y-2 px-6">
            {Songs.map((Song)=>(
                <div

                key={Song.id}
                className="
                flex
                items-center
                gap-x-4
                 w-full" >

                    <div className="flex-1">
                        <MediaItem 
                        onClick={() => {}} 
                        data={Song}/>

                    </div>
                    {/* add like button  */}
                </div>
            ))}

            </div>
)
}
    

export default SearchContent;


