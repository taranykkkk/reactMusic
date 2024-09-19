import styles from './listLike.module.scss'
import { GoHeartFill } from "react-icons/go";
import {useUser} from "@/contexts/userContext";
import {useState} from "react";
import MusicPlayer from "@/components/musicPlayer";
import MusicVisualizer from "@/components/musicVisualizer";

const ListLike = ({data}) => {
    const {addOrRemoveTrack} = useUser()
    const [search, setSearch] = useState('')
    const [isPlayTrack, setIsPlayTrack] = useState(0);
    const [dataTrack, setDataTrack] = useState({
        id: '',
        images: [],
        name: '',
        artists: '',
        audio: ''
    })
    
    const searchData = data.filter(({name, artists}) => name.toLowerCase().includes(search.toLowerCase()) || artists.toLowerCase().includes(search.toLowerCase()))

    const handleNextTrack = () => {
        const currentTrackIndex = data.findIndex(({id}) => id === dataTrack.id)

        if(data.length - 1 > currentTrackIndex){
            setDataTrack(data[currentTrackIndex + 1])
        }
    }

    const handlePrevTrack = () => {
        const currentTrackIndex = data.findIndex(({id}) => id === dataTrack.id)

        if(currentTrackIndex > 0){
            setDataTrack(data[currentTrackIndex - 1])
        }
    }

    return (
        <div className='container'>
            <div className={styles.listLikeHead}>
                <h2 className={styles.listLikeHeadTitle}>Your liked track</h2>
                <label className={styles.listLikeFilter}>
                    Filter
                    <div className={styles.listLikeFilterInput}>
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='filtered...'/>
                    </div>
                </label>
            </div>
            <div className={styles.likeListContainer}>
                {searchData.map((elem) => (
                    <div className={styles.listLikeCard} key={elem.id}>
                        <div className={styles.listLikeCardImageContainer}>
                            <img src={elem.images[1].url} className={styles.listLikeImg}/>
                            <span className={styles.likeListPlayTrack} onClick={() => setDataTrack(elem)}/>
                        </div>
                        <MusicVisualizer isVisibility={isPlayTrack === elem.id} position={{bottom: '55px', right: '20px'}}/>
                        <h4 className={styles.listLikeTrackName}>{elem.name}</h4>
                        <h6 className={styles.listLikeTrackArtist}>{elem.artists}</h6>
                        <button className={styles.listLikeButton} onClick={() => addOrRemoveTrack(elem.id, elem)}>
                            <GoHeartFill size={25}/>
                        </button>

                    </div>
                ))}
            </div>
            {!searchData.length && <div className={styles.notFoundMessage}>
                <span>
                    <b>Could not be found</b> <br/>
                    '{search}'
                </span>
            </div>}
            {data.some(({id}) => id === dataTrack.id) && (<MusicPlayer track={dataTrack} playTrack={setIsPlayTrack} nextTrack={handleNextTrack} prevTrack={handlePrevTrack}/>)}
        </div>
    );
}

export default ListLike;