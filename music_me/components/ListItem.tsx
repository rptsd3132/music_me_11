"use client";

import { useRouter } from "next/dist/client/components/navigation";
import React from "react";

interface ListItemProps {
    image: string;
    name: string;
    href: string;
}


const ListItem: React.FC<ListItemProps> = ({ 
    image,
     name, 
     href 
    }) => {
        const route = useRouter();
        const onClick = ()=>{
            // add authentication befor push
            route.push(href);
        }
    return (
        <button
        className="
        relative
        group
        flex
        items-center
        rounded-md
        overflow-hidden
        gap-x-4
        bg-neutral-100/10
        hover:bg-neutral-100/10
        transition
        pr-4
        "
        >
           <div
           className="
           relative
           min-h-[64px]
           min-w-[64px]
           "
           >
            {/* <Image/> */}

            
           </div>
        </button>
    )
}

export default ListItem;
