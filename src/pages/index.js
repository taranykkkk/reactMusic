import Listening from "@/components/listening";
import Top from "@/components/top";
import {getCategories, getTopMixes} from "@/api/spotifyWebApi";

const Home = ({ categories, topMixes }) => {
  return (
        <>
            <Listening data={categories}/>
            <Top data={topMixes}/>
        </>
    );
}
export default Home;


export async function getServerSideProps() {
    try {
        const responseCategories = await getCategories();
        const responseTopMixes = await getTopMixes()

       const categories = responseCategories.filter((data) => data.name !== 'Made For You' && data.name !== 'New Releases' && data.name !== 'Charts')
        const topMixes = responseTopMixes.map(item => {
            const image = item.images.filter(img => img.height === 300 || img.height === null)
            return {
                name: item.name,
                id: item.id,
                description: item.description,
                image
            }
        })

        return {
            props: {
                categories,
                topMixes
            }
        };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return {
            props: {
                categories: [],
                topMixes: []
            }
        };
    }
}