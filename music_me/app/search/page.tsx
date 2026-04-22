
import getSongsByTitle from "@/actions/getSongByTitle";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import SearchContent from "./components/SearchContent";


interface SearchProps {
    searchParams : Promise<{
        title? : string;
    }>
};

export const revalidate = 0;

const Search = async ({searchParams}: SearchProps) =>{
    const params = await searchParams;
    const songs = await getSongsByTitle(params?.title || '');

    return(
    
        <div
        className="
        bg-neutral-900
        rounded-lg
        h-full
        w-full
        overflow-hidden
        overflow-y-auto
        ">
        <Header
        className="from-bg-neutral-900"
        >
            <div className="mb-2 flex flex-col gap-y-2">
                <h1 className="text-white text-3xl font-semibold">
                    Search
                </h1>
                <SearchInput />
            </div>
           
        </Header>
        <SearchContent Songs={songs} />
        </div>
    )
};

export default Search;