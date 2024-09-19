import styles from './musicVisualizer.module.scss';

const MusicVisualizer = ({isVisibility,position}) => {
    return (
        <div className={styles.musicVisualizerContainer} style={{...position, opacity: `${isVisibility ? 1 : 0}`}}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
        </div>
    );
}

export default MusicVisualizer;