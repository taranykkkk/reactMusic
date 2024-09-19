import TopMixes from "@/components/topMixes";
import { getTracksData } from "@/api/spotifyWebApi";

const TopMixesPage = ({mixes_data,topMixesTrackData}) => {
    return (
        <TopMixes preview={mixes_data} tracks={topMixesTrackData}/>
    )
}

export default TopMixesPage;


export async function getServerSideProps({params}) {

    try {
        const { mixes_data, tracks } = await getTracksData(params.name)

        const topMixesTrackData = tracks.map(obj => {
            return {
                id: obj.id,
                artists: obj.artists.map(artist => artist.name).join(', '),
                images: obj.album.images,
                name: obj.name,
                audio: obj.preview_url,
            }
        })
        return {
            props: {
                mixes_data,
                topMixesTrackData
            }
        }

    } catch (error) {
        console.error('Error fetching mix data:', error);
        return {
            props: {
                topMixesTrackData: []
            }
        };
    }
}