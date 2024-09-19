import React from 'react';
import styles from "./logo.module.scss";

const Logo = ({onClick}) => {
    return (
        <div className={styles.container} onClick={onClick}>
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

export default Logo;