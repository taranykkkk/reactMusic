import styles from "./signUp.module.scss";
import Link from "next/link";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { SiEnpass } from "react-icons/si";
import { BiShow } from "react-icons/bi";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaGithubAlt } from "react-icons/fa";
import { SlSocialGoogle } from "react-icons/sl";
import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    googleProvider, githubProvider
} from "../../../firebaseConfig";
import withAuth from "@/components/hoc/withAuth";

const SignUp = ({ handleGoogleSignIn, handleGithubSignIn }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleEmailSignIn = async (event) => {
        event.preventDefault();

        try {
            if (isSignUp) {
                try {
                    await signInWithEmailAndPassword(auth, email, password);
                    router.push('/');
                } catch (signInError) {
                    if (signInError.code === 'auth/listLike-not-found') {
                        await createUserWithEmailAndPassword(auth, email, password);
                        router.push('/');
                    } else {
                        setError('Error signing in: ' + signInError.message);
                    }
                }
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                router.push('/');
            }
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                setError('Incorrect password. Please try again.');
            } else if (error.code === 'auth/listLike-not-found') {
                setError('No listLike found with this email. Please sign up.');
            } else {
                setError('Error: ' + error.message);
            }
            console.error('Error signing in with email:', error);
        }
    };

    return (
        <div className={styles.signUpContainer}>
            <h1 className={styles.signUpTitle}>Login to your account</h1>

            <form className={styles.signUpForm} onSubmit={handleEmailSignIn}>
                <label htmlFor='email'>
                    <MdEmail className={styles.icon} size={25} style={{ top: '50%' }} />
                    <input type="email" placeholder='Email' id='email' onChange={(e) => setEmail(e.target.value)} />
                </label>

                <label htmlFor='password'>
                    <RiLockPasswordFill className={styles.icon} size={25} />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' id='password' />

                    {showPassword ?
                        <BiShow onClick={() => setShowPassword(!showPassword)} className={styles.showPassword} size={20} />
                        :
                        <SiEnpass onClick={() => setShowPassword(!showPassword)} className={styles.showPassword} size={20} />
                    }
                </label>

                <label htmlFor='remember'>
                    <input type="checkbox" id='remember' />
                    Remember me
                </label>

                <button className={styles.signUpButton} type='submit'>Log in</button>

                {error && <p className={styles.error}>{error}</p>}
            </form>

            <div className={styles.signUpVariables}>
                <span />
                or continue with
                <span />
            </div>

            <div className={styles.signUpSocial}>
                <button onClick={handleGoogleSignIn}>
                    <SlSocialGoogle size={25} style={{color: '#fff'}}/>
                </button>
                <button onClick={handleGithubSignIn}>
                    <FaGithubAlt size={25} style={{color: '#fff'}}/>
                </button>
            </div>

            <span className={styles.account}>Don’t have an account? {' '}
                <Link href='/sign-up'>Sign Up</Link>
            </span>
        </div>
    );
};

export default withAuth(SignUp,auth, googleProvider, githubProvider);
