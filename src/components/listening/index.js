import styles from './listening.module.scss'
import {useRouter} from "next/router";

const Listening = ({data}) => {
    const router = useRouter();

    const handleClick = (id) => {
        router.push(`/categories/${id}`);
    };

    return (
        <div className='container'>
            <h2 className={styles.listeningTitle}>Continue Listening</h2>
            <div className={styles.listeningContainerCards}>
                {data?.map(({name, id, icons: [{url}]}) => (
                    <div className={styles.listeningCardContainer} key={id} onClick={() => handleClick(id)}>
                        <img src={url} className={styles.listeningCardImg}/>
                        <p className={styles.listeningCardDesc}>{name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Listening;