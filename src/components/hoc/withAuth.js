import { signInWithPopup } from '../../../firebaseConfig';

const withAuth = (Component, auth, googleProvider, githubProvider) => {
    return (props) => {
        const handleSignIn = async (provider) => {
            try {
                await signInWithPopup(auth, provider);
            } catch (error) {
                console.error(`Error signing in with ${provider === googleProvider ? 'Google' : 'GitHub'}:`, error);
            }
        };

        return (
            <Component
                {...props}
                handleGoogleSignIn={() => handleSignIn(googleProvider)}
                handleGithubSignIn={() => handleSignIn(githubProvider)}
            />
        );
    };
};

export default withAuth;
