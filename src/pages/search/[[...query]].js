import SearchList from "@/components/searchList";
import { useEffect, useState } from "react";
import { getSearchData } from "@/api/spotifyWebApi";
import { useRouter } from "next/router";
import ModalMusicPlayer from "@/components/modalMusicPlayer";

const SearchPage = () => {
    const router = useRouter();
    const [searchData, setSearchData] = useState({
        artists: [],
        playlists: [],
        tracks: [],
    });

    const query = router.query.query || "";

    const fetchData = async () => {
        const response = await getSearchData(query,['artist', 'playlist', 'track']);
        setSearchData((prev) => ({
            ...prev,
            artists: [...prev.artists.concat(response.artists || [])],
            playlists: [...prev.playlists.concat(response.playlists || [])],
            tracks: [...prev.tracks.concat(response.tracks || [])]
        }));
    };

    useEffect(() => {
        if (query) {
            fetchData();
        }
    }, [query]);


    return (
        <div className="container">
            {query ? (
                <>
                    <SearchList data={searchData} changeData={setSearchData} />

                </>

            ) : (
                <p>NOT FOUND</p>
            )}
        </div>
    );
};

export default SearchPage;
