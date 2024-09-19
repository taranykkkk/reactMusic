import styles from './topMixes.module.scss';
import {MdPauseCircle, MdPlayCircle} from "react-icons/md";
import {GoHeart, GoHeartFill} from "react-icons/go";
import MusicBitRate from "@/musicBitRate";
import {useEffect, useState} from "react";
import {AnalysisData, getTrackData} from "@/api/spotifyWebApi";
import {useUser} from "@/contexts/userContext";
import Recommended from "@/components/recommended";

const TopMixes = ({preview, tracks}) => {
    const [currentId, setCurrentId] = useState(tracks[0].id)
    const [analysisData, setAnalysisData] = useState([]);
    const [audioData, setAudioData] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const {userData, addOrRemoveTrack} = useUser()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bitRateData, trackData] = await Promise.all([
                    AnalysisData(currentId),
                    getTrackData(currentId)
                ]);
                setAnalysisData(bitRateData.bars);
                setAudioData(trackData.preview_url);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, [currentId]);


    return (
        <div className='container'>
            <div className={styles.topMixesPreviewContainer}>
                <div className={styles.topMixesPreviewDesc}>
                    <h2 className={styles.topMixesPreviewName}>{preview.name}</h2>
                    <h4 className={styles.topMixesPreviewOwner}>{preview.owner}</h4>
                    <MusicBitRate
                        currentTrack={tracks.find(elem => elem.id === currentId)}
                        analysisData={analysisData}
                        audioData={audioData}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                    />
                </div>
                <div className={styles.topMixesPreviewImageContainer}>
                    <img src={preview.image} className={styles.topMixesPreviewImage}/>
                    <Recommended currentId={currentId}/>
                </div>
            </div>
            <div className={styles.topMixesTracksList}>
                {tracks.map((elem,index) => (
                    <div className={`${styles.topMixesTrackCard} ${isPlaying && currentId === elem.id && styles.isPlaying}`} key={elem.id + index} >
                        <img src={elem.images[2].url} className={styles.topMixesTrackImage} />
                        <div className={styles.topMixesTrackDesc}>
                            <span className={styles.topMixesTrackNumber}>{index+1}</span> {' '}
                            <span className={styles.topMixesTrackArtist}>{elem.artists}</span>
                            <span className={styles.topMixesTrackName}>{elem.name}</span>
                        </div>
                        <div className={styles.topMixesTrackControl}>
                            <button onClick={() => {
                                setCurrentId(elem.id)
                                setIsPlaying(prev => !prev)
                            } }>
                                {isPlaying && currentId === elem.id ? <MdPauseCircle size={25} /> : <MdPlayCircle size={25} />}
                            </button>
                            <button onClick={() => addOrRemoveTrack(elem.id, elem)}>
                                {userData?.likedTrackData?.find(track => track.id === elem.id )
                                    ? <GoHeartFill size={25} /> : <GoHeart size={25} />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TopMixes;