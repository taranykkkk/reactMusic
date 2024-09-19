import React, { useState, useRef, useEffect } from 'react';
import styles from './musicPlayer.module.scss';
import {
    TbPlayerSkipBackFilled,
    TbPlayerPlayFilled,
    TbPlayerSkipForwardFilled,
    TbPlayerPauseFilled
} from 'react-icons/tb';
import { GoHeartFill, GoHeart } from "react-icons/go";
import { useUser } from "@/contexts/userContext";
import {formatTime, isObjectNotEmpty} from "@/utils/utils";

const MusicPlayer = ({ track, isPlayTrack, playTrack, nextTrack, prevTrack }) => {
    const [isPlaying, setIsPlaying] = useState(Boolean(isPlayTrack));
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const { userData, addOrRemoveTrack } = useUser();

    const togglePlay = () => {
        if (isObjectNotEmpty(track)) {
            if (isPlaying) {
                audioRef.current.pause();
                playTrack(0)
            } else {
                audioRef.current.play();
                playTrack(track.id);
            }
            setIsPlaying(!isPlaying);
        }
    };

    const updateTime = () => {
        const current = audioRef.current.currentTime;
        setCurrentTime(current);

        if (current >= duration) {
            audioRef.current.pause();
            setIsPlaying(false);
            setCurrentTime(duration);
        }
    };

    const updateDuration = () => {
        setDuration(audioRef.current.duration);
    };

    const handleRangeChange = (e) => {
        const newTime = parseFloat(e.target.value);
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    useEffect(() => {
        if (!isObjectNotEmpty(track)) return;

        if (isPlayTrack !== track.id) {
            if (audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, [isPlayTrack, track]);

    useEffect(() => {
        if (isObjectNotEmpty(track)) {
            setIsPlaying(false);
            setCurrentTime(0);
            setDuration(0);
            playTrack(track.id);

            if (audioRef.current) {
                audioRef.current.load();
                audioRef.current.addEventListener('canplaythrough', () => {
                    audioRef.current.play();
                    setIsPlaying(true);
                });
            }
        }
    }, [track]);

    useEffect(() => {
        const audio = audioRef.current;
        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('canplaythrough', updateDuration);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('canplaythrough', updateDuration);
        };
    }, [duration]);

    return (
        <div className={styles.musicPlayerContainer}>
            <div
                className={`${styles.musicPlayerTrackDesc} ${isPlaying ? styles.playNow : ''}`}
                style={{ visibility: Object.keys(track).length && Object.keys(track.images).length ? 'visible' : 'hidden' }}
            >
                <img src={track.images[2]?.url} alt={track.name} className={styles.musicPlayerTrackImg} />
                <div className={styles.musicPlayerTrackDescText}>
                    <h3 className={styles.musicPlayerTrackName}>{track.name}</h3>
                    <h6 className={styles.musicPlayerTrackArtist}>{track.artists}</h6>
                </div>
            </div>
            <div className={styles.musicPlayerControl}>
                <div className={styles.musicPlayerControlBtns}>
                    <button onClick={prevTrack}>
                        <TbPlayerSkipBackFilled size={20} />
                    </button>
                    <button onClick={togglePlay}>
                        {isPlaying ? <TbPlayerPauseFilled size={20} /> : <TbPlayerPlayFilled size={20} />}
                    </button>
                    <button onClick={nextTrack}>
                        <TbPlayerSkipForwardFilled size={20} />
                    </button>
                </div>
                <div className={styles.musicPlayerControlRewindContainer}>
                    <input
                        type="range"
                        min="0"
                        max={Math.floor(duration)}
                        value={currentTime}
                        className={styles.musicPlayerControlRewind}
                        onChange={handleRangeChange}
                    />
                    <span className={styles.musicTime} style={{left: 0}}>{formatTime(currentTime)}</span>
                    <span className={styles.musicTime} style={{right: 0}}>{formatTime(duration)}</span>
                    <button className={styles.musicIsLiked} onClick={() => addOrRemoveTrack(track.id, track)}>
                        {userData?.likedTrackData.find(({id}) => id === track.id) ? <GoHeartFill size={20}/> :
                            <GoHeart size={20}/>}
                    </button>
                </div>

                <audio ref={audioRef} src={track.audio} preload="metadata"/>
            </div>
        </div>
    );
};

export default MusicPlayer;
