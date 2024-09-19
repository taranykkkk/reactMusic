import styles from './authLayout.module.scss'

const AuthLayout = ({children}) => {
    return (
        <div className={styles.layoutContainer}>
            {children}
        </div>
    )
}

export default AuthLayout;