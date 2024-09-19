import { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuthStateChanged } from '../../firebaseConfig';
import {useRouter} from "next/router";
import Loader from "@/components/loader";
import { addTrack, getAllLikedTracks, getTrack, removeTrack} from "@/utils/firestore";
import {useAuthState} from "react-firebase-hooks/auth";

const UserContext = createContext({ user: null, loading: true });

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState('')
    const router = useRouter();

    const [user] = useAuthState(auth);

    const addOrRemoveTrack = async (id,track) => {
        const findTrack = await getTrack(id);

        if(findTrack){
            await removeTrack(id)
            setUpdate(false)
        } else {
            await addTrack(id, track)
            setUpdate(true)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            const likedTrackData = await getAllLikedTracks();

            setUserData({...currentUser, likedTrackData});
            setLoading(false);
        }, (error) => {
            console.error('Error fetching user:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [update]);


    useEffect(() => {
        if (!loading && user === null && !['/sign-in', '/sign-up'].includes(router.pathname)) {
            router.push('/sign-in');
        }
    }, [loading, user, router.pathname]);


    return (
        <UserContext.Provider value={{ userData, loading, update, addOrRemoveTrack }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
