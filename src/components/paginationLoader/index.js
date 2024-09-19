import styles from './paginationLoader.module.scss'

const PaginationLoader = () =>{
    return (
        <div className={styles.container}>
            <div className={styles.circles}>
                <div></div>
                <div></div>
                <div></div>
                <span></span>
            </div>
        </div>
    );
}

export default PaginationLoader;