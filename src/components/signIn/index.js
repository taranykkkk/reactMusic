import styles from './signIn.module.scss'
import { SlSocialGoogle } from "react-icons/sl"
import { FaGithubAlt } from "react-icons/fa"
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import {  useEffect } from "react";
import { useRouter } from 'next/router';
import { auth, googleProvider, githubProvider} from '../../../firebaseConfig';
import withAuth from "@/components/hoc/withAuth";

const SignIn = ({ handleGoogleSignIn, handleGithubSignIn }) => {
    const [user] = useAuthState(auth);
    const router = useRouter();


    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);


    return (
        <div className={styles.signInContainer}>
            <h1 className={styles.signInTitle}>Let’s get you in</h1>

            <ul className={styles.signInSocialBtn}>
                <li onClick={handleGoogleSignIn}>
                    <SlSocialGoogle size={25}/>
                    <span>Continue with Google</span>
                </li>
                <li onClick={handleGithubSignIn}>
                    <FaGithubAlt size={25}/>
                    <span>Continue with GitHub</span>
                </li>
            </ul>

            <div className={styles.signInVariables}>
                <span />
                or
                <span />
            </div>

            <button className={styles.signInSuccess} onClick={() => router.push('/sign-up')}>
                Log in with a password
            </button>

            <span className={styles.account}>
                Don’t have an account? {' '}
                <Link href={'/sign-up'}>Sign Up</Link>
            </span>
        </div>
    );
}

export default withAuth(SignIn, auth, googleProvider, githubProvider);