import styles from './loader.module.scss'

const Loader = () => {

    return (
        <div className={styles.container}>
            <div className={styles.circles}>
                <div></div>
                <div></div>
                <div></div>
                <span></span>
            </div>
            <div className={styles.text}>
                <span>React</span>
                <span>Music</span>
            </div>
        </div>
    );
}

export default Loader;