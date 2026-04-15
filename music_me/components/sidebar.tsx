
"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiHome } from "react-icons/hi";
import {BiSearch } from "react-icons/bi";
import Box from "./Box" ;
import Sidebaritem from "./SidebarItem";
import Library from "./Library";


import path from "path";

interface sidebarProps {
    children : React.ReactNode;
}

const Sidebar : React.FC<sidebarProps> = ({ 
    children



}) => {
    const pathname= usePathname ();
    const routes = useMemo (() =>[
        {
            icon : HiHome,
            label: "Home",
            action: pathname !== '/search',
            href : '/',

        },
        {   
            icon : BiSearch,
            label: "Search",
            action : pathname === '/search',
            href : '/search',
        }
    ],[pathname]);

    return (
        <div className = "flex h-full ">
            <div
            className="
              hidden
              md:flex
              flex-col
              gap-y-2
              bg-black
              h-full
              w-75
              p-2
            ">
                <Box>
                    <div className="
                         flex
                         flex-col
                         gap-y-4
                         px-5
                         py-4 " 
                    >
                        {routes.map((item)=>(
                            <Sidebaritem

                            key={item.label}
                        {...item }
                            />
                        ))}

                        </div> 
                </Box>
                <Box className="overflow-y-auto h-full">
                    <Library/> 
                </Box>
                <Box>
                    Sidebar Navigation 
                </Box>
            </div>
            <main className="h-full flex-1 overflow-y-auto py-2">
                {children}
            </main>

        </div>
    );
};

export default Sidebar;
