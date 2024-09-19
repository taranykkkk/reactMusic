import styles from "./searchList.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SearchSlider from "@/components/searchSlider";
import {getModalMusicData, getSearchData} from "@/api/spotifyWebApi";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import ModalMusicPlayer from "@/components/modalMusicPlayer";
import {isObjectNotEmptyV2} from "@/utils/utils";
import MusicVisualizer from "@/components/musicVisualizer";

const SearchList = ({ data, changeData }) => {
    const router = useRouter()

    const query = router.query.query
    const artistsDataLength = data.artists.length
    const playlistsDataLength = data.playlists.length
    const tracksDataLength = data.tracks.length

    const [currentOffset, setCurrentOffset] = useState({
        artistsOffset: 12,
        playlistsOffset: 12,
        tracksOffset: 12
    });
    const [currentPlay, setCurrentPlay] = useState({
        id: '',
        type: ''
    })
    const [musicPlayerData, setMusicPlayerData] = useState(null)

    useEffect(() => {
        if(isObjectNotEmptyV2(currentPlay)){
            const fetchData = async () => {
                const response = await getModalMusicData(currentPlay)
                setMusicPlayerData(response)
            }
            fetchData()
        }
    }, [currentPlay]);

    const fetchDataArtists = async () => {
        const response = await getSearchData(query,['artist'], currentOffset.artistsOffset);
        changeData((prev) => ({
            ...prev,
            artists: [...prev.artists.concat(response.artists || [])],
        }));
        setCurrentOffset(prev => ({
            ...prev,
            artistsOffset: prev.artistsOffset + 12
        }))
    };

    const fetchDataPlaylists = async () => {
        const response = await getSearchData(query,['playlist'], currentOffset.playlistsOffset);
        changeData((prev) => ({
            ...prev,
            playlists: [...prev.playlists.concat(response.playlists || [])],
        }));
        setCurrentOffset(prev => ({
            ...prev,
            playlistsOffset: prev.playlistsOffset + 12
        }))
    };

    const fetchDataTracks = async () => {
        const response = await getSearchData(query,['track'], currentOffset.tracksOffset);
        changeData((prev) => ({
            ...prev,
            tracks: [...prev.tracks.concat(response.tracks || [])],
        }));
        setCurrentOffset(prev => ({
            ...prev,
            tracksOffset: prev.tracksOffset + 12
        }))
    };

    const renderArtists = data.artists?.map(({name, id, images, type}) => {
        const secondImageUrl = images[1]?.url;

        return (
            <div className={styles.artists} key={id} onClick={() => setCurrentPlay({id, type})}>
                <img src={secondImageUrl} className={styles.img} alt={name}/>
                <h4>{name}</h4>
                <div className={styles.isPlaying} style={{opacity: `${currentPlay.id === id ? 1 : 0}`}}>
                    <div className={styles.visualizerContainer}>
                        <MusicVisualizer isVisibility={currentPlay.id === id} />
                    </div>
                </div>
            </div>
        );
    })

    const renderPlaylists = data.playlists?.map(({name, id, images, owner, type}) => {
        const secondImageUrl = images[1]?.url || images[0]?.url;
        const authorName = owner.display_name

        return (
            <div className={styles.playlists} key={id} onClick={() => setCurrentPlay({id, type})}>
                <img src={secondImageUrl} className={styles.img} alt={name}/>
                <h4 className={styles.name}>{name}</h4>
                <h6>{authorName}</h6>
                <div className={styles.isPlaying}>
                    <div className={styles.visualizerContainer}>
                        <MusicVisualizer isVisibility={currentPlay.id === id}/>
                    </div>
                </div>
            </div>
        );
    })

    const renderTracks = data.tracks?.map(({name, id, album, type}) => {
        const secondImageUrl = album.images[1]?.url;
        const artists = album.artists.map(artist => artist.name).join(', ')

         return (
             <div className={styles.tracks} key={id} onClick={() => setCurrentPlay({id, type})}>
                 <img src={secondImageUrl} className={styles.img} alt={name}/>
                 <h4 className={styles.name}>{name}</h4>
                 <h6>{artists}</h6>
             </div>
         );
     })

    return (
        <div className={styles.searchListContainer}>
            {Boolean(artistsDataLength) && (
                <div className={styles.searchListItem}>
                    <h2 className={styles.searchListCategory}>Artists</h2>
                    <SearchSlider
                        render={renderArtists}
                        data={data}
                        dataLength={artistsDataLength}
                        fetchData={fetchDataArtists}
                    />
                </div>
            )}
            {Boolean(playlistsDataLength) && (
                <div className={styles.searchListItem}>
                    <h2 className={styles.searchListCategory}>Playlists</h2>
                    <SearchSlider
                        render={renderPlaylists}
                        data={data}
                        dataLength={playlistsDataLength}
                        fetchData={fetchDataPlaylists}
                    />
                </div>
            )}
            {Boolean(tracksDataLength) && (
                <div className={styles.searchListItem}>
                    <h2 className={styles.searchListCategory}>Tracks</h2>
                    <SearchSlider
                        render={renderTracks}
                        data={data}
                        dataLength={tracksDataLength}
                        fetchData={fetchDataTracks}
                    />
                </div>
            )}
            {musicPlayerData && <ModalMusicPlayer data={musicPlayerData}/>}
        </div>
    );
};

export default SearchList;
