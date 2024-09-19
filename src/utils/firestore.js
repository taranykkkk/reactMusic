import { database } from '../../firebaseConfig';
import { doc, setDoc, deleteDoc, getDoc,getDocs,collection } from 'firebase/firestore';

import { getAuth } from 'firebase/auth';

const auth = getAuth();

export async function addTrack(trackId, trackData) {
    const user = auth.currentUser;
    if (user) {
        try {
            await setDoc(doc(database, `users/${user.uid}/likedTracks/${trackId}`), trackData);
            console.log('Track added successfully');
        } catch (error) {
            console.error('Error adding track: ', error);
        }
    } else {
        console.error('User is not authenticated');
    }
}

export async function removeTrack(trackId) {
    const user = auth.currentUser;
    if (user) {
        try {
            await deleteDoc(doc(database, `users/${user.uid}/likedTracks/${trackId}`));
            console.log('Track removed successfully');
        } catch (error) {
            console.error('Error removing track: ', error);
        }
    } else {
        console.error('User is not authenticated');
    }
}

export async function getTrack(trackId) {
    const user = auth.currentUser;
    if (user) {
        try {
            const trackRef = doc(database, `users/${user.uid}/likedTracks/${trackId}`);
            const docSnap = await getDoc(trackRef);

            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                console.log('No such document!');
                return null;
            }
        } catch (error) {
            console.error('Error getting track: ', error);
        }
    } else {
        console.error('User is not authenticated');
    }
}

export async function getAllLikedTracks() {
    const user = auth.currentUser;
    const userId = user?.uid;
    if (userId) {
        try {
            const likedTracksCollectionRef = collection(database, `users/${userId}/likedTracks`);
            const querySnapshot = await getDocs(likedTracksCollectionRef);

            const tracks = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            //console.log('Liked tracks:', tracks);
            return tracks;
        } catch (error) {
            console.error('Error getting liked tracks: ', error);
        }
    } else {
        console.error('User is not authenticated');
    }
}

