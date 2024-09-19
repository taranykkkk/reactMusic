import Draggable from 'react-draggable';
import styles from './modalMusicPlayer.module.scss';
import { IoPlayBackOutline, IoPlayOutline, IoPlayForwardOutline, IoPauseOutline } from 'react-icons/io5';
import React, { useEffect, useRef, useState } from 'react';

const ModalMusicPlayer = ({ data }) => {
    const authorRef = useRef(null);
    const trackNameRef = useRef(null);
    const audioRef = useRef(null);
    const [currentPlay, setCurrentPlay] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [overflow, setOverflow] = useState({
        author: false,
        trackName: false,
    });

    useEffect(() => {
        setCurrentPlay(0);
    }, [data])

    const getBounds = () => ({
        right: window.innerWidth - 400,
        bottom: window.innerHeight - 300
    });

    const checkTextOverflow = (ref) => {
        return ref.current.scrollWidth > ref.current.clientWidth;
    };

    useEffect(() => {
        if (authorRef.current && checkTextOverflow(authorRef)) {
            setOverflow(prev => ({ ...prev, author: true }));
        } else {
            setOverflow(prev => ({ ...prev, author: false }));
        }
    }, [authorRef.current?.scrollWidth, data.tracks[currentPlay]?.artists]);

    useEffect(() => {
        if (trackNameRef.current && checkTextOverflow(trackNameRef)) {
            setOverflow(prev => ({ ...prev, trackName: true }));
        } else {
            setOverflow(prev => ({ ...prev, trackName: false }));
        }
    }, [trackNameRef.current?.scrollWidth, data.tracks[currentPlay]?.name]);

    const handlePrev = () => {
        if (currentPlay !== 0) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
            setCurrentPlay(prev => prev - 1);
        }
    };

    const handleTogglePlay = () => {
        if (data.tracks[currentPlay].audio) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleNext = () => {
        if (data.tracks.length - 1 > currentPlay) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
            setCurrentPlay(prev => prev + 1);
        }
    };

    return (
        <Draggable bounds={getBounds()}>
            <div className={styles.modalMusicPlayerWrapper}>
                <div className={styles.modalMusicPlayerContainer}>
                    <div className={styles.modalMusicPlayerDescContainer}>
                        <img src={data.tracks[currentPlay].image} className={styles.modalMusicPlayerImg}
                             alt="Track image"/>
                        <div className={styles.modalMusicPlayerTextContainer}>
                            <h3 className={`${styles.modalMusicPlayerText} ${overflow.author ? styles.animation : ''}`}
                                ref={authorRef}>
                                {data.tracks[currentPlay]?.artists}
                            </h3>
                            <h3 className={`${styles.modalMusicPlayerText} ${overflow.trackName ? styles.animation : ''}`}
                                ref={trackNameRef}>
                                {data.tracks[currentPlay]?.name}
                            </h3>
                        </div>
                    </div>
                    <audio
                        ref={audioRef}
                        src={data.tracks[currentPlay]?.audio}
                        preload="metadata"
                        onEnded={()=> setIsPlaying(false)}
                    />
                    {!data.tracks[currentPlay]?.audio && <div className={styles.fatalMessage}>Not available in your country</div> }
                    <div className={styles.modalMusicPlayerControl}>
                        <button onClick={handlePrev}>
                            <IoPlayBackOutline size={40} />
                        </button>
                        <button onClick={handleTogglePlay}>
                            {isPlaying ? <IoPauseOutline size={40}/> : <IoPlayOutline size={40}/>}
                        </button>
                        <button onClick={handleNext}>
                            <IoPlayForwardOutline size={40} />
                        </button>
                    </div>
                </div>
            </div>
        </Draggable>
    );
};

export default ModalMusicPlayer;
