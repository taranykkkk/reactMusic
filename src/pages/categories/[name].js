import {getCategories, getPlaylistsByCategory, getTracksFromPlaylists} from "@/api/spotifyWebApi";
import Category from "@/components/category";

const CategoryPage = ({ tracks,categoryName,categoryId }) => {
    return (
        <Category initialData={tracks} categoryName={categoryName} categoryId={categoryId}/>
    );
}

export default CategoryPage;

export async function getServerSideProps({params}) {
    try {
        const category = await getCategories()
        const categoryName = category.find(elem => elem.id === params.name).name

        const responsePlaylists = await getPlaylistsByCategory(params.name, 0, 1);

        const responseTracks = await getTracksFromPlaylists(responsePlaylists, 0, 10)

        const tracks = responseTracks.map(obj => {
            return {
                name: obj.name,
                artists: obj.artists.map(artist => artist.name).join(', '),
                id: obj.id,
                images: obj.album.images.slice(1, 2).map(image => image.url).join('')
            }
        })

        return {
            props: {
                tracks,
                categoryName,
                categoryId:params.name
            }
        };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return {
            props: {
                tracks: [],
                categoryName: '',
                categoryId: ''
            }
        };
    }
}