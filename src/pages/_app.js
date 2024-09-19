import '@/styles/globals.scss';
import MainLayout from '@/components/layout/mainLayout';
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {UserProvider} from "@/contexts/userContext";


const App = ({ Component, pageProps }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleRouteChangeStart = () => setLoading(true);
        const handleRouteChangeComplete = () => setLoading(false);
        const handleRouteChangeError = () => setLoading(false);

        router.events.on('routeChangeStart', handleRouteChangeStart);
        router.events.on('routeChangeComplete', handleRouteChangeComplete);
        router.events.on('routeChangeError', handleRouteChangeError);

        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
            router.events.off('routeChangeError', handleRouteChangeError);
        };
    }, [router]);


    return (
        <UserProvider>
            <MainLayout loading={loading}>
                <Component {...pageProps} />
            </MainLayout>
        </UserProvider>
    );
};

export default App;
