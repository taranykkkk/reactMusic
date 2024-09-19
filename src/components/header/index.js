import Logo from "@/components/logo";
import {useRouter} from "next/router";
import { auth, signOut } from "../../../firebaseConfig";
import styles from './header.module.scss'
import { BiSolidExit } from "react-icons/bi"
import { FaUserAstronaut } from "react-icons/fa";
import {useUser} from "@/contexts/userContext";
import SearchBar from "@/components/searchBar";

const Header = () => {
    const {userData} = useUser();

    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push('/sign-in');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };
    return (
        <div className='container' style={{paddingTop: '10px'}}>
            <div className={styles.headerContainer}>
                <div className={styles.userWrapper}>
                    <div className={styles.userContainer}
                         onClick={() => userData?.uid && router.push(`/user/${userData.uid}`)}>
                    <span className={styles.userImage}>
                        <FaUserAstronaut size={25}/>
                    </span>
                        {userData?.uid &&
                            <p className={styles.userGreetingsText}>Welcome back! <span>{userData.email}</span></p>}
                    </div>
                </div>
                <Logo onClick={() => router.push('/')}/>
                <div className={styles.exitBtnContainer}>
                    <button onClick={handleSignOut} className={styles.exitBtn}>
                        <BiSolidExit size={25}/>
                    </button>
                </div>
            </div>
            <SearchBar />
        </div>

    );
}

export default Header;