import {useEffect, useState} from "react";
import {getPlaylistsByCategory, getTracksFromPlaylists} from "@/api/spotifyWebApi";

export const useTracksData = (initialData,categoryId) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;

            const documentHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= documentHeight - 400 && !loading && hasMore) {
                loadMoreData();
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loading, hasMore]);

    const loadMoreData = async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const responsePlaylists = await getPlaylistsByCategory(categoryId, offset, 1);
            const responseTracks = await getTracksFromPlaylists(responsePlaylists, offset, 10);

            const tracks = responseTracks.map(obj => ({
                name: obj.name,
                artists: obj.artists.map(artist => artist.name).join(', '),
                id: obj.id,
                images: obj.album.images.slice(1, 2).map(image => image.url).join('')
            }));

            if (tracks.length === 0) {
                setHasMore(false);
            } else {
                setData(prevData => [...prevData, ...tracks]);
                setOffset(prevOffset => prevOffset + 1);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    return [data, loading]
}
