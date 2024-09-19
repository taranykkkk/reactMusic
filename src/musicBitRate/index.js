import { useEffect, useRef, useState } from 'react';
import styles from './musicBitRate.module.scss';
import {formatTime} from "@/utils/utils";

const MusicBitRate = ({ currentTrack, audioData, analysisData, isPlaying, setIsPlaying }) => {
    const canvasRef = useRef(null);
    const maskCanvasRef = useRef(null);
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [hoverTime, setHoverTime] = useState(null);
    const animationRef = useRef(null);
    
    const createAlphaMask = (maskCtx, width, height, barWidth, barSpacing) => {
        maskCtx.clearRect(0, 0, width, height);

        analysisData.forEach((bar, index) => {
            const x = index * (barWidth + barSpacing);
            const barHeight = Math.abs(bar.confidence * 100);

            maskCtx.fillStyle = '#FFFFFF';
            maskCtx.fillRect(x, height - barHeight, barWidth, barHeight);
        });
    };

    const drawWaveform = (ctx, maskCanvas, width, height, currentTime, duration) => {
        ctx.clearRect(0, 0, width, height);

        ctx.save();

        ctx.drawImage(maskCanvas, 0, 0);

        const progress = (currentTime / duration) * width;

        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = 'rgb(35,91,101)';
        ctx.fillRect(0, 0, progress, height);

        ctx.restore();
    };

    const drawHighlight = (ctx, width, height, currentProgress, hoverProgress, barWidth, barSpacing) => {
        const highlightStart = Math.min(currentProgress, hoverProgress);
        const highlightEnd = Math.max(currentProgress, hoverProgress);


        analysisData.forEach((bar, index) => {
            const barStart = index * (barWidth + barSpacing);
            const barEnd = barStart + barWidth;

            if (highlightEnd > barStart && highlightStart < barEnd) {
                const effectiveStart = Math.max(highlightStart, barStart);
                const effectiveEnd = Math.min(highlightEnd, barEnd);


                const barHeight = Math.abs(bar.confidence * 100);
                const yPos = height - barHeight;

                ctx.globalCompositeOperation = 'source-over';
                ctx.fillStyle = 'rgba(30,175,200,0.51)';

                ctx.fillRect(effectiveStart, yPos, effectiveEnd - effectiveStart, height - yPos);
            }
        });
    };

    const animate = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const maskCanvas = maskCanvasRef.current;
        const audio = audioRef.current;

        if (!ctx || !maskCanvas || !audio) return;

        const width = canvas.width;
        const height = canvas.height;
        const totalBars = analysisData.length;
        const barSpacing = 2;
        const barWidth = (width - (totalBars - 1) * barSpacing) / totalBars;

        drawWaveform(ctx, maskCanvas, width, height, audio.currentTime, audio.duration, barWidth, barSpacing);

        if (hoverTime !== null) {
            const hoverProgress = (hoverTime / audio.duration) * width;
            const currentProgress = (audio.currentTime / audio.duration) * width;

            drawHighlight(ctx, width, height, currentProgress, hoverProgress, barWidth, barSpacing);
        }

        animationRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (isPlaying) {
            animationRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationRef.current);
        }

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, currentTime, hoverTime]);

    useEffect(() => {
        const audio = audioRef.current;

        const updateTime = () => {
            if (audio) {
                setCurrentTime(audio.currentTime);
                if (audio.ended) {
                    setCurrentTime(0);
                    setIsPlaying(false);
                }
            }
        };

        if (audio) {
            audio.addEventListener('timeupdate', updateTime);
            return () => {
                audio.removeEventListener('timeupdate', updateTime);
            };
        }
    }, []);

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        } else if (audioRef.current) {
            audioRef.current.pause();
        }
    }, [isPlaying, audioData]);

    useEffect(() => {
        const maskCanvas = maskCanvasRef.current;
        const maskCtx = maskCanvas?.getContext('2d');

        if (maskCtx) {
            const width = maskCanvas.width;
            const height = maskCanvas.height;
            const totalBars = analysisData.length;
            const barSpacing = 2;
            const barWidth = (width - (totalBars - 1) * barSpacing) / totalBars;

            createAlphaMask(maskCtx, width, height, barWidth, barSpacing);
        }
    }, [analysisData]);

    const handleCanvasClick = (event) => {
        const canvas = canvasRef.current;
        const audio = audioRef.current;

        if (canvas && audio) {
            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickPositionRatio = clickX / canvas.width;
            const newTime = clickPositionRatio * audio.duration;

            audio.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };


    const handleMouseMove = (event) => {
        const canvas = canvasRef.current;
        const audio = audioRef.current;

        if (canvas && audio) {
            const rect = canvas.getBoundingClientRect();
            const hoverX = event.clientX - rect.left;
            const hoverPositionRatio = hoverX / canvas.width;
            const hoverTime = hoverPositionRatio * audio.duration;
            setHoverTime(hoverTime);
        }
    };

    const handleMouseOut = () => {
        setHoverTime(null);
    };

    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (audio && analysisData) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play().catch(error => {
                    console.error('Error playing audio:', error);
                });
            }
            setIsPlaying(prev => !prev);
        } else {
            console.warn('Audio element not found!');
        }
    };

    return (
        <div className={styles.audioWaveformContainer}>
            <canvas
                ref={canvasRef}
                width={700}
                height={100}
                className={styles.waveformCanvas}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                onMouseOut={handleMouseOut}
            />
            <canvas ref={maskCanvasRef} width={700} height={100}/>
            <audio ref={audioRef} src={audioData} controls style={{display: 'none'}}/>
            <span className={styles.timeTrack} style={{left: 0}}>{formatTime(currentTime)}</span>
            <span className={styles.timeTrack} style={{right: 0}}>{formatTime(audioRef?.current?.duration)}</span>
            <div className={styles.topMixesTrackDesc}>
                <span>{currentTrack.artists}</span>
                <span>{currentTrack.name}</span>
            </div>
            <button onClick={handlePlayPause} className={styles.playPauseButton}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
        </div>
    );
};

export default MusicBitRate;
