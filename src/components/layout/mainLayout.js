import Header from "@/components/header";
import Loader from "@/components/loader";

const MainLayout = ({loading, children}) => {
    return (
        <>
            <Header />
            {loading ? <Loader /> : children}
        </>
    )
}

export default MainLayout;