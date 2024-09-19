import React, {useEffect, useState} from 'react';
import styles from "./recommended.module.scss";
import {TbPlayerPlayFilled} from "react-icons/tb";
import {GoHeartFill} from "react-icons/go";
import { getRecommended } from "@/api/spotifyWebApi";

const Recommended = ({currentId}) => {
    const [recommendedData, setRecommendedData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getRecommended(currentId)
                setRecommendedData(response)
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, [currentId]);

    return (
        <div className={styles.recommendedContainer}>
            <h3>Recommended Tracks</h3>
            <ul className={styles.recommendedTrackList}>
                {recommendedData.map(({id, name, artists, image}) => (
                    <li className={styles.recommendedListItem} key={id}>
                        <img src={image} className={styles.recommendedTrackImage}/>
                        <span className={styles.recommendedArtists}>{artists}</span>
                        <span className={styles.recommendedTrackName}>{name}</span>
                        <div className={styles.recommendedListControl}>
                            <button><TbPlayerPlayFilled size={15}/></button>
                            <button><GoHeartFill size={15}/></button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Recommended;