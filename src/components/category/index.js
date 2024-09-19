import styles from './category.module.scss';
import { MdPlayCircle, MdPauseCircle } from "react-icons/md";
import MusicPlayer from "@/components/musicPlayer";
import { useState } from "react";
import { getTrackData } from "@/api/spotifyWebApi";
import PaginationLoader from "@/components/paginationLoader";
import {useTracksData} from "@/hooks/useTracksData";
import MusicVisualizer from "@/components/musicVisualizer";

const Category = ({ initialData, categoryName, categoryId }) => {
    const [isPlayTrack, setIsPlayTrack] = useState(0);
    const [dataTrack, setDataTrack] = useState({
        id: '',
        images: [],
        name: '',
        artists: '',
        audio: ''
    });

    const [data, loading] = useTracksData(initialData, categoryId)

    const handleGetDataTrack = async (id) => {
        try {
            const response = await getTrackData(id);

            const formattedData = {
                id: response.id,
                images: response.album.images,
                name: response.name,
                artists: response.artists.map(artist => artist.name).join(', '),
                audio: response.preview_url
            };
            setDataTrack(formattedData);
        } catch (error) {
            console.error('Error fetching track data:', error);
        }
    };

    const handleNextTrack = () => {
        const currentTrackIndex = data.findIndex(track => track.id === isPlayTrack)

        if(data.length - 1 > currentTrackIndex){
            handleGetDataTrack(data[currentTrackIndex + 1].id)
        }
    }

    const handlePrevTrack = () => {
        const currentTrackIndex = data.findIndex(track => track.id === isPlayTrack)

        if(currentTrackIndex > 0){
            handleGetDataTrack(data[currentTrackIndex - 1].id)
        }
    }

    return (
        <div className='container'>
            <div className={styles.categoryTitle}>{categoryName}</div>
            <div className={styles.categoryContainer}>
                {data.map(({ id, artists, name, images }, i) => (
                    <div className={styles.categoryTrackContainer} key={id + i}>
                        <img src={images} className={styles.categoryTrackImg} alt={name} />
                        <div className={styles.categoryTrackDesc}>
                            <h4 className={styles.categoryTrackName}>{name}</h4>
                            <h6 className={styles.categoryTrackArtist}>{artists}</h6>
                        </div>
                        <div className={styles.categoryButtons}>
                            <button onClick={() => {
                                if (isPlayTrack !== id) {
                                    handleGetDataTrack(id);
                                } else {
                                    setIsPlayTrack(0)
                                }
                            }}>
                                {isPlayTrack === id ? <MdPauseCircle size={25}/> : <MdPlayCircle size={25}/>}
                            </button>
                            <MusicVisualizer isVisibility={isPlayTrack === id}/>
                        </div>
                    </div>
                ))}
            </div>
            {loading && <PaginationLoader/> }
            <MusicPlayer track={dataTrack} isPlayTrack={isPlayTrack} playTrack={setIsPlayTrack} nextTrack={handleNextTrack} prevTrack={handlePrevTrack}/>
        </div>
    );
};

export default Category;
